import { Button } from "../button";
import { Input } from "../input";
import { ChatHandler } from "./chat.interface";
import { Send } from "lucide-react";

export default function ChatInput(
  props: Pick<
    ChatHandler,
    "isLoading" | "handleSubmit" | "handleInputChange" | "input"
  >,
) {
  return (
    <form
      onSubmit={props.handleSubmit}
      className="flex w-full items-start justify-between gap-4 rounded-xl bg-white dark:bg-zinc-700/30 p-4 shadow-xl"
    >
      <Input
        autoFocus
        name="message"
        placeholder="Type a Message"
        className="flex-1 bg-white dark:bg-zinc-500/30"
        value={props.input}
        onChange={props.handleInputChange}
      />
      <Button type="submit" disabled={props.isLoading} className="hidden md:flex items-center transition duration-300 ease-in-out transform hover:scale-110">
        <span className="pr-2">Send</span>
        <Send className="h-5 w-5" />
      </Button>
      <Button type="submit" disabled={props.isLoading} className="md:hidden"> {/* Hide on larger screens */}
        <Send className="h-5 w-5"/>
      </Button>
    </form>
  );
}
