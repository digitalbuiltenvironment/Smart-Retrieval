"use client";

import { useEffect, useRef } from 'react';
import Image, { StaticImageData } from 'next/image';
import { HeaderNavLink } from '@/app/components/ui/navlink';
import { useMedia } from 'react-use';

interface MenuItem {
    href: string;
    icon: React.ReactNode;
    label: string;
}

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
    logoSrc: StaticImageData;
    items: MenuItem[];
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, logoSrc, items }) => {
    const isLargeScreen = useMedia('(min-width: 1024px)', false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (
                !isLargeScreen &&
                isOpen &&
                !menuRef.current?.contains(event.target as Node) &&
                !((event.target as HTMLElement).closest('.toggle-button')) // Exclude the toggle button
            ) {
                onClose(); // Close the menu
            }
        };

        if (!isLargeScreen && isOpen) {
            // Add event listeners for both mouse and touch events
            document.addEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            // Remove the event listener when the component unmounts
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [isLargeScreen, isOpen, onClose]);

    useEffect(() => {
        if (isLargeScreen && isOpen) {
            onClose();
        }
    }, [isLargeScreen, isOpen, onClose]);

    return (
        <div ref={menuRef} className={`w-full h-full p-2 bg-opacity-80 transition-transform duration-300 ${isOpen ? 'flex' : 'hidden'}`}>
            <div className="flex items-center justify-center mt-2" style={{ width: '9%', height: '9%' }}>
                <Image
                    className='rounded-full max-w-full'
                    src={logoSrc}
                    alt="Logo"
                    style={{
                        width: 'auto',
                        height: 'auto',
                    }}
                    priority
                    sizes="100vw, 50vw, 33vw"
                />
            </div>
            <div className="flex items-center justify-center h-full">
                {/* Mobile menu content */}
                <div className="w-64 p-4 rounded-r-md">
                    {items.map((item, index) => (
                        <HeaderNavLink key={index} href={item.href} onClick={onClose}>
                            <div className="flex items-center mb-4">
                                {item.icon}
                                {item.label}
                            </div>
                        </HeaderNavLink>
                    ))}
                </div>
            </div>
        </div>
    );
};

export { MobileMenu };
