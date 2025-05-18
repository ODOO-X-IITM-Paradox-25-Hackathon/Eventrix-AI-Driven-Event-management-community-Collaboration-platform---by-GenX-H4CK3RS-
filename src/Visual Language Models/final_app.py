import streamlit as st
from PIL import Image
import os
import time
import torch
from io import BytesIO
import base64
import asyncio
from pathlib import Path
from dotenv import load_dotenv
from googletrans import Translator
from gtts import gTTS

# Try to import optional dependencies
try:
    from transformers import AutoImageProcessor, AutoModelForImageClassification
    transformers_available = True
except ImportError:
    transformers_available = False

try:
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
    from langchain_community.chat_message_histories import ChatMessageHistory
    from langchain_core.output_parsers import StrOutputParser
    langchain_available = True
except ImportError:
    langchain_available = False

try:
    from transformers import AutoProcessor, AutoModelForVision2Seq
    from huggingface_hub import login
    from docling_core.types.doc import DoclingDocument
    from docling_core.types.doc.document import DocTagsDocument
    docling_available = True
except ImportError:
    docling_available = False

# Load environment variables
load_dotenv()
GOOGLE_API_KEY = os.getenv("GOOGLE_API_KEY")
HF_TOKEN = os.getenv("HF_TOKEN")

# Initialize session state
if 'chat_history' not in st.session_state:
    st.session_state.chat_history = ChatMessageHistory() if langchain_available else None
if 'extracted_text' not in st.session_state:
    st.session_state.extracted_text = ""
# Add new session state variables to track processing state
if 'processed_image' not in st.session_state:
    st.session_state.processed_image = None
if 'has_processed' not in st.session_state:
    st.session_state.has_processed = False
if 'camera_has_processed' not in st.session_state:
    st.session_state.camera_has_processed = False
if 'camera_image_hash' not in st.session_state:
    st.session_state.camera_image_hash = None
# Add translation cache to avoid repeated translations
if 'translation_cache' not in st.session_state:
    st.session_state.translation_cache = {}

def check_dependencies():
    """Check for missing dependencies"""
    missing = []
    
    # Check for optional dependencies
    if not transformers_available:
        missing.append("transformers huggingface_hub")
    if not langchain_available:
        missing.append("langchain_google_genai langchain_core langchain_community")
    if not docling_available:
        missing.append("docling-core")
    
    return missing

def initialize_chat():
    """Initialize chat components if available"""
    if not langchain_available or not GOOGLE_API_KEY:
        return None
        
    try:
        llm = ChatGoogleGenerativeAI(
            model="gemini-1.5-pro",
            google_api_key=GOOGLE_API_KEY,
            transport="rest"
        )
        prompt = ChatPromptTemplate.from_messages([
            (
                "system",
                "You are a helpful assistant that analyzes OCR results and helps users understand the extracted text."
            ),
            MessagesPlaceholder("chat_history"),
            ("human", "{user_input}"),
        ])
        return prompt | llm | StrOutputParser()
    except Exception as e:
        st.error(f"Error initializing chat: {str(e)}")
        return None

