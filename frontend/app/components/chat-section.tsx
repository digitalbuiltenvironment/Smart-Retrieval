"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import ChatSelection from "./ui/chat/chat-selection";
import AutofillQuestion from "@/app/components/ui/autofill-prompt/autofill-prompt-dialog";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChatSection() {
  const { data: session } = useSession();
  const supabaseAccessToken = session?.supabaseAccessToken;
  const [docSelected, setDocSelected] = useState<string>('');
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
    headers: {
      // Add the access token to the request headers
      'Authorization': `Bearer ${supabaseAccessToken}`,
    },
    body: {
      // Add the selected document to the request body
      document: docSelected,
    },
  });

  return (
    <div className="space-y-4 max-w-5xl w-full relative">
      {docSelected ?
        (
          <>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              reload={reload}
              stop={stop}
            />
            <AutofillQuestion
              docSelected={docSelected}
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
          </>
        )
        :
        <ChatSelection
          docSelected={docSelected}
          handleDocSelect={setDocSelected}
        />
      }
    </div>
  );
}
