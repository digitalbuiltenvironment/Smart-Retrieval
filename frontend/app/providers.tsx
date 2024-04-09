"use client";

import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
    return (
        <NextUIProvider>
            <NextThemesProvider attribute="class" defaultTheme="system" enableSystem={true}>
                <SessionProvider>
                    {children}
                </SessionProvider>
            </NextThemesProvider>
        </NextUIProvider>
    )
}