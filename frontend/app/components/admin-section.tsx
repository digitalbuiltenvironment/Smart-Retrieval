// admin-section.tsx
"use client";

import { useState } from "react";
import { AdminMenu, AdminNewCollectionsRequests, AdminManageUsers } from "@/app/components/ui/admin";

const AdminSection: React.FC = () => {
  const [showNewRequest, setShowNewRequest] = useState<boolean>(true);
  const [showUsers, setShowUsers] = useState<boolean>(false);

  return (
    <div className="max-w-5xl w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit shadow-xl space-y-4 px-4 pb-4 pt-4">
      {/* Menu Section */}
      <AdminMenu
        showUsers={showUsers}
        setShowUsers={setShowUsers}
        showNewRequest={showNewRequest}
        setShowNewRequest={setShowNewRequest}
      />

      {/* New Requests Section */}
      {showNewRequest ? (
        <AdminNewCollectionsRequests />
      ) : null}

      {/* Users Section */}
      {showUsers ? (
        <AdminManageUsers />
      ) : null}
    </div>
  );
};

export default AdminSection;
