"use client";

import { useEffect, useState } from 'react';

const AdminPage: React.FC = () => {
    const [userRequests, setUserRequests] = useState<any[]>([]);

    useEffect(() => {
        // Fetch collection requests from the server
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/public-collections-requests');
                if (!response.ok) {
                    console.error('Error fetching collection requests:', response.statusText);
                    return;
                }
                const data = await response.json();
                setUserRequests(data.pubCollectionsReq);
                console.log('Collection Requests:', data.pubCollectionsReq);
            } catch (error) {
                console.error('Error fetching collection requests:', error);
            }
        };
        fetchRequests();
    }, []);

    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full bg-white dark:bg-zinc-700/30">
            <div className="space-y-2 p-4 flex">
                <div className="flex flex-col w-full justify-center gap-4">
                    <h1 className='text-center font-bold text-xl'>Collection Requests</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>Display Name</th>
                                <th>Description</th>
                                <th>Requested At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {userRequests.map((request, index) => (
                                <tr key={index}>
                                    <td>{request.collections.display_name}</td>
                                    <td>{request.collections.description}</td>
                                    <td>{request.created_at}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminPage;