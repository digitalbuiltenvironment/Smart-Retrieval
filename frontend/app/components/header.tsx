"use client";

import Image from 'next/image';
import { Home, InfoIcon, MessageCircle, Search, FileQuestion, Menu, X } from 'lucide-react';
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { useMedia } from 'react-use';
import useSWR from 'swr';
import logo from '@/public/smart-retrieval-logo.webp';
import { HeaderNavLink } from '@/app/components/ui/navlink';
import { MobileMenu } from '@/app/components/ui/mobilemenu';
import { IconSpinner } from '@/app/components/ui/icons'

const MobileMenuItems = [
  {
    href: '/',
    icon: <Home className="mr-2 h-5 w-5" />,
    label: 'Home',
  },
  {
    href: '/about',
    icon: <InfoIcon className="mr-2 h-5 w-5" />,
    label: 'About',
  },
  {
    href: '/chat',
    icon: <MessageCircle className="mr-2 h-5 w-5" />,
    label: 'Chat',
  },
  {
    href: '/query',
    icon: <FileQuestion className="mr-2 h-5 w-5" />,
    label: 'Q&A',
  },
  {
    href: '/search',
    icon: <Search className="mr-2 h-5 w-5" />,
    label: 'Search',
  },
];

export default function Header() {
  const isLargeScreen = useMedia('(min-width: 1024px)', false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  // Use SWR for API status fetching
  const healthcheck_api = process.env.NEXT_PUBLIC_HEALTHCHECK_API;
  const { data, error: apiError, isLoading } = useSWR(healthcheck_api, async (url) => {
    try {
      // Fetch the data
      const response = await fetch(url, {
        signal: AbortSignal.timeout(5000), // Abort the request if it takes longer than 5 seconds
      });
      if (!response.ok) {
        throw new Error(response.statusText || 'Unknown Error');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching Backend API Status');
      throw error;
    }
  }, {
    revalidateOnFocus: true, // Revalidate when the window gains focus
    revalidateIfStale: true, // Revalidate if the data is stale
    refreshInterval: 60000, // Revalidate every 60 seconds
  });
  if (apiError) {
    if (apiError.name === 'AbortError') {
      console.error('[Header] Error fetching Backend API Status: Request timed out');
    }
    else {
      console.error('[Header] Error fetching Backend API Status:', apiError.message);
    }
  }

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
              {isMobileMenuOpen ? (
                <span role="img" aria-label="close icon">
                  <X />
                </span>
              ) : (
                <span role="img" aria-label="menu icon">
                  <Menu />
                </span>)}
            </button>
          </div>
          <div className={`hidden items-center gap-4 lg:flex`}>
            <HeaderNavLink href="/">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <Home className="mr-1 h-4 w-4" />
                Home
              </div>
            </HeaderNavLink>
            <HeaderNavLink href="/about">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <InfoIcon className="mr-1 h-4 w-4" />
                About
              </div>
            </HeaderNavLink>
            <HeaderNavLink href="/chat">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <MessageCircle className="mr-1 h-4 w-4" />
                Chat
              </div>
            </HeaderNavLink>
            <HeaderNavLink href="/query">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <FileQuestion className="mr-1 h-4 w-4" />
                Q&A
              </div>
            </HeaderNavLink>
            <HeaderNavLink href="/search">
              <div className="flex items-center transition duration-300 ease-in-out transform hover:scale-125">
                <Search className="mr-1 h-4 w-4" />
                Search
              </div>
            </HeaderNavLink>
          </div>
          <div className="flex items-center ml-auto">
            {/* Status Page Button/Indicator */}
            <span className='flex items-center mr-1'>API:</span>
            <HeaderNavLink href='/status'>
              <div className="flex items-center mr-2 text-xl transition duration-300 ease-in-out transform hover:scale-125">
                {isLoading ? (
                  <IconSpinner className="mr-2 animate-spin" />
                ) :
                  apiError ? (
                    <span role="img" aria-label="red circle">
                      🔴
                    </span>
                  ) : (
                    <span role="img" aria-label="green circle">
                      🟢
                    </span>
                  )}
              </div>
            </HeaderNavLink>
            <span className="lg:text-lg font-nunito">|</span>
            {/* Toggle button with icon based on the theme */}
            <button
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              className="flex items-center ml-2 text-xl transition duration-300 ease-in-out transform hover:scale-125"
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
        </div >
        {/* Mobile menu component */}
        < MobileMenu isOpen={isMobileMenuOpen} onClose={() => setMobileMenuOpen(false)
        } logoSrc={logo} items={MobileMenuItems} />
      </nav >
    </div >
  );
}
