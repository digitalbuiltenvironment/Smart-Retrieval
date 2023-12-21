// main-container.tsx

import React, { ReactNode } from "react";
import { cn } from "@/app/components/ui/lib/utils";

interface ContainerProps {
    children: ReactNode;
}

const Main: React.FC<ContainerProps> = ({ children }) => {
    return (
        <main className={cn("flex min-h-screen flex-col items-center gap-10 background-gradient dark:background-gradient-dark pt-10 px-4")}>
            {children}
        </main>
    );
};

export default Main;
