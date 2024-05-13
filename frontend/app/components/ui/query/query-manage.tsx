"use client";

import { useState, useEffect } from 'react';
import { QueryCollectionManageHandler } from './query.interface';
import { List, Table, Trash, Eye, EyeOff } from 'lucide-react';

export default function QueryCollectionManage(
    props: Pick<QueryCollectionManageHandler, "collSelected" | "handleCollSelect">,
) {
    const [userCollections, setUserCollections] = useState<any[]>([]);
    const [currentCollectionIndex, setCurrentCollectionIndex] = useState(0);
    const [tableView, setTableView] = useState<boolean>(true); // Track whether to show the table view

    const handleCollectionSelect = (collectionId: string) => {
        props.handleCollSelect(collectionId);
    };

    // Retrieve the user's document collections from the database
    useEffect(() => {
        // Fetch the user's collections from the API
        fetch('/api/user-collections')
            .then((response) => response.json())
            .then((data) => {
                setUserCollections(data.userCollections);
            })
            .catch((error) => {
                console.error("Error fetching user collections:", error);
            });
    }, []);

    // Automatically advance to the next collection set after a delay
    useEffect(() => {
        const timer = setInterval(() => {
            if (currentCollectionIndex < userCollections.length - 1) {
                setCurrentCollectionIndex((prevIndex) => prevIndex + 1);
            } else {
                clearInterval(timer); // Stop the timer when all collection sets have been displayed
            }
        }, 100); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)

        return () => clearInterval(timer); // Cleanup the timer on component unmount
    }, [currentCollectionIndex, userCollections]);

    // Function to toggle between list and table views
    const toggleView = () => {
        setTableView((prevValue) => !prevValue);
    };

    // Function to handle requesting to be public or private
    const handleRequest = (collectionId: string, isPublic: boolean) => {
        // Implement request logic here
        console.log(`Requesting to ${isPublic ? 'be Private' : 'be Public'} for collection with ID: ${collectionId}`);
    };

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-5 pl-5 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h2 className="text-lg text-center font-semibold mb-4">Manage Your Collections:</h2>
                <div className="flex justify-end mb-2">
                    {/* Button to toggle between list and table views */}
                    <button onClick={toggleView} className="flex items-center text-center text-sm text-gray-500 underline gap-2">
                        {tableView ? <Table /> : <List />}
                        {tableView ? 'Table View' : 'List View'}
                    </button>
                </div>
                {/* Render list or table view based on the tableView state */}
                {tableView ? (
                    <ul>
                        {userCollections.map((collection, index) => (
                            <li key={index} className={`p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg transition duration-300 ease-in-out transform ${index <= currentCollectionIndex ? 'opacity-100 duration-500' : 'opacity-0'}`}>
                                {/* Render list items */}
                                <div className="flex items-center justify-between">
                                    <div className='justify-start'>
                                        <div className='text-s lg:text-base text-blue-500'>{collection.display_name}</div>
                                        <div className="text-xs lg:text-sm text-gray-500">{collection.description}</div>
                                        <span className='text-xs lg:text-sm'> Visibility: {collection.isPublic ? 'Public' : 'Private'}</span>
                                        {/* Render request status and dates */}
                                        {collection.requestStatus && (
                                            <>
                                                <div>Request Status: {collection.requestStatus}</div>
                                                <div>Request Date: {collection.requestDate}</div>
                                                <div>Updated Request Date: {collection.updatedRequestDate}</div>
                                            </>
                                        )}
                                    </div>
                                    {/* Manage section */}
                                    <div className="flex flex-wrap justify-between gap-2">
                                        {/* Request to be Public button */}
                                        {collection.isPublic ? (
                                            <button onClick={() => handleRequest(collection.collection_id, false)}
                                                title='Make Private'
                                                className="flex flex-grow text-center items-center text-xs lg:text-sm disabled:bg-gray-500 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                            >
                                                <EyeOff className='w-4 h-4 mr-1' />
                                                <span>Make Private</span>
                                            </button>
                                        ) : (
                                            <button onClick={() => handleRequest(collection.collection_id, true)}
                                                title='Make Public'
                                                className="flex flex-grow text-center items-center text-xs lg:text-sm disabled:bg-gray-500 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                            >
                                                <Eye className='w-4 h-4 mr-1' />
                                                <span>Make Public</span>
                                            </button>
                                        )}
                                        {/* Delete button */}
                                        <button onClick={() => handleRequest(collection.collection_id, true)}
                                            title='Delete'
                                            className="flex flex-grow text-center items-center text-xs lg:text-sm disabled:bg-gray-500 bg-red-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                        >
                                            <Trash className='w-4 h-4 mr-1' />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                            <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Display Name</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Visibility</th>
                                    <th scope="col" className="px-6 py-3">Request Status</th>
                                    <th scope="col" className="px-6 py-3">Requested at</th>
                                    <th scope="col" className="px-6 py-3">Request Updated at</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCollections.map((collection, index) => (
                                    <tr className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" key={index}>
                                        {/* Render table rows */}
                                        <td className="px-6 py-3">{collection.display_name}</td>
                                        <td className="px-6 py-3">{collection.description}</td>
                                        <td className="px-6 py-3">{collection.isPublic ? 'Public' : 'Private'}</td>
                                        <td className="px-6 py-3">{collection.requestStatus}</td>
                                        <td className="px-6 py-3">{collection.requestDate}</td>
                                        <td className="px-6 py-3 w-full">{collection.updatedRequestDate}</td>
                                        <td className="px-6 py-3 space-y-2 w-full">
                                            {/* Render request buttons and status */}
                                            {collection.isPublic ? (
                                                <button onClick={() => handleRequest(collection.collection_id, false)}
                                                    className="text-center items-center text-sm disabled:bg-orange-400 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                >
                                                    Make Private
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRequest(collection.collection_id, true)}
                                                    className="text-center items-center text-sm disabled:bg-orange-400 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                >
                                                    Make Public
                                                </button>
                                            )}
                                            <button onClick={() => handleRequest(collection.collection_id, true)}
                                                className="text-center items-center text-sm disabled:bg-gray-500 bg-red-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
