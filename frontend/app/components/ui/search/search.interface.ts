import { ChangeEvent, FormEvent } from "react";

export interface SearchHandler {
    collSelected: string;
    handleCollSelect: (doc: string) => void;
    query: string;
    isLoading: boolean;
    onInputChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    onSearchSubmit?: (e: FormEvent) => void;
    results: SearchResult[];
    searchButtonPressed?: boolean;
}

export interface SearchResult {
    id: number;
    file_name: string;
    page_no: number;
    text: string;
    similarity_score: number;
    // Add more properties as needed
}
