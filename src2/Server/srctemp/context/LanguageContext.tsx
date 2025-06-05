
import React, { createContext, useContext, useState, ReactNode, useCallback, useEffect } from 'react';
import { VoiceTranslationService } from '../services/voiceService';

interface LanguageContextType {
  selectedLanguage: string;
  setSelectedLanguage: (language: string) => void;
  translateText: (text: string) => Promise<string>;
  speakText: (text: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export const INDIAN_LANGUAGES = {
  'en': 'English',
  'hi': 'हिंदी (Hindi)',
  'ta': 'தமிழ் (Tamil)',
  'te': 'తెలుగు (Telugu)',
  'bn': 'বাংলা (Bengali)',
  'gu': 'ગુજરાતી (Gujarati)',
  'kn': 'ಕನ್ನಡ (Kannada)',
  'ml': 'മലയാളം (Malayalam)',
  'mr': 'मराठी (Marathi)',
  'pa': 'ਪੰਜਾਬੀ (Punjabi)',
  'ur': 'اردو (Urdu)'
};

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const [selectedLanguage, setSelectedLanguageState] = useState(() => {
    return localStorage.getItem('preferredLanguage') || 'en';
  });
  
  const voiceServiceRef = React.useRef(new VoiceTranslationService());

  const setSelectedLanguage = useCallback((language: string) => {
    console.log(`LanguageContext: Language changing from ${selectedLanguage} to ${language}`);
    setSelectedLanguageState(language);
    localStorage.setItem('preferredLanguage', language);
  }, [selectedLanguage]);

  const translateText = useCallback(async (text: string): Promise<string> => {
    if (selectedLanguage === 'en' || !text.trim()) {
      return text;
    }
    
    try {
      console.log(`LanguageContext: Translating "${text}" to ${selectedLanguage}`);
      const translated = await voiceServiceRef.current.translateText(text, selectedLanguage);
      console.log(`LanguageContext: Translation result: "${translated}"`);
      return translated;
    } catch (error) {
      console.error('LanguageContext: Translation failed:', error);
      return text;
    }
  }, [selectedLanguage]);

  const speakText = useCallback((text: string) => {
    voiceServiceRef.current.speakText(text, selectedLanguage);
  }, [selectedLanguage]);

  // Load saved language preference on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem('preferredLanguage');
    if (savedLanguage && savedLanguage !== selectedLanguage) {
      setSelectedLanguageState(savedLanguage);
    }
  }, []);

  const contextValue = React.useMemo(() => ({
    selectedLanguage,
    setSelectedLanguage,
    translateText,
    speakText
  }), [selectedLanguage, setSelectedLanguage, translateText, speakText]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
};
