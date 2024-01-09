"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, InfoIcon, MessageCircle, Search, FileQuestion, Menu } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { useEffect, useState, useRef } from "react";
import { useMedia } from 'react-use';
import logo from '../../public/smart-retrieval-logo.webp'

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  onClick?: () => void; // Include onClick as an optional prop
}

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const isLargeScreen = useMedia('(min-width: 1024px)');
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
    <div ref={menuRef} className={`w-full h-full p-2 bg-opacity-80 ${isOpen ? 'flex' : 'hidden'}`}>
      <div className="flex items-center justify-center mt-2" style={{ width: '9%', height: '9%' }}>
        <Image
          className='rounded-full max-w-full'
          src={logo}
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
          <NavLink href="/" onClick={onClose}>
            <div className="flex items-center mb-4">
              <Home className="mr-2 h-5 w-5" />
              Home
            </div>
          </NavLink>
          <NavLink href="/about" onClick={onClose}>
            <div className="flex items-center mb-4">
              <InfoIcon className="mr-2 h-5 w-5" />
              About
            </div>
          </NavLink>
          <NavLink href="/chat" onClick={onClose}>
            <div className="flex items-center mb-4">
              <MessageCircle className="mr-2 h-5 w-5" />
              Chat
            </div>
          </NavLink>
          <NavLink href="/query" onClick={onClose}>
            <div className="flex items-center mb-4">
              <FileQuestion className="mr-2 h-5 w-5" />
              Query
            </div>
          </NavLink>
          <NavLink href="/search" onClick={onClose}>
            <div className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Search
            </div>
          </NavLink>
        </div>
      </div>
    </div>
  );
};

const NavLink: React.FC<NavLinkProps> = ({ href, children, onClick }) => {
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

export default function Header() {
  const isLargeScreen = useMedia('(min-width: 1024px)');
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    // Handle the toggle click here
    if (isMobileMenuOpen) {
      // If the menu is open, close it
      setMobileMenuOpen(false);
    } else {
      // If the menu is closed, open it
      setMobileMenuOpen(true);
    }
  };

  if (!mounted) return null;

  return (
    <div className="z-10 max-w-5xl w-full text-sm">
      {/* Navigation Bar */}
      <nav className="fixed left-0 top-0 w-full bg-gradient-to-b from-zinc-200 pb-2 pt-2 backdrop-blur-2xl dark:border-neutral-700 dark:bg-zinc-700/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-800/30 shadow-xl">
        <div className="flex items-center flex-wrap lg:flex-nowrap px-4">
          {isLargeScreen && (
            <div className="flex items-center" style={{ width: '6%', height: 'auto' }}>
              <Image
                className='rounded-full max-w-full'
                src={logo}
                alt="Logo"
                style={{
                  width: 'auto',
                  height: 'auto',
                }}
                priority
                sizes="100vw, 50vw, 33vw"
              />
            </div>
          )}
          <div className="flex items-center pr-2 pl-2 gap-2">
            <span className="hidden lg:inline lg:text-lg font-nunito font-bold">Smart Retrieval</span>
            <span className="hidden lg:inline lg:text-lg font-nunito">|</span>
          </div>
          <div className="flex items-center gap-4 lg:hidden">
            {/* Toggle button for mobile menu */}
            <button
              className="flex items-center text-xl transition duration-300 ease-in-out transform hover:scale-125 toggle-button"
              title="Toggle mobile menu"
              onClick={toggleMobileMenu}
            >
              <span role="img" aria-label="menu icon">
                <Menu />
              </span>
            </button>
          </div>
          {/* Mobile menu component */}
          <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />
          <div className={`hidden items-center gap-4 lg:flex`}>
            <NavLink href="/">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <Home className="mr-1 h-4 w-4" />
                Home
              </div>
            </NavLink>
            <NavLink href="/about">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <InfoIcon className="mr-1 h-4 w-4" />
                About
              </div>
            </NavLink>
            <NavLink href="/chat">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <MessageCircle className="mr-1 h-4 w-4" />
                Chat
              </div>
            </NavLink>
            <NavLink href="/query">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <FileQuestion className="mr-1 h-4 w-4" />
                Query
              </div>
            </NavLink>
            <NavLink href="/search">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <Search className="mr-1 h-4 w-4" />
                Search
              </div>
            </NavLink>
          </div>
          <div className="flex items-center ml-auto">
            {/* Toggle button with icon based on the theme */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center text-xl transition duration-300 ease-in-out transform hover:scale-125"
              title={`Toggle between dark & light mode (Current mode: ${theme})`}>
              {theme === 'light' ? (
                <span role="img" aria-label="sun emoji">
                  ☀️
                </span>
              ) : (
                <span role="img" aria-label="moon emoji">
                  🌙
                </span>
              )}
            </button>
          </div>
        </div>
      </nav>
    </div>
  );
}
