"use client";

import { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import Image from 'next/image';
import { User2, SlidersHorizontal } from 'lucide-react';
import { HeaderNavLink } from '@/app/components/ui/navlink';

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

    const fetchProfileData = async () => {
        try {
            const response = await fetch('/api/profile');
            if (!response.ok) {
                throw new Error('Failed to fetch profile data');
            }
            const data = await response.json();
            console.log('Profile data:', data);
            setName(data.userData.name);
            setEmail(data.userData.email);
            setImageURL(data.userData.image);
        } catch (error) {
            console.error('Error fetching profile data:', error);
        } finally {
            toggleIsLoaded();
        }
    };

    const updateProfileData = async () => {
        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    email,
                    image: imageURL,
                }),
            });
            if (!response.ok) {
                throw new Error('Failed to update profile data');
            }
            console.log('Profile data updated successfully!');
        } catch (error) {
            console.error('Error updating profile data:', error);
        }
    };

    // TODO: Implement check for admin role

    // On component mount, fetch the user's profile data
    useEffect(() => {
        // Fetch the user's profile data
        fetchProfileData();
    }, []);

    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full bg-white dark:bg-zinc-700/30">
            <div className="space-y-2 p-4">
                <div className="flex flex-col w-full justify-center gap-4">
                    <div className="flex justify-between items-center">
                        <h1 className='font-bold text-lg'>Profile</h1>
                        <HeaderNavLink href="/admin" title='Sign In'>
                            <button className="flex items-center bg-blue-500 text-white rounded-md px-5 py-3 transition duration-300 ease-in-out transform hover:scale-105">
                                <SlidersHorizontal className="mr-1 h-5 w-5" />
                                Admin Page
                            </button>
                        </HeaderNavLink>
                    </div>
                    <Skeleton isLoaded={isLoaded} className='rounded-full w-20'>
                        {/* use default user image if there is no imageURL */}
                        {imageURL ? <Image className="rounded-full" src={imageURL} alt={name} width={84} height={84} /> : <User2 size={84} />}
                    </Skeleton>
                    <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-2xl'>
                        <label className="flex flex-col">
                            <span className='mb-2'>Name:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <input disabled className='h-10 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' type="text" value={name} onChange={handleNameChange} />
                            </Skeleton>
                        </label>
                        <label className="flex flex-col">
                            <span className='mb-2'>Email:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <input disabled className='h-10 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' type="email" value={email} onChange={handleEmailChange} />
                            </Skeleton>
                        </label>
                        <label className="flex flex-col">
                            <span className='mb-2'>Image URL:</span>
                            <Skeleton isLoaded={isLoaded} className="rounded-lg">
                                <textarea disabled className='h-14 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' value={imageURL} onChange={handleImageURLChange} />
                            </Skeleton>
                        </label>
                        <button type="submit" disabled className="text-center items-center text-l disabled:bg-orange-400 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100">Save</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
