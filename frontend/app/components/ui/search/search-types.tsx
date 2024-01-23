// SearchTypes.tsx
export interface SearchResult {
    id: number;
    file_name: string;
    page_no: number;
    text: string;
    similarity_score: number;
    // Add more properties as needed
}
