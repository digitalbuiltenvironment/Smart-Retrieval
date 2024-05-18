// SearchSection.tsx
"use client";

import { useState, ChangeEvent, FormEvent } from "react";
import { AutofillSearchQuery } from "@/app/components/ui/autofill-prompt";
import { SearchSelection, useSearch, SearchResults, SearchInput } from "./ui/search";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const { searchResults, isLoading, handleSearch } = useSearch();
  const [searchButtonPressed, setSearchButtonPressed] = useState(false);
  const [collSelectedId, setCollSelectedId] = useState<string>('');
  const [collSelectedName, setCollSelectedName] = useState<string>('');

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setSearchButtonPressed(false);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    setSearchButtonPressed(true);
    handleSearch(query, collSelectedId);
  };

  return (
    <div className="space-y-4 max-w-5xl w-full">
      {collSelectedId ? (
        <>
          <SearchInput
            collSelectedId={collSelectedId}
            collSelectedName={collSelectedName}
            query={query}
            isLoading={isLoading}
            results={searchResults}
            onInputChange={handleInputChange}
            onSearchSubmit={handleSearchSubmit}
          />
          <AutofillSearchQuery
            collSelectedId={collSelectedId}
            collSelectedName={collSelectedName}
            query={query}
            isLoading={isLoading}
            results={searchResults}
            onInputChange={handleInputChange}
            onSearchSubmit={handleSearchSubmit}
            handleCollIdSelect={setCollSelectedId}
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
          collSelectedId={collSelectedId}
          collSelectedName={collSelectedName}
          handleCollIdSelect={setCollSelectedId}
          handleCollNameSelect={setCollSelectedName}
        />
      )}
    </div>
  );
};

export default SearchSection;
