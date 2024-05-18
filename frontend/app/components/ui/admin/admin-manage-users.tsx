"use client";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { RefreshCw, UserCheck, UserX } from "lucide-react";
import { IconSpinner } from "@/app/components/ui/icons";
import Swal from "sweetalert2";

export default function AdminManageUsers() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [isRefreshed, setIsRefreshed] = useState<boolean>(true); // Track whether the data has been refreshed

    // Fetch the users from the database
    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await fetch('/api/admin/users',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Cache-Control': 'no-cache', // Disable cache to get the latest data
                    },
                }
            );
            if (!response.ok) {
                console.error('Error fetching users:', response.statusText)
                toast.error('Error fetching users:', {
                    position: "top-right",
                    closeOnClick: true,
                });
                setLoading(false);
                return false;
            }
            const data = await response.json();
            console.log('Users:', data.users);
            // Retrieve the necessary data from the response
            const formattedUsers = data.users.map((user: any) => ({
                id: user.id,
                name: user.name,
                email: user.email,
                isAdmin: user.admins.length > 0,
            }));
            setUsers(formattedUsers);
        } catch (error) {
            console.error('Error fetching users:', error);
            toast.error('Error fetching users:', {
                position: "top-right",
                closeOnClick: true,
            });
            setLoading(false);
            return false;
        }
        setLoading(false);
        return true;
    };

    // On component mount, fetch the users from the database
    useEffect(() => {
        fetchUsers();
    }, []);

    // Handle to promote the user to admin status
    const handlePromote = async (userId: string) => {
        // Display a confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to promote this user to admin status.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('/api/admin/users/promote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache', // Disable cache to get the latest data
                        },
                        body: JSON.stringify({
                            id: userId
                        }),
                    });
                    if (!response.ok) {
                        console.error('Error promoting user:', response.statusText);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error promoting user. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                        return;
                    }
                    // Show success dialog
                    Swal.fire({
                        title: 'Success!',
                        text: 'User promoted successfully!',
                        icon: 'success',
                        confirmButtonColor: '#4caf50',
                    });
                    // Refresh the data
                    fetchUsers();
                } catch (error) {
                    console.error('Error promoting user:', error);
                    // Show error dialog
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error promoting user. Please try again later. (Check Console for more details)',
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            }
        });
    }

    // Handle to demote the user from admin status
    const handleDemote = async (userId: string) => {
        // Display a confirmation dialog
        Swal.fire({
            title: 'Are you sure?',
            text: "You are about to demote this user from admin status.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#4caf50',
            cancelButtonColor: '#b91c1c',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const response = await fetch('/api/admin/users/demote', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Cache-Control': 'no-cache', // Disable cache to get the latest data
                        },
                        body: JSON.stringify({
                            id: userId
                        }),
                    });
                    if (!response.ok) {
                        console.error('Error demoting user:', response.statusText);
                        // Show error dialog
                        Swal.fire({
                            title: 'Error!',
                            text: 'Error demoting user. Please try again later. (Check Console for more details)',
                            icon: 'error',
                            confirmButtonColor: '#4caf50',
                        });
                        return;
                    }
                    // Show success dialog
                    Swal.fire({
                        title: 'Success!',
                        text: 'User demoted successfully!',
                        icon: 'success',
                        confirmButtonColor: '#4caf50',
                    });
                    // Refresh the data
                    fetchUsers();
                } catch (error) {
                    console.error('Error demoting user:', error);
                    // Show error dialog
                    Swal.fire({
                        title: 'Error!',
                        text: 'Error demoting user. Please try again later. (Check Console for more details)',
                        icon: 'error',
                        confirmButtonColor: '#4caf50',
                    });
                }
            }
        });
    }

    // Handle to refresh the data
    const handleRefresh = async () => {
        setIsRefreshed(false);
        const timer = setInterval(() => {
            // Timer to simulate a spinner while refreshing data
            setIsRefreshed(true);
        }, 1000); // Adjust the delay time as needed (e.g., 5000 milliseconds = 5 seconds)
        // Display a toast notification
        if (await fetchUsers()) {
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
                <h1 className='text-center font-bold text-xl mb-4'>Manage Users</h1>
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
                ) : users.length === 0 ? (
                    <div className="mx-auto my-auto text-center text-lg text-gray-500 dark:text-gray-400">No Users Found.</div>
                ) : (
                    <div className="relative overflow-x-auto rounded-lg">
                        <table className="w-full text-xl text-left rtl:text-right text-gray-500 dark:text-gray-400 p-4">
                            <thead className="text-sm text-center text-gray-700 uppercase bg-gray-400 dark:bg-gray-700 dark:text-gray-400">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Name</th>
                                    <th scope="col" className="px-6 py-3">Email</th>
                                    <th scope="col" className="px-6 py-3">Level</th>
                                    <th scope="col" className="px-6 py-3">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user, index) => (
                                    <tr className="text-sm text-center item-center bg-gray-100 border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600" key={index}>
                                        {/* Render table rows */}
                                        <td className="px-6 py-3">{user.name}</td>
                                        <td className="px-6 py-3">{user.email}</td>
                                        <td className="px-6 py-3 font-bold">{user.isAdmin ? "Admin" : "User"}</td>
                                        <td className="px-6 py-3 w-full flex flex-wrap justify-between gap-2">
                                            {/* Promote/Demute Admin Status */}
                                            {user.isAdmin ? (
                                                <button onClick={() => handleDemote(user.id)}
                                                    title='Demote User'
                                                    className="flex flex-grow justify-center items-center text-sm disabled:bg-gray-500 bg-red-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-red-500/40"
                                                >
                                                    <span className='flex items-center'>
                                                        <UserX className='w-4 h-4 mr-1' />
                                                        <span>Demote</span>
                                                    </span>
                                                </button>) : (
                                                <button onClick={() => handlePromote(user.id)}
                                                    title='Promote User'
                                                    className="flex flex-grow justify-center items-center text-sm disabled:bg-gray-500 bg-green-500 text-white px-3 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:bg-green-500/40"
                                                >
                                                    <span className='flex items-center'>
                                                        <UserCheck className='w-4 h-4 mr-1' />
                                                        <span>Promote</span>
                                                    </span>
                                                </button>
                                            )
                                            }

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