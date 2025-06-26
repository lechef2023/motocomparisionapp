import { useState, useEffect } from "react";
import { Search, Bike, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import type { Motorcycle as MotorcycleType } from "@shared/schema";

interface HeaderProps {
  onSearch: (query: string) => void;
  searchQuery: string;
}

export function Header({ onSearch, searchQuery }: HeaderProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery);

  const { data: searchResults } = useQuery<MotorcycleType[]>({
    queryKey: ['/api/motorcycles/search', localQuery],
    enabled: localQuery.length > 2,
  });

  useEffect(() => {
    setLocalQuery(searchQuery);
  }, [searchQuery]);

  const handleInputChange = (value: string) => {
    setLocalQuery(value);
    setShowSuggestions(value.length > 2);
  };

  const handleInputFocus = () => {
    if (localQuery.length > 2) {
      setShowSuggestions(true);
    }
  };

  const handleInputBlur = () => {
    setTimeout(() => setShowSuggestions(false), 200);
  };

  const handleSuggestionClick = (suggestion: string) => {
    setLocalQuery(suggestion);
    onSearch(suggestion);
    setShowSuggestions(false);
  };

  const handleSearch = () => {
    onSearch(localQuery);
    setShowSuggestions(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <header className="bg-white shadow-material-1 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:space-x-3 flex-shrink-0">
            <div className="bg-primary-blue text-white rounded-lg p-2">
              <Bike className="text-xl" />
            </div>
            <h1 className="text-xl md:text-2xl font-bold text-neutral-900">MotoCmp</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md sm:max-w-lg mx-2 md:mx-8 relative">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search..."
                value={localQuery}
                onChange={(e) => handleInputChange(e.target.value)}
                onFocus={handleInputFocus}
                onBlur={handleInputBlur}
                onKeyDown={handleKeyDown}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 rounded-full border-0 focus:bg-white focus:ring-2 focus:ring-primary-blue focus:outline-none transition-all duration-200 text-sm md:text-base"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-600 h-4 w-4" />
            </div>

            {/* Suggestions Dropdown */}
            {showSuggestions && searchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 bg-white shadow-material-3 rounded-lg mt-1 z-50 max-h-60 overflow-y-auto">
                {searchResults.slice(0, 5).map((motorcycle) => (
                  <div
                    key={motorcycle.id}
                    className="px-3 py-2 hover:bg-neutral-100 cursor-pointer flex items-center"
                    onClick={() => handleSuggestionClick(motorcycle.name)}
                  >
                    <Search className="text-neutral-400 mr-2 h-4 w-4" />
                    <div className="truncate">
                      <div className="font-medium truncate">{motorcycle.name}</div>
                      <div className="text-xs text-neutral-600 truncate">
                        {motorcycle.year} • {motorcycle.displacement}cc • ${motorcycle.price.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Botón de Búsqueda */}
          <Button
            onClick={handleSearch}
            className="bg-primary-blue hover:bg-primary-blue-dark text-white px-3 sm:px-4 md:px-6 py-2 rounded-lg transition-colors duration-200 font-medium text-sm whitespace-nowrap hidden sm:flex items-center"
          >
            <Plus className="mr-1 sm:mr-2 h-4 w-4" />
            <span className="hidden md:inline">Search</span>
            <span className="inline md:hidden">Go</span>
          </Button>
        </div>
      </div>
    </header>
  );
}