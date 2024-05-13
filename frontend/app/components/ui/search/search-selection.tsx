"use client";

import { useState, useEffect } from 'react';
import { SearchHandler } from './search.interface';

const DocumentSet = [
    'PSSCOC',
    'EIR',
    // Add More Document Set as needed
];

export default function SearchSelection(
    props: Pick<SearchHandler, "collSelected" | "handleCollSelect">,
) {
    const [currentDocumentIndex, setCurrentDocumentIndex] = useState(0);

    const handleDocumentSetChange = (documentSet: string) => {
        props.handleCollSelect(documentSet);
    };

    // Automatically advance to the next document set after a delay
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentDocumentIndex < DocumentSet.length - 1) {
                setCurrentDocumentIndex((prevIndex) => prevIndex + 1);
            }
            else {
                clearInterval(timer); // Stop the timer when all document set have been displayed
            }
        }, 100); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, [currentDocumentIndex, DocumentSet]);

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl pb-0">
            <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h2 className="text-lg text-center font-semibold mb-4">Select Document Set to Search in:</h2>
                {/* <p className="text-center text-sm text-gray-500 mb-4">{dialogMessage}</p> */}
                {DocumentSet.map((title, index) => (
                    <ul>
                        <li key={index} className={`p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg hover:bg-zinc-500/30 transition duration-300 ease-in-out transform cursor-pointer ${index <= currentDocumentIndex ? 'opacity-100 duration-500' : 'opacity-0'}`}>
                            <button
                                className="text-blue-500 w-full text-left"
                                onClick={() => handleDocumentSetChange(title)}
                            >
                                {title}
                            </button>
                        </li>
                    </ul>
                ))}
            </div>
        </div>
    );
};