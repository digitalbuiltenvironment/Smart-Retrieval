"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { IconSpinner } from '@/app/components/ui/icons';
import logo from '../public/smart-retrieval-logo.webp';

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
      <div className="max-w-2xl mx-auto p-4 text-center">
        <div className="flex flex-col items-center mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
          <div className="flex flex-col md:flex-row items-center md:items-start">
            <Image
              src={logo}
              alt="Smart Retrieval Logo"
              width={150}
              height={150}
              priority
              className="rounded-lg mb-4 md:mb-0 md:mr-4"
            />
            <div className='flex flex-col mt-4'>
              <h1 className="text-4xl font-bold mb-2 md:text-5xl">Smart Retrieval</h1>
              <p className="text-lg md:text-xl text-gray-200">
                Your intelligent solution for quick and accurate information retrieval.
              </p>
            </div>
          </div>
        </div>
        <div className="flex flex-col mt-8 text-center items-center max-w-full">
          <p id='get-started-paragraph' className="text-xl text-gray-700 dark:text-gray-200 mb-4">
            Experience the power of Smart Retrieval today!
          </p>
          <Link href="/chat" onClick={() => { setIsLoading(true); }}>
            <div className="flex text-center items-center text-xl bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-125">
              {isLoading ? (
                <IconSpinner className="mr-2 animate-spin" />
              ) : null}
              Get Started
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
