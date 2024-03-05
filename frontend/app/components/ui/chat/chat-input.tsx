import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { ChatHandler } from "@/app/components/ui/chat/chat.interface";
import { IconSpinner } from "@/app/components/ui/icons";
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
        className="flex-1 bg-white dark:bg-zinc-500/30 z-10"
        value={props.input}
        onChange={props.handleInputChange}
      />
      <Button type="submit" disabled={props.isLoading} className="hidden md:flex items-center transition duration-300 ease-in-out transform hover:scale-110 z-10">
        {props.isLoading ? (
          <IconSpinner className="animate-spin" />
        ) : (
          // Fragment to avoid wrapping the text in a button
          <>
            <span className="pr-2">Send</span>
            <Send className="h-5 w-5" />
          </>
        )}
      </Button>
      <Button type="submit" disabled={props.isLoading} className="md:hidden z-10"> {/* Hide on larger screens */}
        {props.isLoading ? (
          <IconSpinner className="animate-spin" />
        ) : (
          <Send className="h-5 w-5" />
        )}
      </Button>
    </form>
  );
}
