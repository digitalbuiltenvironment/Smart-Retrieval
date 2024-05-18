"use client";

import { useState, useEffect } from 'react';
import { Skeleton } from "@nextui-org/react";
import Image from 'next/image';
import { User2, SlidersHorizontal, Info, Trash, RefreshCcw } from 'lucide-react';
import { HeaderNavLink } from '@/app/components/ui/navlink';
import Swal from 'sweetalert2';

const ProfileSection: React.FC = () => {
  const [userId, setUserId] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [initialProfileData, setInitialProfileData] = useState({ name: '', email: '', imageURL: '' });

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

    if (!isProfileChanged()) {
      console.log('No changes detected, not submitting the form');
      return;
    }

    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to update your profile data? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#b91c1c',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Update the profile data in the database
        if (await updateProfileData()) {
          // Show a success message after updating the profile data
          Swal.fire({
            title: 'Profile Updated!',
            text: 'Your profile data has been updated successfully.',
            icon: 'success',
            confirmButtonColor: '#4caf50',
          });
        } else {
          // Show an error message if the profile data update failed
          Swal.fire({
            title: 'Error!',
            text: 'Failed to update your profile data. Please try again later. (Check Console for more details)',
            icon: 'error',
            confirmButtonColor: '#4caf50',
          });
        }
      }
    });
  };

  const handleDeleteProfile = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete your profile & data? This action cannot be undone, and your data will be deleted forever!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4caf50',
      cancelButtonColor: '#b91c1c',
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        // Delete the profile data from the database
        if (await deleteProfileData()) {
          // Show a success message after deleting the profile data
          Swal.fire({
            title: 'Profile Deleted!',
            text: 'Your profile data has been deleted successfully. You will be redirected to the home page.',
            icon: 'success',
            confirmButtonColor: '#4caf50',
          });
          // Redirect to the home page after deleting the profile data
          window.location.href = '/';
        } else {
          // Show an error message if the profile data deletion failed
          Swal.fire({
            title: 'Error!',
            text: 'Failed to delete your profile data. Please try again later. (Check Console for more details)',
            icon: 'error',
            confirmButtonColor: '#4caf50',
          });
        }
      }
    });
  };

  const handleResetProfile = () => {
    setName(initialProfileData.name);
    setEmail(initialProfileData.email);
    setImageURL(initialProfileData.imageURL);
  }

  const checkAdminRole = async () => {
    const response = await fetch('/api/admin/is-admin');
    if (!response.ok) {
      console.error('Failed to fetch admin data');
      return;
    }
    const data = await response.json();
    setIsAdmin(data.isAdmin);
    console.log('Admin role fetched successfully! Data:', data);
  };

  // Update the profile data in the database, via PUT request
  const updateProfileData = async () => {
    const response = await fetch('/api/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
        name: name,
        email: email,
        image: imageURL,
      }),
    });
    if (!response.ok) {
      console.error('Failed to update profile data:', response.statusText);
      return false;
    }
    console.log('Profile data updated successfully!');
    // Update initial profile data to the new data
    setInitialProfileData({ name, email, imageURL });
    return true;
  };

  // Fetch the profile data from the database, via GET request
  const fetchProfileData = async () => {
    const response = await fetch('/api/profile');
    if (!response.ok) {
      console.error('Failed to fetch profile data');
      return;
    }
    const data = await response.json();
    const userData = data.userData;
    setUserId(userData.id);
    setName(userData.name);
    setEmail(userData.email);
    setImageURL(userData.image);
    setInitialProfileData({ name: userData.name, email: userData.email, imageURL: userData.image });
    setIsLoaded(true);
    console.log('Profile data fetched successfully! Data:', userData);
  };

  // Delete the profile data from the database, via DELETE request
  const deleteProfileData = async () => {
    const response = await fetch('/api/profile', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId: userId,
      }),
    });
    if (!response.ok) {
      console.error('Failed to delete profile data:', response.text);
      return false;
    }
    console.log('Profile data deleted successfully!');
    Swal.fire({
      title: 'Profile Deleted!',
      text: 'Your profile data has been deleted successfully.',
      icon: 'success',
      confirmButtonColor: '#4caf50',
    });
    return true;
  };

  useEffect(() => {
    fetchProfileData();
    checkAdminRole();
  }, []);

  const isProfileChanged = () => {
    return (
      name !== initialProfileData.name ||
      email !== initialProfileData.email ||
      imageURL !== initialProfileData.imageURL
    );
  };

  return (
    <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full bg-white dark:bg-zinc-700/30">
      <div className="space-y-2 p-4">
        <div className="flex flex-col w-full justify-center gap-4">
          <div className="flex justify-between items-center">
            <div className='flex flex-col'>
              <h1 className='flex font-bold text-2xl mb-4'>Profile</h1>
              <Skeleton isLoaded={isLoaded} className='rounded-full w-20'>
                {imageURL ? <Image className="rounded-full" src={imageURL} alt={name} width={84} height={84} priority={true} /> : <User2 size={84} />}
              </Skeleton>
            </div>
            <div className="flex flex-col gap-4 justify-between">
              {isAdmin ? (
                <HeaderNavLink href="/admin" title='Admin Page'>
                  <button className="flex flex-grow justify-center items-center bg-blue-500 text-white rounded-md px-5 py-3 transition duration-300 ease-in-out transform hover:scale-105">
                    <SlidersHorizontal className="mr-1 h-5 w-5" />
                    Admin Page
                  </button>
                </HeaderNavLink>
              ) : null}
              <button
                className="flex flex-grow justify-center items-center font-bold bg-red-500 text-white rounded-md px-5 py-3 transition duration-300 ease-in-out transform hover:scale-105"
                onClick={handleDeleteProfile}
              >
                <Trash className="mr-1 h-5 w-5" />
                Delete Account & Data
              </button>
            </div>
          </div>
          <form onSubmit={handleSubmit} className='flex flex-col gap-4 max-w-2xl'>
            <label className="flex flex-col">
              <span className='mb-2'>Name:</span>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <input className='h-10 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' type="text" value={name} onChange={handleNameChange} />
              </Skeleton>
            </label>
            <label className="flex flex-col">
              <span className='mb-2'>Email:</span>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <input className='h-10 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' type="email" value={email} onChange={handleEmailChange} />
              </Skeleton>
            </label>
            <label className="flex flex-col">
              <span className='mb-2'>Image URL:</span>
              <Skeleton isLoaded={isLoaded} className="rounded-lg">
                <textarea className='h-14 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2' value={imageURL} onChange={handleImageURLChange} />
              </Skeleton>
              <span className='flex items-center text-sm text-gray-500 dark:text-gray-400'>
                <Info className='h-4 w-4 mr-1' />
                GoogleUserContent, Imgur, Gravatar URLs allowed.
              </span>
            </label>
            <div className="flex justify-evenly gap-4">
              <button type="button" onClick={handleResetProfile} className="flex flex-grow justify-center items-center bg-red-500 font-bold text-white rounded-md px-5 py-3 transition duration-300 ease-in-out transform hover:scale-105">
                <RefreshCcw className="mr-1 h-5 w-5" />
                Reset
              </button>
              <button type="submit" disabled={!isProfileChanged()} className="flex flex-grow justify-center items-center text-l disabled:bg-transparent disabled:border disabled:border-gray-500 disabled:text-gray-500 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100">Save</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSection;
