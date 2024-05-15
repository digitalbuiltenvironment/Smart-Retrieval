"use client";

import { useEffect, useState } from 'react';
import { Eye, EyeOff, X, Check } from 'lucide-react';
import { IconSpinner } from '@/app/components/ui/icons';

export default function AdminNewCollectionsRequests() {
    const [userRequests, setUserRequests] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        // Fetch userRequest requests from the server
        const fetchRequests = async () => {
            try {
                setLoading(true);
                const response = await fetch('/api/public-collections-requests');
                if (!response.ok) {
                    console.error('Error fetching userRequest requests:', response.statusText);
                    return;
                }
                const data = await response.json();
                setUserRequests(data.pubCollectionsReq);
                console.log('Collection Requests:', data.pubCollectionsReq);
            } catch (error) {
                console.error('Error fetching userRequest requests:', error);
            }
            setLoading(false);
        };
        fetchRequests();
    }, []);

    // Handle reject collection request
    const handleReject = async (collectionId: string) => {
        try {
            const response = await fetch(`/api/public-collections-requests`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    collection_id: collectionId,
                    is_approved: false
                }),
            });
            if (!response.ok) {
                console.error('Error rejecting collection request:', response.statusText);
                return;
            }
            const data = await response.json();
            console.log('Collection request rejected:', data);
            setUserRequests(userRequests.filter((userRequest) => userRequest.collection_id !== collectionId));
        } catch (error) {
            console.error('Error rejecting collection request:', error);
        }
    }

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-5 pl-5 flex h-[50vh] flex-col overflow-y-auto pb-4">
                <h1 className='text-center font-bold text-xl mb-4'>New Collection Requests</h1>
                {loading ? (
                    <IconSpinner className='w-10 h-10 mx-auto my-auto animate-spin' />
                ) : userRequests.length === 0 ? (
                    <div className="mx-auto my-auto text-center text-lg text-gray-500 dark:text-gray-400">No New Requests.</div>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                            <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Display Name</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Current Visibility</th>
                                    <th scope="col" className="px-6 py-3">Request Type</th>
                                    <th scope="col" className="px-6 py-3">Requested</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userRequests.map((userRequest, index) => (
                                    <tr className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" key={index}>
                                        {/* Render table rows */}
                                        <td className="px-6 py-3">{userRequest.collections.display_name}</td>
                                        <td className="px-6 py-3">{userRequest.collections.description}</td>
                                        <td className="px-6 py-3">{userRequest.collections.is_public ? <span className='flex justify-center items-center'><Eye className='w-4 h-4 mr-1' /> Public</span> : <span className='flex justify-center items-center'><EyeOff className='w-4 h-4 mr-1' /> Private</span>}</td>
                                        <td className="px-6 py-3">{userRequest.is_make_public ? <span className='flex justify-center items-center'><Eye className='w-4 h-4 mr-1' /> Public</span> : <span className='flex justify-center items-center'><EyeOff className='w-4 h-4 mr-1' /> Private</span>}</td>
                                        <td className="px-6 py-3">{new Date(userRequest.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true })}</td>
                                        <td className="px-6 py-3 w-full flex flex-wrap justify-between gap-2">
                                            {/* Approved or Reject Status */}
                                            <button onClick={() => handleReject(userRequest.collection_id)}
                                                title='Approve'
                                                className="flex flex-grow justify-center items-center text-sm disabled:bg-gray-500 bg-green-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-green-500/40"
                                            >
                                                <span className='flex items-center'>
                                                    <Check className='w-4 h-4 mr-1' />
                                                    <span>Approve</span>
                                                </span>
                                            </button>
                                            <button onClick={() => handleReject(userRequest.collection_id)}
                                                title='Reject'
                                                className="flex flex-grow justify-center items-center text-sm disabled:bg-gray-500 bg-red-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                            >
                                                <span className='flex items-center'>
                                                    <X className='w-4 h-4 mr-1' />
                                                    <span>Reject</span>
                                                </span>
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