import { IconSpinner } from "@/app/components/ui/icons";
import { Fragment, useEffect, useState } from "react";
import { ArrowDownFromLine, ArrowUpFromLine, Copy } from "lucide-react";
import { toast } from 'react-toastify';
import { SearchHandler, SearchResult } from "@/app/components/ui/search/search.interface";

export default function SearchResults(
    props: Pick<SearchHandler, "query" | "results" | "isLoading" | "searchButtonPressed">
) {
    const [sortedResults, setSortedResults] = useState<SearchResult[]>([]);
    const [expandedResult, setExpandedResult] = useState<number | null>(null);

    // Sort results by similarity score whenever results or query change
    useEffect(() => {
        if (props.query.trim() === "" && !props.searchButtonPressed) {
            // Reset sortedResults when query is empty
            setSortedResults([]);
        } else if (props.query.trim() !== "" && props.searchButtonPressed) {
            // if results are empty or not an array
            if (!Array.isArray(props.results) || props.results.length === 0) {
                setSortedResults([]);
            } else {
                // Sort results by similarity score
                const sorted = props.results.slice().sort((a, b) => b.similarity_score - a.similarity_score);
                // Update sortedResults state
                setSortedResults(sorted);
            }
        }
    }, [props.query, props.results, props.searchButtonPressed]);

    // Log sortedResults outside of useEffect to ensure you're getting the updated state
    // console.log("Sorted results:", sortedResults);

    // Handle expand/collapse of search results
    const handleToggleExpand = (resultId: number) => {
        setExpandedResult((prevId) => (prevId === resultId ? null : resultId));
    };

    // TODO: Add a collapse all/ expand all button

    // TODO: Add a button to clear search results & not on query change to empty string

    // Handle Reseting the expanded result when the search button is pressed
    useEffect(() => {
        setExpandedResult(null);
    }, []);

    // Handle when query is empty and search button is pressed
    if (props.query.trim() === "" && props.searchButtonPressed) {
        return (
            null
        );
    }

    // Handle when there are no search results and search button is not pressed
    if (sortedResults.length === 0 && !props.searchButtonPressed) {
        return (
            null
        );
    }

    if (props.isLoading) {
        return (
            <div className="flex w-full items-center justify-center rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl">
                <IconSpinner className="mr-2 animate-spin" />
                <p>Loading...</p>
            </div>
        );
    }

    // Handle when there are no search results
    if (sortedResults.length === 0 && props.query.trim() !== "" && props.searchButtonPressed) {
        return (
            <div className="flex w-full items-center justify-center rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl">
                <p>No results found.</p>
            </div>
        );
    }

    const showToastMessage = () => {
        toast.success("Text copied to clipboard!", {
            position: "top-right",
            closeOnClick: true,
        });
    };

    const handleCopyText = (text: string) => {
        // Copy to clipboard
        navigator.clipboard.writeText(text);
        // Show toast message
        showToastMessage();
    };

    return (
        <div className="flex w-full items-center justify-between rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl">
            <div className="relative overflow-x-auto rounded-lg">
                <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                    <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                        <tr>
                            <th scope="col" className="px-6 py-3">ID</th>
                            <th scope="col" className="px-6 py-3">File Name</th>
                            <th scope="col" className="px-6 py-3">Page</th>
                            <th scope="col" className="px-6 py-3">Text</th>
                            <th scope="col" className="px-6 py-3">Score</th>
                            <th scope="col" className="px-6 py-3">Action</th>
                            <th scope="col" className="px-6 py-3">Expand</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedResults.map((result) => (
                            <Fragment key={result.id}>
                                <tr
                                    className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 cursor-pointer"
                                >
                                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white" onClick={() => handleToggleExpand(result.id)}>{result.id}</th>
                                    <td className="px-6 py-4" onClick={() => handleToggleExpand(result.id)}>{result.file_name}</td>
                                    <td className="px-6 py-4" onClick={() => handleToggleExpand(result.id)}>{result.page_no}</td>
                                    <td className="px-6 py-4" onClick={() => handleToggleExpand(result.id)}>
                                        {expandedResult === result.id ? (
                                            <span>{result.text}</span>
                                        ) : (
                                            <span>{result.text.slice(0, 50)}...</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4" onClick={() => handleToggleExpand(result.id)}>{result.similarity_score.toFixed(2)}</td>
                                    <td className="px-6 py-4 hover:bg-green-300 transition duration-300 ease-in-out transform hover:scale-105" onClick={() => handleCopyText(result.text)}>
                                        <div role="img" aria-label="copy text icon" className="flex items-center justify-center">
                                            <Copy />
                                        </div>
                                    </td>
                                    <td className="px-6 py-4" onClick={() => handleToggleExpand(result.id)}>
                                        <div role="img" aria-label="expand icon" className="flex items-center justify-center">
                                            {expandedResult === result.id ? (
                                                <ArrowUpFromLine />
                                            ) : (
                                                <ArrowDownFromLine />
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            </Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
