
import React, { memo } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Languages } from 'lucide-react';
import { useLanguage, INDIAN_LANGUAGES } from '../context/LanguageContext';

const LanguageSelector = memo(() => {
  const { selectedLanguage, setSelectedLanguage } = useLanguage();

  const handleLanguageChange = React.useCallback((value: string) => {
    if (value !== selectedLanguage) {
      setSelectedLanguage(value);
    }
  }, [selectedLanguage, setSelectedLanguage]);

  return (
    <div className="flex items-center gap-2">
      <Languages className="h-4 w-4 text-gray-600 dark:text-gray-300" />
      <Select value={selectedLanguage} onValueChange={handleLanguageChange}>
        <SelectTrigger className="w-32 h-8 text-xs bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 z-50">
          {Object.entries(INDIAN_LANGUAGES).map(([code, name]) => (
            <SelectItem key={code} value={code} className="text-xs hover:bg-gray-100 dark:hover:bg-gray-700">
              {name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
});

LanguageSelector.displayName = 'LanguageSelector';

export default LanguageSelector;
