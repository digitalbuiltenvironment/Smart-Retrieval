"use client";

import { useEffect, useState } from 'react';

interface CollectionRequest {
    id: number;
    collectionName: string;
    requesterName: string;
    createdAt: Date;
}

const AdminPage: React.FC = () => {
    const [requests, setRequests] = useState<CollectionRequest[]>([]);

    useEffect(() => {
        // Fetch collection requests from the server
        const fetchRequests = async () => {
            try {
                const response = await fetch('/api/requests');
                const data = await response.json();
                setRequests(data);
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
                    <h1>Collection Requests</h1>
                    <table>
                        <thead>
                            <tr>
                                <th>ID</th>
                                <th>Collection Name</th>
                                <th>Requester Name</th>
                                <th>Created At</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request.id}>
                                    <td>{request.id}</td>
                                    <td>{request.collectionName}</td>
                                    <td>{request.requesterName}</td>
                                    <td>{request.createdAt.toISOString()}</td>
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