export interface Message {
  id: string;
  content: string;
  role: string;
}

export interface ChatHandler {
  collSelectedId: string;
  collSelectedName: string;
  handleCollIdSelect: (collection_id: string) => void;
  handleCollNameSelect: (display_name: string) => void;
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reload?: () => void;
  stop?: () => void;
}
