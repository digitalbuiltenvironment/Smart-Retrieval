"use client";

import { useState } from "react";
import { FooterNavLink } from "@/app/components/ui/navlink";
import { IconGitHub } from "@/app/components/ui/icons";
import { Text, Cookie, AlertCircle } from "lucide-react";

export default function Footer() {
    const [showDisclaimer, setShowDisclaimer] = useState(false);

    const toggleDisclaimer = () => {
        setShowDisclaimer(!showDisclaimer);
    };

    return (
        <footer className="z-10">
            <div className="flex flex-col items-center justify-center bg-gray-800 text-white p-4 mb-4 rounded-lg shadow-xl">
                <div className="flex flex-col items-center text-red-500">
                    <button className="text-sm text-center underline" onClick={toggleDisclaimer} title="Disclaimer">
                        <AlertCircle className="h-5 w-5 inline mr-2 mb-1" />
                        Disclaimer
                    </button>
                    {showDisclaimer && (
                        <p className="text-sm text-center w-64 mb-2">
                            The answer provided by Smart Retrieval may not be accurate and might be prone to hallucination. Users are advised to fact check the answer and not use it as is. Smart Retrieval is not responsible for any consequences arising from the use of the answer.
                        </p>
                    )}
                </div>
                <div className="flex flex-col items-center mt-2 gap-4">
                    <p className="text-sm text-center">
                        © 2024 JTC DBE. All rights reserved.
                    </p>
                </div>
                <div className="flex items-center mt-2 gap-4">
                    <FooterNavLink href="https://github.com/digitalbuiltenvironment/Smart-Retrieval/" title="Github" target="_blank">
                        <div className="text-sm text-center underline">
                            <IconGitHub className="h-5 w-5 inline mr-2 mb-1" />
                            Github
                        </div>
                    </FooterNavLink>
                    <FooterNavLink href="/terms-of-service" title="Terms Of Service">
                        <div className="text-sm text-center underline">
                            <Text className="h-5 w-5 inline mr-2 mb-1" />
                            Terms of Service
                        </div>
                    </FooterNavLink>
                    <FooterNavLink href="/privacy-policy" title="Privacy Policy">
                        <div className="text-sm text-center underline">
                            <Cookie className="h-5 w-5 inline mr-2 mb-1" />
                            Privacy Policy
                        </div>
                    </FooterNavLink>
                </div>
            </div>
        </footer>
    );
}
