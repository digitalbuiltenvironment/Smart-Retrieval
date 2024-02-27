// SearchSection.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import useSearch from "@/app/components/ui/search/useSearch";
import SearchResults from "@/app/components/ui/search/search-results";
import SearchInput from "@/app/components/ui/search/search-input";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const { searchResults, isLoading, handleSearch } = useSearch();
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);


  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearchButtonPressed(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchButtonPressed(true);
    handleSearch(query);
  };

  return (
    <div className="space-y-4 max-w-5xl w-full">
      <SearchInput
        query={query}
        isLoading={isLoading}
        results={searchResults}
        onInputChange={handleInputChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <SearchResults query={query} results={searchResults} isLoading={isLoading} searchButtonPressed={searchButtonPressed} />
    </div>
  );
};

export default SearchSection;
