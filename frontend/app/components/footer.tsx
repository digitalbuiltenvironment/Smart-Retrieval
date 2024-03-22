"use client";

import { FooterNavLink } from "@/app/components/ui/navlink";
import { IconGitHub } from "@/app/components/ui/icons";
import { Text, Cookie } from "lucide-react";

export default function Footer() {
    return (
        <footer>
            <div className="flex flex-col items-center justify-center bg-gray-800 text-white p-4 mb-4 rounded-lg shadow-xl">
                <div className="flex flex-col items-center">
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

