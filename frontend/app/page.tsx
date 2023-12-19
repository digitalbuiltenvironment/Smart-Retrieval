"use client";

import Header from "@/app/components/header";
import Image from 'next/image';
import Link from 'next/link';
import * as React from 'react'
import { IconSpinner } from '@/app/components/ui/icons'

export default function Home() {
  const [isLoading, setIsLoading] = React.useState(false);

  return (
    <main id='main-container' className="flex min-h-screen flex-col items-center gap-10 background-gradient dark:background-gradient-dark md:pt-10 pt-24 px-10">
      <Header />
      <div className="rounded-xl shadow-xl p-4 mb-8 z-10 max-w-5xl w-full">
        <div className="max-w-2xl mx-auto p-4 text-center">
          <div className="flex flex-col items-center mb-4 bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
            <div className="flex flex-col md:flex-row items-center md:items-start">
              <Image
                src="/smart-retrieval-logo.webp"
                alt="Smart Retrieval Logo"
                width={150}
                height={150}
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
              <div className="flex text-center items-center text-xl bg-blue-500 text-white px-6 py-3 rounded-full font-bold transition duration-300 ease-in-out transform hover:scale-125">
                {isLoading ? (
                  <IconSpinner className="mr-2 animate-spin" />
                ) : null}
                Get Started
              </div>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
