"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import AutofillQuestion from "@/app/components/ui/autofill-prompt/autofill-prompt-dialog";
import { useSession } from "next-auth/react";

export default function ChatSection() {
  const { data: session } = useSession();
  const supabaseAccessToken = session?.supabaseAccessToken;
  const {
    messages,
    input,
    isLoading,
    handleSubmit,
    handleInputChange,
    reload,
    stop,
  } = useChat({
    api: process.env.NEXT_PUBLIC_CHAT_API,
    // Add the access token to the request headers
    headers: {
      'Authorization': `Bearer ${supabaseAccessToken}`,
    }
  });

  return (
    <div className="space-y-4 max-w-5xl w-full relative">
      <ChatMessages
        messages={messages}
        isLoading={isLoading}
        reload={reload}
        stop={stop}
      />
      <AutofillQuestion
        messages={messages}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        input={input}
      />
      <ChatInput
        input={input}
        handleSubmit={handleSubmit}
        handleInputChange={handleInputChange}
        isLoading={isLoading}
      />
    </div>
  );
}
