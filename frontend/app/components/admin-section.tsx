// admin-section.tsx
"use client";

import { useState } from "react";
import { AdminMenu, AdminCollectionsRequests, AdminManageCollections, AdminManageUsers } from "@/app/components/ui/admin";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminSection: React.FC = () => {
  const [showNewRequest, setShowNewRequest] = useState<boolean>(true);
  const [showUsers, setShowUsers] = useState<boolean>(false);
  const [showCollections, setShowCollections] = useState<boolean>(false);

  return (
    <div className="max-w-5xl w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl space-y-4 px-4 pb-4 pt-4">
      {/* Toast Container */}
      <ToastContainer />

      {/* Menu Section */}
      <AdminMenu
        showUsers={showUsers}
        setShowUsers={setShowUsers}
        showNewRequest={showNewRequest}
        setShowNewRequest={setShowNewRequest}
        showCollections={showCollections}
        setShowCollections={setShowCollections}
      />

      {/* New Requests Section */}
      {showNewRequest ? (
        <AdminCollectionsRequests />
      ) : null}

      {/* Public Collections Section */}
      {showCollections ? (
        <AdminManageCollections />
      ) : null}

      {/* Users Section */}
      {showUsers ? (
        <AdminManageUsers />
      ) : null}
    </div>
  );
};

export default AdminSection;
