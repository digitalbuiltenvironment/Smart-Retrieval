"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import { ChatSelection } from "@/app/components/ui/chat";
import { AutofillQuestion } from "@/app/components/ui/autofill-prompt";
import { useSession } from "next-auth/react";
import { useState } from "react";

export default function ChatSection() {
  const { data: session } = useSession();
  const supabaseAccessToken = session?.supabaseAccessToken;
  const [collSelected, setCollSelected] = useState<string>('');
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
      document: collSelected,
    },
  });

  return (
    <div className="space-y-4 max-w-5xl w-full relative">
      {collSelected ?
        (
          <>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              reload={reload}
              stop={stop}
            />
            <AutofillQuestion
              collSelected={collSelected}
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
          collSelected={collSelected}
          handleCollSelect={setCollSelected}
        />
      }
    </div>
  );
}
