"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import { AutofillQuestion } from "./ui/autofill-prompt";
import { useSession } from "next-auth/react";

export default function QuerySection() {
    const { data: session } = useSession();
    const {
        messages,
        input,
        isLoading,
        handleSubmit,
        handleInputChange,
        reload,
        stop,
    } = useChat({ 
        api: process.env.NEXT_PUBLIC_QUERY_API,
        // Add the access token to the request headers
        headers: {
            'Authorization': `Bearer ${session?.supabaseAccessToken}`,
        }
    });

    return (
        <div className="space-y-4 max-w-5xl w-full">
            <ChatMessages
                messages={messages}
                isLoading={isLoading}
                reload={reload}
                stop={stop}
            />
            <AutofillQuestion
                docSelected="PSSCOC"
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
