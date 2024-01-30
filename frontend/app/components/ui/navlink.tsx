"use client";

import { usePathname } from 'next/navigation';
import Link from 'next/link';

export interface NavLinkProps {
    href: string;
    children: React.ReactNode;
    onClick?: () => void; // Include onClick as an optional prop
    target?: string;
}

const HeaderNavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
    // Use the useRouter hook to get information about the current route
    const pathname = usePathname();

    // Determine if the current tab is active
    const isActive = pathname === href;

    const handleClick = () => {
        if (onClick) {
            onClick(); // Call the onClick handler if provided
        }
    };

    return (
        <Link href={href} passHref>
            {/* Add a class to highlight the active tab */}
            <div className={`flex items-center font-bold ${isActive ? 'text-blue-500' : ''}`} onClick={handleClick}>
                {children}
            </div>
        </Link>
    );
};

const FooterNavLink: React.FC<NavLinkProps> = ({ href, children, onClick, target }) => {
    const handleClick = () => {
        if (onClick) {
            onClick(); // Call the onClick handler if provided
        }
    };

    return (
        <Link href={href} passHref target={target}>
            {/* Add a class to highlight the active tab */}
            <div className="flex items-center font-bold" onClick={handleClick}>
                {children}
            </div>
        </Link>
    );
}

export { HeaderNavLink, FooterNavLink }