def process_image_docling(image, prompt_text="Convert this page to docling."):
    """Process image using SmolDocling"""
    if not docling_available:
        st.error("SmolDocling dependencies are not installed")
        return None, None, None
        
    if not HF_TOKEN:
        st.warning("HF_TOKEN not found in .env file. Authentication may fail.")
    else:
        try:
            login(token=HF_TOKEN)
        except Exception as e:
            st.error(f"Hugging Face login error: {str(e)}")
            return None, None, None
    
    # Check for CUDA and use CPU if not available
    device = "cpu"  # Force CPU to avoid CUDA memory errors
    
    try:
        start_time = time.time()
        
        # Load processor and model with error handling
        try:
            processor = AutoProcessor.from_pretrained("ds4sd/SmolDocling-256M-preview")
            model = AutoModelForVision2Seq.from_pretrained(
                "ds4sd/SmolDocling-256M-preview",
                torch_dtype=torch.float32,
            ).to(device)
        except Exception as e:
            st.error(f"Error loading SmolDocling model: {str(e)}")
            return None, None, None
        
        # Create input messages
        messages = [
            {
                "role": "user",
                "content": [
                    {"type": "image"},
                    {"type": "text", "text": prompt_text}
                ]
            },
        ]
        
        # Prepare inputs
        prompt = processor.apply_chat_template(messages, add_generation_prompt=True)
        inputs = processor(text=prompt, images=[image], return_tensors="pt")
        inputs = inputs.to(device)
        
        # Generate outputs with optimized settings
        with torch.no_grad():  # Disable gradient calculation to save memory
            generated_ids = model.generate(
                **inputs, 
                max_new_tokens=800,  # Reduced for stability
                do_sample=False      # Deterministic generation
            )
        
        prompt_length = inputs.input_ids.shape[1]
        trimmed_generated_ids = generated_ids[:, prompt_length:]
        doctags = processor.batch_decode(
            trimmed_generated_ids,
            skip_special_tokens=False,
        )[0].lstrip()
        
        # Clean the output
        doctags = doctags.replace("<end_of_utterance>", "").strip()
        
        # Populate document
        doctags_doc = DocTagsDocument.from_doctags_and_image_pairs([doctags], [image])
        
        # Create a docling document
        doc = DoclingDocument(name="Document")
        doc.load_from_doctags(doctags_doc)
        
        # Export as markdown
        md_content = doc.export_to_markdown()
        
        processing_time = time.time() - start_time
        
        return doctags, md_content, processing_time
    except Exception as e:
        st.error(f"Error in SmolDocling processing: {str(e)}")
        import traceback
        st.error(traceback.format_exc())
        return None, None, None

def analyze_image_content(image, question="What is shown in this image?"):
    """Analyze image content using Gemini if available"""
    if not langchain_available or not GOOGLE_API_KEY:
        st.warning("Image analysis requires langchain and Google API key")
        return None
        
    try:
        model = ChatGoogleGenerativeAI(
            model="gemini-1.5-flash",
            google_api_key=GOOGLE_API_KEY,
            transport="rest",
            temperature=0.2,
            max_output_tokens=800
        )
        
        # Convert and resize image
        max_size = (800, 800)  # Reduced size for stability
        if image.width > max_size[0] or image.height > max_size[1]:
            image.thumbnail(max_size, Image.LANCZOS)
        
        buffered = BytesIO()
        image.save(buffered, format="JPEG", quality=85)
        img_base64 = base64.b64encode(buffered.getvalue()).decode()
        
        message = {
            "role": "user",
            "content": [
                {
                    "type": "text",
                    "text": f"{question} Please provide a concise description (under 200 words)."
                },
                {
                    "type": "image_url",
                    "image_url": {
                        "url": f"data:image/jpeg;base64,{img_base64}"
                    }
                }
            ]
        }
        
        response = model.invoke(input=[message])
        
        # Clean up response
        import re
        cleaned_text = re.sub(r'\n+', '\n', response.content)
        cleaned_text = re.sub(r'\s+\.', '.', cleaned_text)
        
        return cleaned_text
        
    except Exception as e:
        st.error(f"Error analyzing image: {str(e)}")
        import traceback
        st.error(traceback.format_exc())
        return None

def get_language_menu():
    """Return dictionary of supported languages"""
    return {
        'English': 'en',
        'Hindi': 'hi',
        'Spanish': 'es',
        'French': 'fr',
        'German': 'de',
        'Chinese': 'zh-CN',
        'Japanese': 'ja',
        'Korean': 'ko',
        'Arabic': 'ar',
        'Russian': 'ru',
        'Italian': 'it',
        'Portuguese': 'pt',
        'Bengali': 'bn',
        'Tamil': 'ta',
        'Telugu': 'te',
        'Marathi': 'mr',
        'Gujarati': 'gu'
    }

