
import React, { useState, useEffect, useCallback, memo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, X } from "lucide-react";
import { T } from "../hooks/useTranslation";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = memo(({ onSearch }) => {
  const [query, setQuery] = useState("");

  // Debounce search to avoid too many updates
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onSearch(query);
    }, 800);

    return () => clearTimeout(timeoutId);
  }, [query, onSearch]);

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  }, [query, onSearch]);

  const clearSearch = useCallback(() => {
    setQuery("");
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  }, []);

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-2xl mx-auto mb-8"
    >
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search events by name, location, category, tags, or organizer..."
          value={query}
          onChange={handleInputChange}
          className="pr-20 h-12 rounded-full border-eventrix/30 focus-visible:ring-eventrix"
        />
        
        {query && (
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={clearSearch}
            className="absolute right-12 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          type="submit"
          size="icon"
          className="absolute right-1 bg-eventrix hover:bg-eventrix-hover rounded-full w-10 h-10"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
      
      {query && (
        <div className="absolute top-full left-0 right-0 mt-1 text-xs text-gray-500 dark:text-gray-400">
          <T>Press Enter to search or wait for auto-search</T>
        </div>
      )}
    </form>
  );
});

SearchBar.displayName = 'SearchBar';

export default SearchBar;
