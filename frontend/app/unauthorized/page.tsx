"use client";

import { AlertTriangle } from "lucide-react";

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
            <div className="max-w-4xl mx-auto p-4">
                <AlertTriangle className="h-16 w-16 mx-auto text-red-500" />
                <h1 className="text-3xl font-bold text-red-500 text-center">Unauthorized!</h1>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
