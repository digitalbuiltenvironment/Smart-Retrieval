"use client";

import { useState, useEffect } from "react";
import { SearchResult } from "./search-types";

interface UseSearchResult {
    searchResults: SearchResult[];
    isLoading: boolean;
    handleSearch: (query: string) => Promise<void>;
}

const search_api = process.env.NEXT_PUBLIC_SEARCH_API;

const useSearch = (): UseSearchResult => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (query: string): Promise<void> => {
        setIsLoading(true);

        if (!search_api) {
            console.error("Search API is not defined");
            setIsLoading(false);
            return;
        }
        // Perform search logic here
        try {
            console.log("Searching for:", query);
            // check if query is empty
            if (query === "") {
                setSearchResults([]);
                setIsLoading(false);
                return;
            }
            const response = await fetch(`${search_api}?query=${query}`, {
                signal: AbortSignal.timeout(120000), // Abort the request if it takes longer than 120 seconds
                });
            const data = await response.json();
            setSearchResults(data);
        } catch (error: any) {
            if (error.name === "AbortError") {
                console.error("Error fetching search results: Request timed out");
            } else {
                console.error("Error fetching search results:", error.message);
            }
            setSearchResults([]);
        }

        setIsLoading(false);
    };

    useEffect(() => {
        // Initial load logic if needed
        // ...

        // Cleanup logic if needed
        return () => {
            // ...
        };
    }, []); // Dependency array depends on your use case

    return {
        searchResults,
        isLoading,
        handleSearch,
    };
};

export default useSearch;
