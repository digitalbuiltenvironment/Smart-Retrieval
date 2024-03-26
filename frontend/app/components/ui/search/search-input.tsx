// SearchInput.tsx

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";
import { SearchHandler } from "@/app/components/ui/search/search.interface";

const SearchInput: React.FC<SearchHandler> = ({
    query,
    isLoading,
    onInputChange,
    onSearchSubmit,
}) => {
    return (

        <form
            onSubmit={onSearchSubmit}
            className="w-full items-start justify-between gap-4 rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl"
        >
            <div className="flex w-full items-start justify-between gap-4">
                <Input
                    autoFocus
                    name="query"
                    placeholder="Enter a text to search..."
                    value={query}
                    onChange={onInputChange}
                    className="flex-1 bg-white dark:bg-zinc-500/30"
                />
                <Button type="submit" disabled={isLoading} className="hidden md:flex items-center transition duration-300 ease-in-out transform hover:scale-110">
                    Search
                </Button>
                <Button type="submit" disabled={isLoading} className="md:hidden"> {/* Hide on larger screens */}
                    <Search className="h-5 w-5" />
                </Button>
            </div>
            <p className="text-center text-sm text-gray-400 mt-2">Smart Retrieval may not be 100% accurate. Consider checking important information.</p>
        </form >
    );
};

export default SearchInput;
