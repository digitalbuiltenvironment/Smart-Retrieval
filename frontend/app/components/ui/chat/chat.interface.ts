export interface Message {
  id: string;
  content: string;
  role: string;
}

export interface ChatHandler {
  docSelected: string;
  handleDocSelect: (doc: string) => void;
  messages: Message[];
  input: string;
  isLoading: boolean;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  reload?: () => void;
  stop?: () => void;
}
