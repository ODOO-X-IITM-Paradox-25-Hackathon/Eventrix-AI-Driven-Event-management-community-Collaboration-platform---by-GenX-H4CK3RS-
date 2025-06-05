
import { useState, useEffect, useRef, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';

// Simple cache to avoid re-translating the same text
const translationCache = new Map<string, string>();

export const useTranslation = (text: string) => {
  const [translatedText, setTranslatedText] = useState(text);
  const { translateText, selectedLanguage } = useLanguage();
  const previousLanguage = useRef(selectedLanguage);
  const previousText = useRef(text);

  const translate = useCallback(async (textToTranslate: string, targetLanguage: string) => {
    // Skip translation for English or empty text
    if (!textToTranslate || targetLanguage === 'en') {
      setTranslatedText(textToTranslate);
      return;
    }

    // Check cache first
    const cacheKey = `${textToTranslate}:${targetLanguage}`;
    const cached = translationCache.get(cacheKey);
    if (cached) {
      setTranslatedText(cached);
      return;
    }

    try {
      console.log(`Translating "${textToTranslate}" to ${targetLanguage}`);
      const translated = await translateText(textToTranslate);
      console.log(`Translation result: "${translated}"`);
      
      if (translated && translated !== textToTranslate) {
        translationCache.set(cacheKey, translated);
        setTranslatedText(translated);
      } else {
        setTranslatedText(textToTranslate);
      }
    } catch (error) {
      console.error('Translation error:', error);
      setTranslatedText(textToTranslate);
    }
  }, [translateText]);

  useEffect(() => {
    // Only translate if language or text actually changed
    const languageChanged = selectedLanguage !== previousLanguage.current;
    const textChanged = text !== previousText.current;
    
    if (languageChanged || textChanged) {
      translate(text, selectedLanguage);
      previousLanguage.current = selectedLanguage;
      previousText.current = text;
    }
  }, [text, selectedLanguage, translate]);

  // Initialize with original text for English
  useEffect(() => {
    if (selectedLanguage === 'en') {
      setTranslatedText(text);
    }
  }, [text, selectedLanguage]);

  return translatedText;
};

// Helper component for translating text content
export const T = ({ children }: { children: string }) => {
  const translatedText = useTranslation(children);
  return <>{translatedText}</>;
};
