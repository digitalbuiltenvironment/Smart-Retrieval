// SearchSection.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AutofillSearchQuery } from "@/app/components/ui/autofill-prompt";
import { SearchSelection, useSearch, SearchResults, SearchInput } from "./ui/search";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const { searchResults, isLoading, handleSearch } = useSearch();
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);
  const [docSelected, setDocSelected] = useState<string>('');

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
      {docSelected ? (
        <>
          <h2 className="text-lg text-center font-semibold mb-4">Searching in {docSelected}</h2>
          <SearchInput
            docSelected={docSelected}
            query={query}
            isLoading={isLoading}
            results={searchResults}
            onInputChange={handleInputChange}
            onSearchSubmit={handleSearchSubmit}
          />
          <AutofillSearchQuery
            docSelected={docSelected}
            query={query}
            isLoading={isLoading}
            results={searchResults}
            onInputChange={handleInputChange}
            onSearchSubmit={handleSearchSubmit}
          />
          <SearchResults
            query={query}
            results={searchResults}
            isLoading={isLoading}
            searchButtonPressed={searchButtonPressed}
          />
        </>
      ) : (
        <SearchSelection
          docSelected={docSelected}
          handleDocSelect={setDocSelected}
        />
      )}
    </div>
  );
};

export default SearchSection;
