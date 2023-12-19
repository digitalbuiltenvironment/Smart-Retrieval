"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Home, InfoIcon, MessageCircle, Search } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import logo from '../../public/smart-retrieval-logo.webp'

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
}

const NavLink: React.FC<NavLinkProps> = ({ href, children }) => {
  // Use the useRouter hook to get information about the current route
  const pathname = usePathname();

  // Determine if the current tab is active
  const isActive = pathname === href;

  return (
    <Link href={href} passHref>
      {/* Add a class to highlight the active tab */}
      <div className={`flex items-center font-bold ${isActive ? 'text-blue-500' : ''}`}>
        {children}
      </div>
    </Link>
  );
};

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="z-10 max-w-5xl w-full text-sm">
      {/* Navigation Bar */}
      <nav className="fixed left-0 top-0 w-full bg-gradient-to-b from-zinc-200 pb-2 pt-2 backdrop-blur-2xl dark:border-neutral-700 dark:bg-zinc-700/30 dark:from-inherit lg:static lg:w-auto lg:rounded-xl lg:border lg:bg-gray-100 lg:p-4 lg:dark:bg-zinc-800/30 shadow-xl">
        <div className="flex items-center flex-wrap lg:flex-nowrap px-4">
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
          <div className="flex items-center pr-2 pl-2 gap-2">
            <span className="hidden lg:inline lg:text-lg font-nunito font-bold">Smart Retrieval</span>
            <span className="hidden lg:inline lg:text-lg font-nunito">|</span>
          </div>
          <div className="flex items-center gap-4">
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
