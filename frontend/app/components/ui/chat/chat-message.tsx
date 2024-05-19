import { Check, Copy } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import ChatAvatar from "@/app/components/ui/chat/chat-avatar";
import { Message } from "@/app/components/ui/chat/chat.interface";
import Markdown from "@/app/components/ui/chat/markdown";
import { useCopyToClipboard } from "@/app/components/ui/chat/use-copy-to-clipboard";

export default function ChatMessage(chatMessage: Message) {
  const { isCopied, copyToClipboard } = useCopyToClipboard({ timeout: 2000 });
  return (
    <div className="flex items-start gap-4 pr-5 pt-5">
      <ChatAvatar role={chatMessage.role} />
      <div className="group flex flex-1 justify-between gap-2">
        <div className="flex-1">
          <Markdown content={chatMessage.content} />
        </div>
        <Button
          onClick={() => copyToClipboard(chatMessage.content)}
          size="icon"
          variant="ghost"
          className="h-8 w-8 opacity-0 group-hover:opacity-100"
        >
          {isCopied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
}
