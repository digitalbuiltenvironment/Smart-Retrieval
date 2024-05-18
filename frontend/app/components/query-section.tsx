"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import { AutofillQuestion } from "./ui/autofill-prompt";
import { QueryMenu, QuerySelection, QueryDocumentUpload, QueryCollectionManage } from "./ui/query";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function QuerySection() {
    const { data: session } = useSession();
    const supabaseAccessToken = session?.supabaseAccessToken;
    const [collSelectedId, setCollSelectedId] = useState<string>('');
    const [collSelectedName, setCollSelectedName] = useState<string>('');
    const [showChat, setShowChat] = useState<boolean>(true);
    const [showUpload, setShowUpload] = useState<boolean>(false);
    const [showManage, setShowManage] = useState<boolean>(false);
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
        <div className="max-w-5xl w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl space-y-4 px-4 pb-4">
            {/* Toast Container */}
            <ToastContainer />

            {/* Menu Section */}
            <QueryMenu
                showUpload={showUpload}
                setShowUpload={setShowUpload}
                showChat={showChat}
                setShowChat={setShowChat}
                showManage={showManage}
                setShowManage={setShowManage}
                setCollSelectedId={setCollSelectedId}
            />

            {/* Document Selection/Chat Section */}
            {showChat ?
                (collSelectedId ?
                    <>
                        {/* Chat Section */}
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
                    :
                    (
                        <QuerySelection
                            collSelectedId={collSelectedId}
                            collSelectedName={collSelectedName}
                            handleCollIdSelect={setCollSelectedId}
                            handleCollNameSelect={setCollSelectedName}
                        />))
                : null
            }

            {/* Document Upload Section */}
            {showUpload ? <QueryDocumentUpload /> : null}

            {/* Document Manage Section */}
            {showManage ? <QueryCollectionManage /> : null}

        </div>
    );
}