def translate_text(text, target_language_code):
    """Translate text with improved error handling"""
    if not text or text.strip() == "" or target_language_code == 'en':
        return text

    try:
        translator = Translator()
        chunks = [text[i:i+300] for i in range(0, len(text), 300)]
        translated_chunks = []

        for i, chunk in enumerate(chunks):
            max_retries = 3
            for attempt in range(max_retries):
                try:
                    if attempt > 0:
                        time.sleep(2)

                    print(f"Attempt {attempt+1}: Translating chunk {i+1}/{len(chunks)}")
                    
                    translation = translator.translate(chunk, dest=target_language_code, src='en')
                    print(f"Translation type: {type(translation)}")  # Debugging
                    
                    # If `translation` is a coroutine, wait for result
                    if asyncio.iscoroutine(translation):
                        translation = asyncio.run(translation)
                        print(f"Coroutine awaited. New Type: {type(translation)}")  # Debugging

                    if hasattr(translation, 'text'):
                        translated_chunks.append(translation.text)
                        break
                    else:
                        print("Translation failed: No `.text` attribute")
                        time.sleep(1)

                except Exception as chunk_error:
                    print(f"Translation error on attempt {attempt+1}: {str(chunk_error)}")
                    time.sleep(1.5)

        return ' '.join(translated_chunks) if translated_chunks else text

    except Exception as e:
        print(f"Translation error: {str(e)}")
        return text


def generate_audio(text, language_code='en'):
    """Generate audio from text"""
    try:
        if not text or text.strip() == "":
            return None
            
        audio_bytes_io = BytesIO()
        tts = gTTS(text=text[:3000], lang=language_code, slow=False)  # Limit text length
        tts.write_to_fp(audio_bytes_io)
        audio_bytes_io.seek(0)
        return audio_bytes_io.getvalue()
    except Exception as e:
        st.error(f"Audio generation error: {str(e)}")
        return None

def generate_image_hash(img):
    """Generate a simple hash for an image to detect changes"""
    buffered = BytesIO()
    img.save(buffered, format="JPEG", quality=50)
    return hash(buffered.getvalue())

