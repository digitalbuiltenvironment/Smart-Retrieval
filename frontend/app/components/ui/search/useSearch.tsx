import { useState, useEffect } from "react";

interface SearchResult {
    id: number;
    title: string;
    // Add more properties as needed
}

interface UseSearchResult {
    searchResults: SearchResult[];
    isLoading: boolean;
    handleSearch: (query: string) => Promise<void>;
}

const useSearch = (): UseSearchResult => {
    const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSearch = async (query: string): Promise<void> => {
        setIsLoading(true);

        // Perform your search logic here
        // Replace the following with your actual search API or function
        try {
            const response = await fetch(`/api/search?query=${query}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Error during search:", error);
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
