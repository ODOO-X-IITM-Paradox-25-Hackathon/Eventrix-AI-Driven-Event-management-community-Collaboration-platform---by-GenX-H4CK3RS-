import os
from langchain_groq import ChatGroq
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain.callbacks.streaming_stdout import StreamingStdOutCallbackHandler
from dotenv import load_dotenv

load_dotenv()
# Set up the Groq client with your API key
api_key = os.environ.get("GROQ_API_KEY")
client = ChatGroq(api_key=api_key,model="deepseek-r1-distill-llama-70b",streaming=True,  # Enable streaming
        callbacks=[StreamingStdOutCallbackHandler()])

def generate_with_deepseek_r1(prompt):
    """
    Generate text using DeepSeek R1 model via Groq.
    The model will naturally show its reasoning process.
    """
    # Create a system message that encourages step-by-step reasoning
    system_message = """You are DeepSeek R1, an AI assistant specialized in medical reasoning.
    When answering questions, first show your step-by-step reasoning process,
    then provide your final conclusion. I WANT YOU TO FOLLOW streaming approach And EVERYTIME GIVE YOUR URL REFERENCES AT THE END OF THE ANSWER.

CORE RULES:
1. REJECT ALL NON-MEDICAL QUERIES immediately with: "I only answer medical questions. Please ask about health, symptoms, treatments, or medical conditions."
2. DO NOT engage in general conversation or pleasantries.JUST respond to GREETINGS if any.
3. DO DRAW LINES WHICH SEPERATE THE thinking/reasoning part from the Original Answer part
4. ONLY provide medical information in this format:

### Medical Response Format:
1. Topic Verification:
   * Medical Category: [diagnosis/treatment/prevention]
   * Medical Field: [relevant specialty]
   * Urgency Level: [routine/urgent/emergency]

2. Clinical Information:
   * Medical Definition: [term + simple explanation]
   * Key Medical Facts: [bullet-point list]
   * Scientific Background: [brief medical context]

3. Medical Guidance:
   * Standard Protocol: [medical guidelines]
   * Warning Signs: [when to seek care]
   * Professional Advice: [medical recommendations]

RESPONSE VALIDATION:
- Must contain medical terminology
- Must include medical evidence basis
- Must have healthcare disclaimer
- Must stay within medical scope

AUTOMATIC REJECTION:
- Small talk
- Non-medical topics
- Personal opinions
- General advice

MANDATORY DISCLAIMER:
> Medical Notice: This is general medical information only.
> Consult healthcare professionals for personal medical advice.
> Emergency conditions require immediate medical attention."""
    
    # Create a prompt template
    prompt_template = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", "{input}")
    ])
    
    # Create the chain
    chain = prompt_template | client | StrOutputParser()
    try:
        return chain.invoke({"input": prompt})
    except Exception as e:
        return f"Error occurred: {str(e)}"


# Example usage
if __name__ == "__main__":
    flag=True
    while(flag):
        prompt = input("enter your question:")
        response = generate_with_deepseek_r1(prompt)
        print("/n")
        answer=input("Do you want to continue:")
        if(answer.lower()=="no"):
            flag=False

  