def main():
    st.set_page_config(page_title="SmolDocling OCR App", layout="wide")
    
    st.title("📝 SmolDocling OCR Application")
    
    # Check for missing dependencies
    missing_deps = check_dependencies()
    if missing_deps:
        st.warning(f"Missing dependencies: {', '.join(missing_deps)}. Some features may be limited.")
        st.info("Install with: pip install " + " ".join(missing_deps))
    
    # Initialize session state
    if 'chain' not in st.session_state and langchain_available:
        st.session_state.chain = initialize_chat()
        if st.session_state.chain is None:
            st.error("Failed to initialize chat. Check your Google API key.")
    
    # Sidebar
    with st.sidebar:
        st.header("⚙️ Settings")
        
        # SmolDocling task selection
        task_type = st.selectbox(
            "Select task type",
            [
                "Convert this page to docling.",
                "Convert this table to OTSL.",
                "Convert code to text.",
                "Convert formula to latex.",
                "Convert chart to OTSL.",
                "Extract all section header elements on the page."
            ]
        )
        
        # Camera option
        st.markdown("---")
        use_camera = st.checkbox("Use Camera Input")
        
        # Language settings
        st.markdown("---")
        st.subheader("Language Settings")
        languages = get_language_menu()
        selected_language = st.selectbox(
            "Select Output Language",
            options=list(languages.keys()),
            index=list(languages.keys()).index('English')
        )
        
        # Add a translation button in sidebar for always-available translation
        if st.session_state.extracted_text and selected_language != "English":
            if st.button("Translate Current Text", key="sidebar_translate"):
                with st.spinner(f"Translating to {selected_language}..."):
                    translated_text = translate_text(
                        st.session_state.extracted_text, 
                        languages[selected_language]
                    )
                    if translated_text:
                        st.session_state.translated_text = translated_text
                        st.success(f"Text translated to {selected_language}")
                        st.session_state.current_language = selected_language
                        st.rerun()
    
    # Main content area
    if use_camera:
        camera_image = st.camera_input("Take a picture")
        if camera_image is not None:
            try:
                image = Image.open(camera_image).convert("RGB")  # Ensure RGB mode
                
                # Check if this is a new image or we've already processed it
                current_image_hash = generate_image_hash(image)
                is_new_image = (st.session_state.camera_image_hash != current_image_hash)
                
                col1, col2 = st.columns(2)
                
                with col1:
                    st.image(image, caption="Camera Image", use_container_width=True)
                
                with col2:
                    question = st.text_input("Ask about the image:", "What is shown in this image?")
                    
                    # Store the selected language for this analysis
                    if 'current_language' not in st.session_state or st.session_state.current_language != selected_language:
                        st.session_state.current_language = selected_language
                    
                    if st.button("Analyze Image"):
                        # Only run the analysis if it's a new image or hasn't been processed
                        if is_new_image or not st.session_state.camera_has_processed:
                            with st.spinner("Analyzing image..."):
                                analysis = analyze_image_content(image, question)
                                if analysis:
                                    # Update session state
                                    st.session_state.camera_image_hash = current_image_hash
                                    st.session_state.camera_has_processed = True
                                    st.session_state.extracted_text = analysis
                                    
                                    st.markdown("### 🔍 Analysis (English):")
                                    st.write(analysis)
                                    
                                    # Always translate when a non-English language is selected
                                    if selected_language != "English":
                                        with st.spinner(f"Translating to {selected_language}..."):
                                            translated_analysis = translate_text(analysis, languages[selected_language])
                                            if translated_analysis:
                                                st.session_state.translated_text = translated_analysis
                                                st.markdown(f"### 🌐 Analysis in {selected_language}:")
                                                st.write(translated_analysis)
                                                
                                                # Generate audio with translated text
                                                audio_data = generate_audio(translated_analysis, languages[selected_language])
                                                if audio_data:
                                                    st.markdown("### 🔊 Text-to-Speech")
                                                    st.audio(audio_data, format='audio/mp3')
                                                    
                                                    st.download_button(
                                                        label="💾 Download Audio",
                                                        data=audio_data,
                                                        file_name=f"analysis_{selected_language}.mp3",
                                                        mime="audio/mp3"
                                                    )
                                    else:
                                        # English audio
                                        audio_data = generate_audio(analysis, 'en')
                                        if audio_data:
                                            st.markdown("### 🔊 Text-to-Speech")
                                            st.audio(audio_data, format='audio/mp3')
                                            
                                            st.download_button(
                                                label="💾 Download Audio",
                                                data=audio_data,
                                                file_name="analysis_en.mp3",
                                                mime="audio/mp3"
                                            )
                        else:
                            # Just display the previously processed results
                            st.markdown("### 🔍 Analysis (English):")
                            st.write(st.session_state.extracted_text)
                            
                            # Check if we need to translate or use cached translation
                            if selected_language != "English":
                                # If language changed or no translation available, translate again
                                if 'translated_text' not in st.session_state or 'current_language' not in st.session_state or st.session_state.current_language != selected_language:
                                    with st.spinner(f"Translating to {selected_language}..."):
                                        translated_analysis = translate_text(st.session_state.extracted_text, languages[selected_language])
                                        if translated_analysis:
                                            st.session_state.translated_text = translated_analysis
                                            st.session_state.current_language = selected_language
                                else:
                                    translated_analysis = st.session_state.translated_text
                                
                                # Display the translation
                                st.markdown(f"### 🌐 Analysis in {selected_language}:")
                                st.write(translated_analysis)
                                
                                # Generate audio with translated text
                                audio_data = generate_audio(translated_analysis, languages[selected_language])
                                if audio_data:
                                    st.markdown("### 🔊 Text-to-Speech")
                                    st.audio(audio_data, format='audio/mp3')
                                    
                                    st.download_button(
                                        label="💾 Download Audio",
                                        data=audio_data,
                                        file_name=f"analysis_{selected_language}.mp3",
                                        mime="audio/mp3"
                                    )
                            else:
                                # English audio
                                audio_data = generate_audio(st.session_state.extracted_text, 'en')
                                if audio_data:
                                    st.markdown("### 🔊 Text-to-Speech")
                                    st.audio(audio_data, format='audio/mp3')
                                    
                                    st.download_button(
                                        label="💾 Download Audio",
                                        data=audio_data,
                                        file_name="analysis_en.mp3",
                                        mime="audio/mp3"
                                    )
            except Exception as e:
                st.error(f"Error processing camera image: {str(e)}")
                import traceback
                st.error(traceback.format_exc())
    
    # File upload
    uploaded_file = st.file_uploader(
        "Or choose an image...", 
        type=["jpg", "jpeg", "png", "bmp"]
    )
    
    if uploaded_file is not None:
        try:
            # Check if we need to process the image again
            new_image = False
            if st.session_state.processed_image is None:
                new_image = True
            elif hasattr(uploaded_file, 'name') and hasattr(st.session_state.processed_image, 'name'):
                if uploaded_file.name != st.session_state.processed_image.name:
                    new_image = True
            
            image = Image.open(uploaded_file).convert("RGB")  # Ensure RGB mode
            col1, col2 = st.columns(2)
            
            with col1:
                st.image(image, caption="Uploaded Image", use_container_width=True)
            
            with col2:
                # Store the selected language for this analysis
                if 'current_language' not in st.session_state or st.session_state.current_language != selected_language:
                    st.session_state.current_language = selected_language
                
                # Only process if it's a new image or hasn't been processed before
                if new_image or not st.session_state.has_processed:
                    with st.spinner("Processing with SmolDocling..."):
                        doctags, md_content, processing_time = process_image_docling(image, task_type)
                        if doctags and md_content:
                            # Store in session state
                            st.session_state.extracted_text = md_content
                            st.session_state.processed_image = uploaded_file
                            st.session_state.has_processed = True
                            
                            st.markdown("### 📄 SmolDocling Results:")
                            st.markdown(md_content)
                            
                            st.download_button(
                                label="💾 Download Markdown",
                                data=md_content,
                                file_name="docling_results.md",
                                mime="text/markdown"
                            )
                            
                            st.success(f"Processing completed in {processing_time:.2f} seconds")
                            
                            # Translate if a non-English language is selected
                            if selected_language != "English":
                                with st.spinner(f"Translating to {selected_language}..."):
                                    translated_text = translate_text(md_content, languages[selected_language])
                                    if translated_text:
                                        st.session_state.translated_text = translated_text
                                        st.markdown(f"### 🌐 Results in {selected_language}:")
                                        st.markdown(translated_text)
                                        
                                        st.download_button(
                                            label=f"💾 Download {selected_language} Text",
                                            data=translated_text,
                                            file_name=f"translated_results_{selected_language}.txt",
                                            mime="text/plain"
                                        )
                else:
                    # Just display the previously processed results
                    st.markdown("### 📄 SmolDocling Results:")
                    st.markdown(st.session_state.extracted_text)
                    
                    st.download_button(
                        label="💾 Download Markdown",
                        data=st.session_state.extracted_text,
                        file_name="docling_results.md",
                        mime="text/markdown"
                    )
                    
                    # Check if we need to translate or use cached translation
                    if selected_language != "English":
                        # If language changed or no translation available, translate again
                        if 'translated_text' not in st.session_state or 'current_language' not in st.session_state or st.session_state.current_language != selected_language:
                            with st.spinner(f"Translating to {selected_language}..."):
                                translated_text = translate_text(st.session_state.extracted_text, languages[selected_language])
                                if translated_text:
                                    st.session_state.translated_text = translated_text
                                    st.session_state.current_language = selected_language
                        else:
                            translated_text = st.session_state.translated_text
                        
                        # Display the translation
                        st.markdown(f"### 🌐 Results in {selected_language}:")
                        st.markdown(translated_text)
                        
                        st.download_button(
                            label=f"💾 Download {selected_language} Text",
                            data=translated_text,
                            file_name=f"translated_results_{selected_language}.txt",
                            mime="text/plain"
                        )
            
            # Text-to-speech section
            if st.session_state.extracted_text:
                st.markdown("---")
                st.markdown("### 🔊 Text-to-Speech")
                
                # Determine which text to use for TTS
                if selected_language != "English" and 'translated_text' in st.session_state:
                    text_to_process = st.session_state.translated_text
                else:
                    text_to_process = st.session_state.extracted_text
                
                # Generate audio button
                if st.button("Generate Audio"):
                    with st.spinner("Generating audio..."):
                        audio_data = generate_audio(
                            text_to_process, 
                            languages[selected_language]
                        )
                        if audio_data:
                            st.audio(audio_data, format='audio/mp3')
                            
                            st.download_button(
                                label="💾 Download Audio",
                                data=audio_data,
                                file_name=f"audio_{selected_language}.mp3",
                                mime="audio/mp3"
                            )
            
            # Chat interface for analysis
            if langchain_available and st.session_state.chain and st.session_state.extracted_text:
                st.markdown("---")
                st.markdown("### 💬 Ask about the Results")
                
                # Display chat history
                if st.session_state.chat_history and st.session_state.chat_history.messages:
                    for message in st.session_state.chat_history.messages:
                        role = "🤖 Assistant" if "AI" in str(type(message)) else "👤 You"
                        content = message.content
                        
                        # Translate assistant responses if needed
                        if role == "🤖 Assistant" and selected_language != "English":
                            content_key = f"{hash(content)}_{languages[selected_language]}"
                            if content_key in st.session_state.translation_cache:
                                content = st.session_state.translation_cache[content_key]
                            else:
                                with st.spinner(f"Translating to {selected_language}..."):
                                    translated_content = translate_text(content, languages[selected_language])
                                    if translated_content:
                                        content = translated_content
                                        st.session_state.translation_cache[content_key] = translated_content
                        
                        st.write(f"**{role}:** {content}")
                
                # User input
                user_input = st.text_input("Ask about the extracted text:", key="chat_input")
                
                # Send button
                if st.button("Send", key="send_button"):
                    if user_input:
                        try:
                            # Add context to user input
                            context_input = f"Based on this extracted text:\n{st.session_state.extracted_text}\n\nUser question: {user_input}"
                            
                            # Add user message to history
                            st.session_state.chat_history.add_user_message(user_input)
                            
                            # Get AI response
                            response = st.session_state.chain.invoke({
                                "user_input": context_input,
                                "chat_history": st.session_state.chat_history.messages,
                            })
                            
                            # Add AI response to history
                            st.session_state.chat_history.add_ai_message(response)
                            
                            # Don't rerun the whole app - just update the state
                            st.rerun()
                            
                        except Exception as e:
                            st.error(f"Chat error: {str(e)}")
                            import traceback
                            st.error(traceback.format_exc())
                
                # Clear button
                if st.button("Clear Chat", key="clear_button"):
                    st.session_state.chat_history = ChatMessageHistory()
                    st.rerun()
                    
        except Exception as e:
            st.error(f"Error processing image: {str(e)}")
            import traceback
            st.error(traceback.format_exc())
    
    # Information section
    with st.expander("About this app"):
        st.write("""
        ## SmolDocling OCR Application
        
        This app uses SmolDocling, an advanced AI model for document understanding and OCR. It can:
        
        - Extract text from images
        - Understand document structure
        - Process tables, code, formulas, and charts
        - Extract section headers
        
        Additional features:
        - Image analysis with AI
        - Translation to multiple languages
        - Text-to-speech capabilities
        - Interactive chat for analyzing results
        
        ### Requirements
        - AI libraries: transformers, docling-core
        - API keys for certain features
        """)

if __name__ == "__main__":
    main()
