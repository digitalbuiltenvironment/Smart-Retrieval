"use client";

import useSWR from 'swr';
import { NextPage } from 'next';
import { Button } from "@nextui-org/react";
import { IconSpinner } from '@/app/components/ui/icons';
import Header from "@/app/components/header";
import Main from "@/app/components/ui/main-container";

// Define the API endpoint
const healthcheck_api = process.env.NEXT_PUBLIC_HEALTHCHECK_API;

const StatusPage: NextPage = () => {

  // Define a function to clear the cache
  const clearCache = () => mutate(
    () => true,
    undefined,
  )
  // Use SWR hook to fetch data with caching and revalidation
  const { data, error, isValidating, mutate } = useSWR(healthcheck_api, async (url) => {
    try {
      // Fetch the data
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(response.statusText || 'Unknown Error');
      }
      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error('Error fetching Backend API Status:', error.message);
      throw error;
    }
  }, {
    revalidateOnFocus: true, // Revalidate when the window gains focus
    revalidateIfStale: true, // Revalidate if the data is stale
    refreshInterval: 60000, // Revalidate every 60 seconds
  });
  if (error) {
    console.error('[status] Error fetching Backend API Status:', error.message);
  }

  const apiStatus = error ? '❌' : '✅';
  const apiResponse = error ? '❌' : JSON.stringify(data, null, 2);

  const checkApiStatus = async () => {
    try {
      // Invalidate the cache and trigger a revalidation
      mutate();
    } catch (error: any) {
      console.error('Error fetching Backend API Status:', error.message);
    }
  };

  return (
    <Main>
      <Header />
      <div className="rounded-xl shadow-xl p-4 mb-8 max-w-5xl w-full">
        <div className="max-w-2xl space-y-2 p-4">
          <h1 className="text-xl font-bold">Backend API Status</h1>
          <p>
            <span className="font-bold">Status: </span>
            <span>{isValidating ? (
              <IconSpinner className="inline ml-2 animate-spin" />
            ) : apiStatus}</span>
          </p>
          <p><span className="font-bold">Response Data: </span>{isValidating ? (
            <IconSpinner className="inline ml-2 animate-spin" />
          ) : apiResponse}</p>
          <Button
            onClick={checkApiStatus}
            disabled={isValidating}  // Disable the button when isValidating is true
            className="flex text-center items-center text-l disabled:bg-orange-400 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105"
          >
            {isValidating ? (
              <IconSpinner className="mr-2 animate-spin" />
            ) : null}
            Refresh Status
          </Button>
        </div>
      </div>
    </Main>
  );
};

// StatusPage.getInitialProps = async () => {
//   try {
//     // Ensure healthcheck_api is defined before making the fetch request
//     const healthcheck_api = process.env.NEXT_PUBLIC_HEALTHCHECK_API;

//     if (!healthcheck_api) {
//       throw new Error('NEXT_PUBLIC_HEALTHCHECK_API is not defined');
//     }

//     const response = await fetch(healthcheck_api);

//     if (!response.ok) {
//       throw new Error(response.statusText || 'Unknown Error');
//     }

//     const data = await response.json();
//     return { initialStatus: data.status };
//   } catch (error: any) {
//     console.error('Error fetching Backend API Status:', error.message);
//     throw error;
//   }
// };


export default StatusPage;
