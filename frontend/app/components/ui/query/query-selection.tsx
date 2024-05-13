"use client";

import { useState, useEffect } from 'react';
import { ChatHandler } from '@/app/components/ui/chat';

export default function QuerySelection(
    props: Pick<ChatHandler, "collSelected" | "handleCollSelect">,
) {
    const [userCollections, setuserCollections] = useState<any[]>([]);
    const [currentCollectionIndex, setcurrentCollectionIndex] = useState(0);

    const handleCollectionSelect = (collectionId: string) => {
        props.handleCollSelect(collectionId);
    };

    // Retrieve the public collection sets from the database
    useEffect(() => {
        // Fetch the public collection sets from the API
        fetch('/api/user-collections')
            .then((response) => response.json())
            .then((data) => {
                setuserCollections(data.userCollections);
            })
            .catch((error) => {
                console.error("Error fetching user collections:", error);
            });
    }, []);

    console.log('userCollections:', userCollections);

    // Automatically advance to the next collection set after a delay
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentCollectionIndex < userCollections.length - 1) {
                setcurrentCollectionIndex((prevIndex) => prevIndex + 1);
            }
            else {
                clearInterval(timer); // Stop the timer when all collection set have been displayed
            }
        }, 100); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, [currentCollectionIndex, userCollections]);

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h2 className="text-lg text-center font-semibold mb-4">Select Your Document Set to Chat with:</h2>
                {userCollections.map((collection, index) => (
                    <ul key={index}>
                        <li className={`p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg hover:bg-zinc-500/30 transition duration-300 ease-in-out transform cursor-pointer ${index <= currentCollectionIndex ? 'opacity-100 duration-500' : 'opacity-0'}`}>
                            <button className="text-blue-500 w-full text-left" onClick={() => handleCollectionSelect(collection.collection_id)}>
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