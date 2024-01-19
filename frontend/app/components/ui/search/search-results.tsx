import { SearchResult } from "./search-types";
import { IconSpinner } from "../icons";

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
    return (
        <div className="flex w-full items-start justify-between gap-4 rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl">
            {isLoading ? (
                <div className="flex items-center">
                    <IconSpinner className="mr-2 animate-spin" />
                    <p>Loading...</p>
                </div>
            ) : null}
            {!isLoading && results.length === 0 && <p>No results found.</p>}
            {!isLoading && results.length > 0 && (
                <ul>
                    {results.map((result) => (
                        <li key={result.id}>{result.title}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default SearchResults;
