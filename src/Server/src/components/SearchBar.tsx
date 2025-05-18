
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="relative w-full max-w-2xl mx-auto mb-8"
    >
      <div className="relative flex items-center">
        <Input
          type="text"
          placeholder="Search events by name, location, or date..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pr-12 h-12 rounded-full border-eventrix/30 focus-visible:ring-eventrix"
        />
        <Button 
          type="submit"
          size="icon"
          className="absolute right-1 bg-eventrix hover:bg-eventrix-hover rounded-full w-10 h-10"
        >
          <Search className="h-5 w-5" />
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
