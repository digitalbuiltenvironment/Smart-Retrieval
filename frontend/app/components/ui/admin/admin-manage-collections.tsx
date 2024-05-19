"use client";

import { useEffect, useState } from 'react';
import { Eye, EyeOff, RefreshCw } from 'lucide-react';
import { IconSpinner } from '@/app/components/ui/icons';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';

export default function AdminManageCollections() {
    const [collectionsData, setCollectionsData] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshed, setIsRefreshed] = useState<boolean>(true); // Track whether the data has been refreshed

    // Fetch collection requests from the server
    const fetchCollections = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/collections',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache', // Disable cache to get the latest data
                    },
                }
            );
            if (!response.ok) {
                console.error('Error fetching collections:', response.statusText)
                toast.error('Error fetching collections:', {
                    position: "top-right",
                    closeOnClick: true,
                });
                setLoading(false);
                return false;
            }
            const data = await response.json();
            // Sort the collections by created date in descending order (oldest first)
            const sortedData = data.collections.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
            setCollectionsData(sortedData);
            console.log('Collections:', sortedData);
        } catch (error) {
            console.error('Error fetching collections:', error);
            toast.error('Error fetching collections:', {
                position: "top-right",
                closeOnClick: true,
            });
            setLoading(false);
            return false;
        }
        setLoading(false);
        return true;
    };

    useEffect(() => {
        // Fetch collections from the server
        fetchCollections();
    }, []);

    // Handle make private a collection
    const handleMakePrivate = async (collectionId: string) => {
        // Show confirmation dialog
        Swal.fire({
            title: 'Private Request Confirmation',
            text: "Are you sure you want to make this collection Private?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
        }).then((result) => {
            if (result.isConfirmed) {
                // if user confirms, send request to server
                fetch(`/api/admin/collections-requests/reject`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        collection_id: collectionId,
                    }),
                }).then(async (response) => {
                    if (!response.ok) {
                        console.error('Error setting collection Private:', response.statusText);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error setting collection Private. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                        return;
                    }
                    const data = await response.json();
                    console.log('Collection Set to Private Success:', data);
                    // Show success dialog
                    Swal.fire({
                        title: 'Success!',
                        text: 'Collection has been set to Private successfully.',
                        icon: 'success',
                        confirmButtonColor: '#4caf50',
                    });
                    // Refresh the collections data
                    fetchCollections();
                }).catch((error) => {
                    console.error('Error setting collection Private:', error);
                    // Show error dialog
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error setting collection Private. Please try again later. (Check Console for more details)',
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                });
            }
        });
    }

    // Handle make public a collection
    const handleMakePublic = async (collectionId: string) => {
        // Show confirmation dialog
        Swal.fire({
            title: 'Public Request Confirmation',
            text: "Are you sure you want to make this collection Public?",
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
        }).then((result) => {
            if (result.isConfirmed) {
                // if user confirms, send request to server
                fetch(`/api/admin/collections-requests/approve`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        collection_id: collectionId,
                    }),
                }).then(async (response) => {
                    if (!response.ok) {
                        console.error('Error setting collection Public:', response.statusText);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error setting collection Public. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                        return;
                    }
                    const data = await response.json();
                    console.log('Collection Set to Public Success:', data);
                    // Show success dialog
                    Swal.fire({
                        title: 'Success!',
                        text: 'Collection has been set to Public successfully.',
                        icon: 'success',
                        confirmButtonColor: '#4caf50',
                    });
                    // Remove approved request from the list
                    setCollectionsData(collectionsData.filter((collection) => collection.collection_id !== collectionId));
                }).catch((error) => {
                    console.error('Error setting collection Public:', error);
                    // Show error dialog
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error setting collection Public. Please try again later. (Check Console for more details)',
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                });
            }
        });
    }

    const handleRefresh = async () => {
        setIsRefreshed(false);
        const timer = setInterval(() => {
            // Timer to simulate a spinner while refreshing data
            setIsRefreshed(true);
        }, 1000); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)
        // Display a toast notification
        if (await fetchCollections()) {
            toast('Data refreshed successfully!', {
                type: 'success',
                position: 'top-right',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
        else {
            toast('Error refreshing data. Please try again later.', {
                type: 'error',
                position: 'top-right',
                autoClose: 3000,
                closeOnClick: true,
                pauseOnHover: true,
            });
        }
        return () => clearInterval(timer); // Cleanup the timer on complete
    }

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-5 pl-5 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h1 className='text-center font-bold text-xl mb-4'>Manage Collections</h1>
                <div className="flex items-center justify-start gap-2 mb-4">
                    {/* Refresh Data button */}
                    <button onClick={handleRefresh}
                        className="flex items-center justify-center hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-500/10 focus:bg-blue-500/10"
                        title='Refresh Data'
                    >
                        {isRefreshed ? <RefreshCw className='w-5 h-5' /> : <RefreshCw className='w-5 h-5 animate-spin' />}
                    </button>
                </div>
                {loading ? (
                    <IconSpinner className='w-10 h-10 mx-auto my-auto animate-spin' />
                ) : collectionsData.length === 0 ? (
                    <div className="mx-auto my-auto text-center text-lg text-gray-500 dark:text-gray-400">No Collections Found.</div>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                            <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Display Name</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Current Visibility</th>
                                    <th scope="col" className="px-6 py-3">Created</th>
                                    <th scope="col" className="px-6 py-3">Owner</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {collectionsData.map((collection, index) => (
                                    <tr className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" key={index}>
                                        {/* Render table rows */}
                                        <td className="px-6 py-3">{collection.display_name}</td>
                                        <td className="px-6 py-3">{collection.description}</td>
                                        <td className="px-6 py-3">{collection.is_public ? <span className='flex justify-center items-center'><Eye className='w-4 h-4 mr-1' /> Public</span> : <span className='flex justify-center items-center'><EyeOff className='w-4 h-4 mr-1' /> Private</span>}</td>
                                        <td className="px-6 py-3">{new Date(collection.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</td>
                                        <td className="px-6 py-3">{collection.users.name}</td>
                                        <td className="px-6 py-3">{collection.users.email}</td>
                                        <td className="px-6 py-3 w-full">
                                            <div className="flex justify-center items-center gap-2">
                                                {/* Set Public or Private Status */}
                                                {collection.is_public ? (
                                                    <button onClick={() => handleMakePrivate(collection.collection_id)}
                                                        title='Set Private'
                                                        className="flex flex-grow justify-center items-center text-sm bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                    >
                                                        <span className='flex items-center'>
                                                            <EyeOff className='w-4 h-4 mr-1' />
                                                            <span>Set Private</span>
                                                        </span>
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleMakePublic(collection.collection_id)}
                                                        title='Set Public'
                                                        className="flex flex-grow justify-center items-center text-sm bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                    >
                                                        <span className='flex items-center'>
                                                            <Eye className='w-4 h-4 mr-1' />
                                                            <span>Set Public</span>
                                                        </span>
                                                    </button>
                                                )}
                                            </div>
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