"use client";

import React, { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import Image from 'next/image';

const ProfilePage: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [imageURL, setImageURL] = useState('');
    const [isLoaded, setIsLoaded] = useState(false);

    const toggleIsLoaded = () => {
        setIsLoaded(!isLoaded);
    }

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
    };

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(event.target.value);
    };

    const handleImageURLChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        setImageURL(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        // TODO: Handle form submission logic
    };

    // Prefill the form with the user's profile data
    useEffect(() => {   
        // Fetch the user's profile data
        fetch('/api/profile')
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to fetch profile data');
                }
                return response.json();
            })
            .then((data) => {
                console.log('Profile data:', data);
                setName(data.userData.name);
                setEmail(data.userData.email);
                setImageURL(data.userData.image);
            })
            .catch((error) => {
                console.error('Error fetching profile data:', error);
            })
            .finally(() => {
                // Set loading state to false after the fetch request completes (whether successfully or with an error)
                toggleIsLoaded();
            });
    }, []);

    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full bg-white dark:bg-zinc-700/30">
            <div className="max-w-2xl space-y-2 p-4 flex">
                <div className="flex flex-col w-full justify-center mr-8 gap-4">
                    <h1>Profile Settings</h1>
                    <Skeleton isLoaded={isLoaded} className='rounded-full w-20'>
                        <Image className="rounded-full" src={imageURL} alt={name} width={84} height={84} />
                    </Skeleton>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
                        <label className="flex flex-col">
                            <span className='mb-2'>Name:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <input className='h-8 rounded-lg w-full bg-gray-400 dark:bg-zinc-700/30 border' type="text" value={name} onChange={handleNameChange} />
                            </Skeleton>
                        </label>
                        <label className="flex flex-col">
                            <span className='mb-2'>Email:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <input className='h-8 rounded-lg w-full bg-gray-400 dark:bg-zinc-700/30 border' type="email" value={email} onChange={handleEmailChange} />
                            </Skeleton>
                        </label>
                        <label className="flex flex-col">
                            <span className='mb-2'>Image URL:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <textarea className='rounded-lg w-full bg-gray-400 dark:bg-zinc-700/30 border' value={imageURL} onChange={handleImageURLChange} />
                            </Skeleton>
                        </label>
                        <button type="submit" className="text-center items-center text-l disabled:bg-orange-400 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
