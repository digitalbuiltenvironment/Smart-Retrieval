// SearchSection.tsx

import { useState, ChangeEvent, FormEvent } from "react";
import useSearch from "@/app/components/ui/search/useSearch";
import SearchResults from "@/app/components/ui/search/search-results";
import SearchInput from "@/app/components/ui/search/search-input";

const SearchSection: React.FC = () => {
  const [query, setQuery] = useState("");
  const { searchResults, isLoading, handleSearch } = useSearch();

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSearchSubmit = (e: FormEvent) => {
    e.preventDefault();
    handleSearch(query);
  };

  return (
    <div className="space-y-4 max-w-5xl w-full">
      <SearchInput
        query={query}
        isLoading={isLoading}
        onInputChange={handleInputChange}
        onSearchSubmit={handleSearchSubmit}
      />
      <SearchResults results={searchResults} isLoading={isLoading} />
    </div>
  );
};

export default SearchSection;
