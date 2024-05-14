"use client";

import { useState } from 'react';
import { MessageCircle, Upload, FileCog } from 'lucide-react';
import { QueryMenuHandler } from '@/app/components/ui/query/query.interface';

export default function QueryMenu(
    props: Pick<QueryMenuHandler, "showUpload" | "setShowUpload" | "showChat" | "setShowChat" | "showManage" | "setShowManage">,
) {
    const handleShowChatTab = () => {
        props.setShowChat(true);
        props.setShowUpload(false);
        props.setShowManage(false);
    }
    const handleShowUploadTab = () => {
        props.setShowUpload(true);
        props.setShowChat(false);
        props.setShowManage(false);
    }

    const handleShowManageTab = () => {
        props.setShowManage(true);
        props.setShowUpload(false);
        props.setShowChat(false);
    }

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl">
            <div className="flex rounded-lg px-4 py-2 text-center items-center overflow-y-auto">
                <button
                    className={`flex text-center items-center text-l ${props.showChat ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowChatTab()}
                >
                    <MessageCircle className="mr-1 h-5 w-5" />
                    Chat
                </button>
                <button
                    className={`flex text-center items-center text-l ${props.showUpload ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowUploadTab()}
                >
                    <Upload className="mr-1 h-5 w-5" />
                    Upload
                </button>
                <button
                    className={`flex text-center items-center text-l ${props.showManage ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowManageTab()}
                >
                    <FileCog className="mr-1 h-5 w-5" />
                    Manage
                </button>
            </div>
        </div>
    );
}