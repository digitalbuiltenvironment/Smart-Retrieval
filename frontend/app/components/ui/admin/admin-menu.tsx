"use client";

import { ListChecks, Users2, LibrarySquare } from 'lucide-react';
import { AdminMenuHandler } from '@/app/components/ui/admin/admin.interface';

export default function Admin(
    props: Pick<AdminMenuHandler, "showUsers" | "setShowUsers" | "showNewRequest" | "setShowNewRequest" | "showCollections" | "setShowCollections">,
) {
    const handleShowRequestsTab = () => {
        props.setShowNewRequest(true);
        props.setShowUsers(false);
        props.setShowCollections(false);
    }
    const handleShowUsersTab = () => {
        props.setShowUsers(true);
        props.setShowNewRequest(false);
        props.setShowCollections(false);
    }

    const handleShowCollectionsTab = () => {
        props.setShowCollections(true);
        props.setShowNewRequest(false);
        props.setShowUsers(false);
    }

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl">
            <div className="flex rounded-lg px-4 py-2 text-center items-center overflow-y-auto">
                <button
                    className={`flex text-center items-center text-l ${props.showNewRequest ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowRequestsTab()}
                    title='New Requests'
                >
                    <ListChecks className="mr-1 h-5 w-5" />
                    New Requests
                </button>
                <button
                    className={`flex text-center items-center text-l ${props.showCollections ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowCollectionsTab()}
                    title='Collections'
                >
                    <LibrarySquare className="mr-1 h-5 w-5" />
                    Collections
                </button>
                <button
                    className={`flex text-center items-center text-l ${props.showUsers ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowUsersTab()}
                    title='Users'
                >
                    <Users2 className="mr-1 h-5 w-5" />
                    Users
                </button>
            </div>
        </div>
    );
}