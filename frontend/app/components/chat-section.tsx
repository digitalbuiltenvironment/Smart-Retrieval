"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import { ChatSelection } from "@/app/components/ui/chat";
import { AutofillQuestion } from "@/app/components/ui/autofill-prompt";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function ChatSection() {
  const { data: session } = useSession();
  const supabaseAccessToken = session?.supabaseAccessToken;
  const [collSelectedId, setCollSelectedId] = useState<string>('');
  const [collSelectedName, setCollSelectedName] = useState<string>('');
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
      collection_id: collSelectedId,
    },
  });

  return (
    <div className="space-y-4 max-w-5xl w-full relative">
      <ToastContainer />
      {collSelectedId ?
        (
          <>
            <ChatMessages
              messages={messages}
              isLoading={isLoading}
              reload={reload}
              stop={stop}
            />
            <AutofillQuestion
              collSelectedId={collSelectedId}
              collSelectedName={collSelectedName}
              messages={messages}
              isLoading={isLoading}
              handleSubmit={handleSubmit}
              handleInputChange={handleInputChange}
              handleCollIdSelect={setCollSelectedId}
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
          collSelectedId={collSelectedId}
          collSelectedName={collSelectedName}
          handleCollIdSelect={setCollSelectedId}
          handleCollNameSelect={setCollSelectedName}
        />
      }
    </div>
  );
}
