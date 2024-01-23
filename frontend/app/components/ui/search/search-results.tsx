import { SearchResult } from "./search-types";
import { IconSpinner } from "../icons";
import { Fragment, useState } from "react";

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
    // Sort results based on similarity_score in descending order
    const sortedResults = results.slice().sort((a, b) => b.similarity_score - a.similarity_score);

    const [expandedResult, setExpandedResult] = useState<number | null>(null);

    const handleToggleExpand = (resultId: number) => {
        setExpandedResult((prevId) => (prevId === resultId ? null : resultId));
    };

    return (
        <div className="flex w-full items-start justify-between gap-4 rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl">
            {isLoading ? (
                <div className="flex items-center">
                    <IconSpinner className="mr-2 animate-spin" />
                    <p>Loading...</p>
                </div>
            ) : null}
            {!isLoading && sortedResults.length === 0 && <p>No results found.</p>}
            {!isLoading && sortedResults.length > 0 && (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>File Name</th>
                            <th>Page</th>
                            <th>Text</th>
                            <th>Score</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedResults.map((result) => (
                            <Fragment key={result.id}>
                                <tr>
                                    <td>{result.id}</td>
                                    <td>{result.file_name}</td>
                                    <td>{result.page_no}</td>
                                    <td>
                                        {expandedResult === result.id ? (
                                            <span>{result.text}</span>
                                        ) : (
                                            <span>{result.text.slice(0, 50)}...</span>
                                        )}
                                    </td>
                                    <td>{result.similarity_score}</td>
                                    <td>
                                        <button onClick={() => handleToggleExpand(result.id)}>
                                            {expandedResult === result.id ? 'Collapse' : 'Expand'}
                                        </button>
                                    </td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default SearchResults;


