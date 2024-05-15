"use client";

import { ListChecks, Users2 } from 'lucide-react';
import { AdminMenuHandler } from '@/app/components/ui/admin/admin.interface';

export default function Admin(
    props: Pick<AdminMenuHandler, "showUsers" | "setShowUsers" | "showNewRequest" | "setShowNewRequest">,
) {
    const handleShowRequestsTab = () => {
        props.setShowNewRequest(true);
        props.setShowUsers(false);
    }
    const handleShowUsersTab = () => {
        props.setShowUsers(true);
        props.setShowNewRequest(false);
    }

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl">
            <div className="flex rounded-lg px-4 py-2 text-center items-center overflow-y-auto">
                <button
                    className={`flex text-center items-center text-l ${props.showNewRequest ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowRequestsTab()}
                    title='Chat'
                >
                    <ListChecks className="mr-1 h-5 w-5" />
                    New Requests
                </button>
                <button
                    className={`flex text-center items-center text-l ${props.showUsers ? 'text-blue-500' : ''} bg-transparent px-4 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105`}
                    onClick={() => handleShowUsersTab()}
                    title='Upload'
                >
                    <Users2 className="mr-1 h-5 w-5" />
                    Users
                </button>
            </div>
        </div>
    );
}