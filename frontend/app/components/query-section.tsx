"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";

export default function QuerySection() {
    const {
        messages,
        input,
        isLoading,
        handleSubmit,
        handleInputChange,
        reload,
        stop,
    } = useChat({ api: process.env.NEXT_PUBLIC_QUERY_API });

    return (
        <div className="space-y-4 max-w-5xl w-full">
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                reload={reload}
                stop={stop}
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
