"use client";

import { useState, useEffect } from 'react';
import { ChatHandler } from '@/app/components/ui/chat';
import { IconSpinner } from '@/app/components/ui/icons';

export default function ChatSelection(
    props: Pick<ChatHandler, "collSelectedId" | "collSelectedName" | "handleCollIdSelect" | "handleCollNameSelect">,
) {
    const [publicCollections, setPublicCollections] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true); // Loading state

    const handleCollectionSelect = (collectionId: string, displayName: string) => {
        props.handleCollIdSelect(collectionId);
        props.handleCollNameSelect(displayName);
    };

    // Retrieve the public collection sets from the database
    const getPublicCollections = async () => {
        setIsLoading(true); // Set loading state to true
        // Fetch the public collection sets from the API
        const response = await fetch('/api/public-collections', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache', // Disable caching
            },
        });

        if (!response.ok) {
            console.error("Error fetching public collections:", response.statusText);
            return;
        }

        const data = await response.json();
        // Sort the collections by created date in descending order (oldest first)
        const sortedPublicCollections = data.publicCollections.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
        setPublicCollections(sortedPublicCollections);
        setIsLoading(false); // Set loading state to false
    }

    // On component mount, retrieve the public collection sets from the database
    useEffect(() => {
        getPublicCollections();
    }, []);

    // console.log('publicCollections:', publicCollections);

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl pb-0">
            <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h2 className="text-lg text-center font-semibold mb-4">Select Document Set to Chat with:</h2>
                {isLoading ? (
                    <IconSpinner className='w-10 h-10 mx-auto my-auto animate-spin' />
                ) : publicCollections.length === 0 ? (<div className="mx-auto my-auto text-center text-lg text-gray-500 dark:text-gray-400">No collections found.</div>)
                    : publicCollections.map((collection, index) => (
                        <ul key={index}>
                            <li className="p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg hover:bg-zinc-500/30 transition duration-300 ease-in-out transform cursor-pointer">
                                <button className="text-blue-500 w-full text-left" onClick={() => handleCollectionSelect(collection.collection_id, collection.display_name)}>
                                    <div>{collection.display_name}</div>
                                    <div className="text-sm text-gray-500">{collection.description}</div>
                                </button>
                            </li>
                        </ul>
                    ))}
            </div>
        </div>
    );
};