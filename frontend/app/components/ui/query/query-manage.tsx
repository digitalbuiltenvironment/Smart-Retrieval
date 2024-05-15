"use client";

import { useState, useEffect } from 'react';
import { List, Table, Trash, Eye, EyeOff, RefreshCw } from 'lucide-react';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { IconSpinner } from '@/app/components/ui/icons';

export default function QueryCollectionManage() {
    const [userCollections, setUserCollections] = useState<any[]>([]);
    const [tableView, setTableView] = useState<boolean>(false); // Track whether to show the table view
    const [isRefreshed, setIsRefreshed] = useState<boolean>(true); // Track whether the data has been refreshed
    const [isLoading, setIsLoading] = useState<boolean>(true); // Track whether the data is loading

    // Retrieve the user's collections and public collections requests data from the database
    const getUserCollectionsandRequests = async () => {
        setIsLoading(true);
        // Fetch the user's public collection requests from the API
        fetch('/api/user-public-collections-requests'
            , {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control': 'no-cache', // Disable caching
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                const publicCollectionsRequests = data.userPubCollectionsReq;
                // console.log('Public Collections Requests:', publicCollectionsRequests);
                // Sort the collections by created date in descending order (oldest first)
                publicCollectionsRequests.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
                // Extract the collection data from the public collections requests
                const updatedCollections = publicCollectionsRequests.map((collection: any) => {
                    // Check if the collection has any public collection requests
                    if (collection.public_collections_requests.length === 0) {
                        // If not, return the collection data with no other details
                        return {
                            collection_id: collection.collection_id,
                            display_name: collection.display_name,
                            description: collection.description,
                            isPublic: collection.is_public,
                            // Convert the date to a readable format in the user's locale and timezone e.g. "2022-01-01T12:00:00" => "1 Jan, 2022, 12:00:00 PM"
                            created_at: new Date(collection.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                        };
                    }
                    else {
                        // If the collection has public collection requests, return the collection data with the request status and dates
                        return {
                            collection_id: collection.collection_id,
                            display_name: collection.display_name,
                            description: collection.description,
                            created_at: new Date(collection.created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                            isPublic: collection.is_public,
                            requestType: collection.public_collections_requests[0].is_make_public ? 'Public' : 'Private',
                            requestStatus: collection.public_collections_requests[0].is_pending ? '⏳Pending' : collection.public_collections_requests[0].is_approved ? '✅Approved' : '❌Rejected',
                            requestDate: new Date(collection.public_collections_requests[0].created_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                            updatedRequestDate: new Date(collection.public_collections_requests[0].updated_at).toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true }),
                        };
                    }
                });
                // Update the userCollections state with the fetched data
                setUserCollections(updatedCollections);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching user public collection requests:", error);
                setIsLoading(false);
                return false;
            });
        return true;
    }


    // Fetch the user's collections and public collections requests data from the database on component mount
    useEffect(() => {
        getUserCollectionsandRequests();
    }, []);

    // Function to toggle between list and table views
    const toggleView = () => {
        setTableView((prevValue) => !prevValue);
    };

    // Function to handle requesting to be public or private
    const handleRequest = (collectionId: string, isPublic: boolean) => {
        // Implement request logic here
        console.log(`Requesting to set ${isPublic ? 'be Public' : 'be Private'} for collection with ID: ${collectionId}`);
        // Display a confirmation dialog
        Swal.fire({
            title: 'Request Confirmation',
            text: `Are you sure you want to request to ${isPublic ? 'make this collection Public (available to other users in "Chat/Search")' : 'make this collection Private (remove from "Chat/Search")'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
        }).then((result) => {
            if (result.isConfirmed) {
                // Check if there is an existing request for the collection
                const existingRequest = userCollections.find((collection) => collection.collection_id === collectionId)?.requestStatus;
                const existingRequestType = userCollections.find((collection) => collection.collection_id === collectionId)?.requestType;
                if (existingRequest) {
                    // Display a confirmation dialog if there is an existing request
                    Swal.fire({
                        title: 'Existing Request Found',
                        text: `Existing Request with Status: ${existingRequest} for Type: ${existingRequestType}. Do you want to proceed with this new request?`,
                        icon: 'question',
                        showCancelButton: true,
                        confirmButtonText: 'Yes',
                        cancelButtonText: 'No',
                        confirmButtonColor: '#4caf50',
                        cancelButtonColor: '#b91c1c',
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // If confirm, make a put request to the API & display a success/error message
                            fetch('/api/user-public-collections-requests',
                                {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'Cache-Control': 'no-cache', // Disable caching
                                    },
                                    body: JSON.stringify({ collection_id: collectionId, is_make_public: isPublic }),
                                }
                            )
                                .then(async response => {
                                    if (response.ok) {
                                        // Show success dialog
                                        console.log('Request sent successfully:', response.statusText);
                                        Swal.fire({
                                            title: 'Request Sent',
                                            text: `Your request to ${isPublic ? 'make this collection Public' : 'make this collection Private'} has been sent successfully.`,
                                            icon: 'success',
                                            confirmButtonText: 'OK',
                                            confirmButtonColor: '#4caf50',
                                        });
                                        // Refresh the userCollections state after the request is sent
                                        getUserCollectionsandRequests();
                                    } else {
                                        const data = await response.json();
                                        // Log to console
                                        console.error('Error sending request:', data.error);
                                        // Show error dialog
                                        Swal.fire({
                                            title: 'Request Failed',
                                            text: 'An error occurred while sending the request. Please try again later. (Check Console for more details)',
                                            icon: 'error',
                                            confirmButtonText: 'OK',
                                            confirmButtonColor: '#4caf50',
                                        });
                                    }
                                })
                                .catch(error => {
                                    console.error('Error sending request:', error);
                                    // Show error dialog
                                    Swal.fire({
                                        title: 'Error!',
                                        text: 'Failed to send request. Please try again later. (Check Console for more details)',
                                        icon: 'error',
                                        confirmButtonColor: '#4caf50',
                                    });
                                });
                        }
                    });
                }
                // If there is no existing request, make a post request to the API & display a success/error message
                else {
                    fetch('/api/user-public-collections-requests',
                        {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                'Cache-Control': 'no-cache', // Disable caching
                            },
                            body: JSON.stringify({ collection_id: collectionId, is_make_public: isPublic }),
                        }
                    )
                        .then(async response => {
                            if (response.ok) {
                                // Show success dialog
                                console.log('Request sent successfully:', response.statusText);
                                Swal.fire({
                                    title: 'Request Sent',
                                    text: `Your request to ${isPublic ? 'make this collection Public' : 'make this collection Private'} has been sent successfully.`,
                                    icon: 'success',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#4caf50',
                                });
                                // Refresh the userCollections state after the request is sent
                                getUserCollectionsandRequests();
                            } else {
                                const data = await response.json();
                                // Log to console
                                console.error('Error sending request:', data.error);
                                // Show error dialog
                                Swal.fire({
                                    title: 'Request Failed',
                                    text: 'An error occurred while sending the request. Please try again later. (Check Console for more details)',
                                    icon: 'error',
                                    confirmButtonText: 'OK',
                                    confirmButtonColor: '#4caf50',
                                });
                            }
                        })
                        .catch(error => {
                            console.error('Error sending request:', error);
                            // Show error dialog
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to send request. Please try again later. (Check Console for more details)',
                                icon: 'error',
                                confirmButtonColor: '#4caf50',
                            });
                        });
                }
            }
        });
    };

    // Function to handle cancelling a request
    const handleCancelRequest = (collectionId: string, isPublic: boolean) => {
        // Implement cancel request logic here
        console.log(`Cancelling request for collection with ID: ${collectionId}`);
        // Display a confirmation dialog
        Swal.fire({
            title: 'Cancel Request Confirmation',
            text: `Are you sure you want to cancel the request to ${isPublic ? 'make this collection Private' : 'make this collection Public'}?`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
        }).then((result) => {
            if (result.isConfirmed) {
                // Make a delete request to the API & display a success/error message
                fetch('/api/user-public-collections-requests',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache', // Disable caching
                        },
                        body: JSON.stringify({ collection_id: collectionId }),
                    }
                )
                    .then(async response => {
                        if (response.ok) {
                            // Show success dialog
                            console.log('Request cancelled successfully:', response.statusText);
                            Swal.fire({
                                title: 'Request Cancelled',
                                text: `Your request to ${isPublic ? 'make this collection Private' : 'make this collection Public'} has been cancelled successfully.`,
                                icon: 'success',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#4caf50',
                            });
                            // Refresh the userCollections state after the request is sent
                            getUserCollectionsandRequests();
                        } else {
                            const data = await response.json();
                            // Log to console
                            console.error('Error cancelling request:', data.error);
                            // Show error dialog
                            Swal.fire({
                                title: 'Request Cancellation Failed',
                                text: 'An error occurred while cancelling the request. Please try again later. (Check Console for more details)',
                                icon: 'error',
                                confirmButtonText: 'OK',
                                confirmButtonColor: '#4caf50',
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error cancelling request:', error);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to upload and index document set. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                    });
            }
        });
    };

    // Function to handle deleting a collection
    const handleDelete = (collectionId: string, isPublic: boolean) => {
        // Implement delete logic here
        console.log(`Deleting collection with ID: ${collectionId}`);
        // Display a confirmation dialog
        Swal.fire({
            title: 'Delete Confirmation',
            text: `Are you sure you want to delete this collection? This action cannot be undone!`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
        }).then((result) => {
            if (result.isConfirmed) {
                // If the user confirms the delete, make a delete request to the API, display a success/error message
                fetch('/api/user-public-collections-requests',
                    {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache', // Disable caching
                        },
                        body: JSON.stringify({ collection_id: collectionId }),
                    }
                )
                    .then(async response => {
                        if (response.ok) {
                            // If the delete request is successful, display a success message
                            console.log('Collection deleted successfully:', response.statusText);
                            Swal.fire({
                                title: 'Collection Deleted!',
                                text: 'Your collection has been deleted successfully.',
                                icon: 'success',
                                confirmButtonColor: '#4caf50',
                            });
                            // Refresh the userCollections state after the request is sent
                            getUserCollectionsandRequests();
                        } else {
                            const data = await response.json();
                            // Log to console
                            console.error('Error deleting collection:', data.error);
                            // Show error dialog
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to delete collection. Please try again later. (Check Console for more details)',
                                icon: 'error',
                                confirmButtonColor: '#4caf50',
                            });
                        }
                    })
                    .catch(error => {
                        console.error('Error uploading and indexing document set:', error);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Failed to delete collection. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                    });
            }
        });
    };

    const handleRefresh = async () => {
        setIsRefreshed(false);
        const timer = setInterval(() => {
            // Timer to simulate a spinner while refreshing data
            setIsRefreshed(true);
        }, 1000); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)
        // Display a toast notification
        if (await getUserCollectionsandRequests()) {
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
                <h2 className="text-lg text-center font-semibold mb-4">Manage Your Collections:</h2>
                <div className="flex justify-between mb-2 mx-2">
                    {/* Refresh Data button */}
                    <button onClick={handleRefresh}
                        className="flex items-center justify-center hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-500/10 focus:bg-blue-500/10"
                        title='Refresh Data'
                    >
                        {isRefreshed ? <RefreshCw className='w-5 h-5' /> : <RefreshCw className='w-5 h-5 animate-spin' />}
                    </button>
                    {/* Button to toggle between list and table views */}
                    <button onClick={toggleView} className="flex items-center text-center text-sm text-gray-500 underline gap-2 hover:text-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-full p-1 transition duration-300 ease-in-out transform hover:scale-110 hover:bg-blue-500/10 focus:bg-blue-500/10">
                        {tableView ? <Table /> : <List />}
                        {tableView ? 'Table View' : 'List View'}
                    </button>
                </div>
                {/* Render list or table view based on the tableView state */}
                {isLoading ? (
                    <IconSpinner className='w-10 h-10 mx-auto my-auto animate-spin' />
                ) : userCollections.length === 0 ? (
                    <div className="mx-auto my-auto text-center text-lg text-gray-500 dark:text-gray-400">No collections found.</div>
                ) : tableView ? (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                            <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Display Name</th>
                                    <th scope="col" className="px-6 py-3">Description</th>
                                    <th scope="col" className="px-6 py-3">Created</th>
                                    <th scope="col" className="px-6 py-3">Visibility</th>
                                    <th scope="col" className="px-6 py-3">Request Status</th>
                                    <th scope="col" className="px-6 py-3">Requested</th>
                                    <th scope="col" className="px-6 py-3">Request Updated</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {userCollections.map((collection, index) => (
                                    <tr className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" key={index}>
                                        {/* Render table rows */}
                                        <td className="px-6 py-3">{collection.display_name}</td>
                                        <td className="px-6 py-3">{collection.description}</td>
                                        <td className="px-6 py-3">{collection.created_at}</td>
                                        <td className="px-6 py-3">{collection.isPublic ? <div className='flex items-center'><Eye className='w-4 h-4 mr-1' /> Public</div> : <div className='flex items-center'><EyeOff className='w-4 h-4 mr-1' /> Private</div>}</td>
                                        <td className="px-6 py-3">
                                            <div>
                                                <span className={
                                                    `${collection.requestStatus === '⏳Pending' ? 'text-orange-400' :
                                                        collection.requestStatus === '✅Approved' ? 'text-green-500' :
                                                            collection.requestStatus === '❌Rejected' ? 'text-red-500' : ''}`
                                                }>
                                                    {collection.requestStatus}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-3">{collection.requestDate}</td>
                                        <td className="px-6 py-3">{collection.updatedRequestDate}</td>
                                        <td className="px-6 py-3 w-full flex flex-wrap justify-between gap-2">
                                            {/* Conditional rendering button based on request status */}
                                            {collection.requestStatus === '⏳Pending' ? (
                                                <button onClick={() => handleCancelRequest(collection.collection_id, collection.isPublic)}
                                                    title='Cancel Request'
                                                    className="flex flex-grow text-center items-center justify-center text-xs lg:text-sm bg-orange-400 text-white px-1 py-1 lg:px-3 lg:py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-orange-500/40"
                                                >
                                                    Cancel Request
                                                </button>
                                            ) :
                                                collection.isPublic ? (
                                                    <button onClick={() => handleRequest(collection.collection_id, false)}
                                                        disabled={collection.requestStatus === '⏳Pending'}
                                                        title='Set Private'
                                                        className="flex flex-grow text-center items-center text-sm disabled:bg-gray-500 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                    >
                                                        <EyeOff className='w-5 h-5' />
                                                        Set Private
                                                    </button>
                                                ) : (
                                                    <button onClick={() => handleRequest(collection.collection_id, true)}
                                                        disabled={collection.requestStatus === '⏳Pending'}
                                                        title='Set Public'
                                                        className="flex flex-grow text-center items-center text-sm disabled:bg-gray-500 bg-blue-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                    >
                                                        <Eye className='w-5 h-5' />
                                                        Set Public
                                                    </button>
                                                )}
                                            <button onClick={() => handleDelete(collection.collection_id, true)}
                                                title='Delete'
                                                className="flex flex-grow text-center items-center text-sm disabled:bg-gray-500 bg-red-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                            >
                                                <Trash className='w-4 h-4 mr-1' />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <ul className={`transition duration-500 ease-in-out transform ${!isLoading ? "" : "animate-pulse"}`}>
                        {userCollections.map((collection, index) => (
                            <li key={index} className="p-2 mb-2 border border-zinc-500/30 dark:border-white rounded-lg overflow-y-auto">
                                {/* Render list items */}
                                <div className="flex items-center justify-between">
                                    <div className='justify-start'>
                                        <div className='text-xs lg:text-base text-blue-500'>{collection.display_name}</div>
                                        <div className="text-xs lg:text-sm text-gray-500">{collection.description}</div>
                                        <div className="border-b border-zinc-500/30 dark:border-white my-2"></div> {/* Divider */}
                                        <div className="text-xs lg:text-sm"><span className='font-bold'>Created: </span>{collection.created_at}</div>
                                        <div className='flex items-center text-xs lg:text-sm'><span className='font-bold'>Visibility: </span>{collection.isPublic ? <span className='flex text-center items-center'><Eye className='w-4 h-4 mx-1' />Public</span> : <span className='flex text-center items-center'><EyeOff className='w-4 h-4 mx-1' />Private</span>}</div>

                                        {/* Render request status and dates */}
                                        {collection.requestStatus && (
                                            <div className='flex flex-col items-start text-xs lg:text-sm'>
                                                <div><span className='font-bold'>Request Type: </span>{collection.requestType}</div>
                                                <div>
                                                    <span className='font-bold'>Request Status: </span>
                                                    <span className={
                                                        `${collection.requestStatus === '⏳Pending' ? 'text-orange-400' :
                                                            collection.requestStatus === '✅Approved' ? 'text-green-500' :
                                                                collection.requestStatus === '❌Rejected' ? 'text-red-500' : ''}`
                                                    }>
                                                        {collection.requestStatus}
                                                    </span>
                                                </div>
                                                <div><span className='font-bold'>Requested: </span>{collection.requestDate}</div>
                                                <div><span className='font-bold'>Request Updated: </span>{collection.updatedRequestDate}</div>
                                            </div>
                                        )}
                                    </div>
                                    {/* Manage section */}
                                    <div className="flex flex-col justify-between gap-2">
                                        {/* Conditional rendering button based on request status */}
                                        {collection.requestStatus === '⏳Pending' ? (
                                            <button onClick={() => handleCancelRequest(collection.collection_id, collection.isPublic)}
                                                title='Cancel Request'
                                                className="flex flex-grow text-center items-center justify-center text-xs lg:text-sm bg-orange-400 text-white px-1 py-1 lg:px-3 lg:py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-orange-500/40"
                                            >
                                                Cancel Request
                                            </button>
                                        ) :
                                            collection.isPublic ? (
                                                <button onClick={() => handleRequest(collection.collection_id, false)}
                                                    title='Set Private'
                                                    className="flex flex-grow text-center items-center justify-center text-xs lg:text-sm bg-blue-500 text-white px-1 py-1 lg:px-3 lg:py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                >
                                                    <EyeOff className='w-4 h-4 mr-1' />
                                                    <span>Set Private</span>
                                                </button>
                                            ) : (
                                                <button onClick={() => handleRequest(collection.collection_id, true)}
                                                    title='Set Public'
                                                    className="flex flex-grow text-center items-center justify-center text-xs lg:text-sm bg-blue-500 text-white px-1 py-1 lg:px-3 lg:py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-blue-500/40"
                                                >
                                                    <Eye className='w-4 h-4 mr-1' />
                                                    <span>Set Public</span>
                                                </button>
                                            )}
                                        {/* Delete button */}
                                        <button onClick={() => handleDelete(collection.collection_id, true)}
                                            title='Delete'
                                            className="flex flex-grow text-center items-center justify-center text-xs lg:text-sm disabled:bg-gray-500 bg-red-500 text-white px-2 py-2 lg:px-3 lg:py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                        >
                                            <Trash className='w-4 h-4 mr-1' />
                                            <span>Delete</span>
                                        </button>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
