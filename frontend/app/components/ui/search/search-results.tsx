import { SearchResult } from "@/app/components/ui/search/search-types"
import { IconSpinner } from "@/app/components/ui/icons";
import { Fragment, useState } from "react";
import { ArrowDownFromLine, ArrowUpFromLine, Copy } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
}


const SearchResults: React.FC<SearchResultsProps> = ({ results, isLoading }) => {
    const sortedResults = results.slice().sort((a, b) => b.similarity_score - a.similarity_score);
    const [expandedResult, setExpandedResult] = useState<number | null>(null);

    const handleToggleExpand = (resultId: number) => {
        setExpandedResult((prevId) => (prevId === resultId ? null : resultId));
    };

    const showToastMessage = () => {
        toast.success("Text copied to clipboard!", {
            position: "top-center",
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
            <ToastContainer />
            {isLoading ? (
                <div className="flex items-center">
                    <IconSpinner className="mr-2 animate-spin" />
                    <p>Loading...</p>
                </div>
            ) : null}
            {!isLoading && sortedResults.length === 0 && <p>No results found.</p>}
            <div className="relative overflow-x-auto">
                {!isLoading && sortedResults.length > 0 && (
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
                )}
            </div>
        </div>
    );
};

export default SearchResults;
