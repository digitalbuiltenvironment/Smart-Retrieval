// SearchInput.tsx

import { ChangeEvent, FormEvent } from "react";
import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Search } from "lucide-react";

interface SearchInputProps {
    query: string;
    isLoading: boolean;
    onInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit: (e: FormEvent) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({
    query,
    isLoading,
    onInputChange,
    onSearchSubmit,
}) => {
    return (
        <form
            onSubmit={onSearchSubmit}
            className="flex w-full items-start justify-between gap-4 rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl"
        >
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
        </form>
    );
};

export default SearchInput;
