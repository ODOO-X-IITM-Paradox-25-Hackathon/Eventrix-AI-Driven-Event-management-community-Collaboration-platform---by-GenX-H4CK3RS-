export interface VoiceServiceConfig {
  apiKey: string;
  language: string;
}

export const SUPPORTED_LANGUAGES = {
  'en': 'English',
  'hi': 'Hindi',
  'ta': 'Tamil',
  'te': 'Telugu',
  'bn': 'Bengali',
  'gu': 'Gujarati',
  'kn': 'Kannada',
  'ml': 'Malayalam',
  'mr': 'Marathi',
  'pa': 'Punjabi',
  'ur': 'Urdu',
  'fr': 'French',
  'de': 'German',
  'es': 'Spanish',
  'ja': 'Japanese',
  'ko': 'Korean',
  'ru': 'Russian',
  'zh-CN': 'Chinese',
  'ar': 'Arabic',
  'it': 'Italian'
};

// Declare global interfaces for Web Speech API
declare global {
  interface Window {
    SpeechRecognition: typeof SpeechRecognition;
    webkitSpeechRecognition: typeof SpeechRecognition;
  }
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => any) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => any) | null;
  start(): void;
  stop(): void;
}

interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

declare var SpeechRecognition: {
  prototype: SpeechRecognition;
  new(): SpeechRecognition;
};

export class VoiceTranslationService {
  private sarvamApiKey = '56a811e6-81a8-4c71-b0c9-6ea7855c8490';
  private recognition: SpeechRecognition | null = null;
  private synthesis: SpeechSynthesis;

  constructor() {
    this.synthesis = window.speechSynthesis;
    this.initializeSpeechRecognition();
  }

  private initializeSpeechRecognition() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognitionConstructor();
      this.recognition.continuous = false;
      this.recognition.interimResults = false;
      this.recognition.lang = 'en-US';
    }
  }

  async translateText(text: string, targetLanguage: string): Promise<string> {
    try {
      console.log(`VoiceService: Translating "${text}" to ${targetLanguage}`);
      
      // First try Sarvam AI for Indian languages
      if (['hi', 'ta', 'te', 'bn', 'gu', 'kn', 'ml', 'mr', 'pa', 'ur'].includes(targetLanguage)) {
        const sarvamResult = await this.translateWithSarvam(text, targetLanguage);
        if (sarvamResult && sarvamResult !== text) {
          console.log(`VoiceService: Sarvam translation successful: ${sarvamResult}`);
          return sarvamResult;
        }
      }
      
      // Fallback to Google Translate API
      const googleResult = await this.translateWithGoogle(text, targetLanguage);
      if (googleResult && googleResult !== text) {
        console.log(`VoiceService: Google translation successful: ${googleResult}`);
        return googleResult;
      }
      
      console.log(`VoiceService: Translation failed, returning original text: ${text}`);
      return text;
    } catch (error) {
      console.error('VoiceService: Translation error:', error);
      return text;
    }
  }

  private async translateWithSarvam(text: string, targetLanguage: string): Promise<string> {
    try {
      console.log(`VoiceService: Attempting Sarvam translation for: ${text}`);
      const response = await fetch('https://api.sarvam.ai/translate', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.sarvamApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: text,
          source_language_code: 'en-IN',
          target_language_code: `${targetLanguage}-IN`,
          speaker_gender: 'Male',
          mode: 'formal',
          model: 'mayura:v1',
          enable_preprocessing: true
        })
      });

      if (!response.ok) {
        console.error('VoiceService: Sarvam API error:', response.status, response.statusText);
        return text;
      }

      const data = await response.json();
      return data.translated_text || text;
    } catch (error) {
      console.error('VoiceService: Sarvam translation error:', error);
      return text;
    }
  }

  private async translateWithGoogle(text: string, targetLanguage: string): Promise<string> {
    try {
      console.log(`VoiceService: Attempting Google translation for: ${text}`);
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|${targetLanguage}`);
      
      if (!response.ok) {
        console.error('VoiceService: Google API error:', response.status, response.statusText);
        return text;
      }

      const data = await response.json();
      
      if (data.responseStatus === 200 && data.responseData && data.responseData.translatedText) {
        return data.responseData.translatedText;
      }
      
      return text;
    } catch (error) {
      console.error('VoiceService: Google translation error:', error);
      return text;
    }
  }

  startVoiceRecognition(onResult: (text: string) => void, onError?: (error: string) => void): void {
    if (!this.recognition) {
      onError?.('Speech recognition not supported');
      return;
    }

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      onError?.(event.error);
    };

    this.recognition.start();
  }

  stopVoiceRecognition(): void {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  speakText(text: string, language: string = 'en'): void {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = this.getVoiceLang(language);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;

      this.synthesis.speak(utterance);
    }
  }

  private getVoiceLang(languageCode: string): string {
    const langMap: { [key: string]: string } = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'ta': 'ta-IN',
      'te': 'te-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'mr': 'mr-IN',
      'pa': 'pa-IN',
      'ur': 'ur-PK',
      'fr': 'fr-FR',
      'de': 'de-DE',
      'es': 'es-ES',
      'ja': 'ja-JP',
      'ko': 'ko-KR',
      'ru': 'ru-RU',
      'zh-CN': 'zh-CN',
      'ar': 'ar-SA',
      'it': 'it-IT'
    };
    
    return langMap[languageCode] || 'en-US';
  }

  stopSpeaking(): void {
    if (this.synthesis) {
      this.synthesis.cancel();
    }
  }
}
