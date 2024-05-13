"use client";

import { useChat } from "ai/react";
import { ChatInput, ChatMessages } from "@/app/components/ui/chat";
import { AutofillQuestion } from "./ui/autofill-prompt";
import { QueryMenu, QuerySelection, QueryDocumentUpload, QueryCollectionManage } from "./ui/query";
import { MessageCircle, Upload, AlertTriangle } from "lucide-react"
import { useSession } from "next-auth/react";
import { useState } from "react";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function QuerySection() {
    const { data: session } = useSession();
    const supabaseAccessToken = session?.supabaseAccessToken;
    const [collSelected, setcollSelected] = useState<string>('');
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
        api: process.env.NEXT_PUBLIC_QUERY_API,
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
        <div className="max-w-5xl w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl space-y-4 px-4 pb-4">
            {/* Toast Container */}
            <ToastContainer />

            {/* Warning Banner */}
            <div className="flex flex-col bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded text-center items-center" role="alert">
                <AlertTriangle />
                <div className="flex text-center items-center font-bold">
                    WARNING
                </div>
                <div className="flex">Smart Retrieval is currently at the demo stage, avoid uploading sensitive/secret documents.</div>
            </div>

            {/* Menu Section */}
            <QueryMenu
                showUpload={showUpload}
                setShowUpload={setShowUpload}
                showChat={showChat}
                setShowChat={setShowChat}
                showManage={showManage}
                setShowManage={setShowManage}
            />

            {/* Document Selection/Chat Section */}
            {showChat ? <QuerySelection collSelected={collSelected} handleCollSelect={setcollSelected} /> : null}

            {/* Document Upload Section */}
            {showUpload ? <QueryDocumentUpload /> : null}

            {/* Document Manage Section */}
            {showManage ? <QueryCollectionManage collSelected={collSelected} handleCollSelect={setcollSelected} /> : null}
            {/* <ChatMessages
                messages={messages}
                isLoading={isLoading}
                reload={reload}
                stop={stop}
            />
            <AutofillQuestion
                collSelected="PSSCOC"
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
            /> */}
        </div>
    );
}
