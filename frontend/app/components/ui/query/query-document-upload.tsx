"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { AlertTriangle } from "lucide-react";
import { IconSpinner } from '@/app/components/ui/icons';
import { useSession } from "next-auth/react";

export default function QueryDocumentUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [displayNameError, setDisplayNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [fileError, setFileError] = useState(false);
    const [fileErrorMsg, setFileErrorMsg] = useState('');
    const [isLoading, setisLoading] = useState(false);
    const indexerApi = process.env.NEXT_PUBLIC_INDEXER_API;
    const { data: session } = useSession();
    const supabaseAccessToken = session?.supabaseAccessToken;
    // NOTE: allowedTypes is an array of allowed MIME types for file uploads
    // The allowedTypesString is a string of allowed file extensions for the file input
    // Both must be kept in sync to ensure that the file input only accepts the allowed file types
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'text/plain', 'application/json'];
    const allowedTypesString = ".pdf,.doc,.docx,.xls,xlsx,.txt,.json";

    const MAX_FILES = 15; // Maximum number of files allowed
    const MAX_TOTAL_SIZE_MB = 60; // Maximum total size allowed in MB (15 MB)
    const MAX_TOTAL_SIZE = MAX_TOTAL_SIZE_MB * 1024 * 1024; // Maximum total size allowed in bytes (15 MB in bytes)
    // The total size of all selected files should not exceed this value

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFileError(false);
        const selectedFiles = event.target.files;
        if (selectedFiles) {
            const fileList = Array.from(selectedFiles);

            // Check if the total number of files exceeds the maximum allowed
            if (fileList.length > MAX_FILES) {
                // Show toast notification
                toast.error(`You can only upload a maximum of ${MAX_FILES} files.`, {
                    position: "top-right",
                    autoClose: 5000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                });
                setFileError(true);
                setFileErrorMsg(`You can only upload a maximum of ${MAX_FILES} files.`);
                return;
            }

            // Calculate the total size of selected files
            const totalSize = fileList.reduce((acc, file) => acc + file.size, 0);

            // Check if the total size exceeds the maximum allowed
            if (totalSize > MAX_TOTAL_SIZE) {
                // Show toast notification
                toast.error(`Total size of selected files exceeds the maximum allowed (${MAX_TOTAL_SIZE_MB} MB).`, {
                    position: "top-right",
                });
                setFileError(true);
                setFileErrorMsg(`Total size of selected files exceeds the maximum allowed (${MAX_TOTAL_SIZE_MB} MB).`);
                return;
            }

            // Check if the file types are allowed
            const invalidFiles = fileList.filter(file => !allowedTypes.includes(file.type));
            if (invalidFiles.length) {
                // Show toast notification
                toast.error(`Invalid file type(s) selected!`, {
                    position: "top-right",
                });
                setFileError(true);
                setFileErrorMsg(`Only ${allowedTypesString} file type(s) allowed!`);
                return;
            }

            // Update the state with the selected files
            setFiles(fileList);
        }
    };

    const handleDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDescription(event.target.value);
        setDescriptionError(false);
    };

    const handleDisplayNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayName(event.target.value);
        setDisplayNameError(false);
    };

    const handleSubmit = (event: React.FormEvent) => {
        let createdCollectionId = '';
        event.preventDefault();
        // Perform validation and submit logic here
        console.log("Display Name:", displayName);
        console.log("Description:", description);
        console.log("Files:", files);
        // Ensure that the required fields are not empty
        if (!displayName.trim()) {
            setDisplayNameError(true);
            console.log("Display Name is required!");
        }
        if (!description.trim()) {
            setDescriptionError(true);
            console.log("Description is required!");
        }
        if (!files.length) {
            setFileError(true);
            setFileErrorMsg("Please select a file to upload!");
            console.log("Please select a file to upload!");
        }
        if (!displayName.trim() || !description.trim() || !files.length) {
            // Show toast notification
            toast.error("Please fill in all required fields!", {
                position: "top-right",
                closeOnClick: true,
            });
        }
        else {
            setisLoading(true);
            // Show confirmation dialog
            Swal.fire({
                title: 'Are you sure?',
                text: "You are about to upload and index your documents. Ensure that there are no sensitive/secret documents! Do you want to proceed?",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#4caf50',
                cancelButtonColor: '#b91c1c',
                confirmButtonText: 'Yes',
                cancelButtonText: 'No',
            }).then((result) => {
                if (result.isConfirmed) {
                    // Perform the upload and indexing logic
                    console.log("Uploading and indexing documents...");
                    // Make a POST request to the API with the form data to save to the database
                    fetch('/api/user/collections', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            display_name: displayName,
                            description: description,
                        }),
                    })
                        .then(async response => {
                            if (response.ok) {
                                // Get the response data
                                const data = await response.json();
                                console.log('Insert New Collection Results:', data);
                                createdCollectionId = await data.collectionId; // ensure that the collection_id is returned
                                console.log('Created Collection ID:', createdCollectionId);
                                // Show success dialog
                                Swal.fire({
                                    title: 'Success!',
                                    text: 'Documents uploaded successfully! The documents will be indexed shortly. Do not leave this page until the indexing is completed!',
                                    icon: 'success',
                                    confirmButtonColor: '#4caf50',
                                });
                                // Show toast loading notification
                                const toastId = toast.loading('Uploading and Indexing Documents...');
                                // Create a new FormData object
                                const formData = new FormData();
                                // Append the collection_id to the FormData object
                                formData.append('collection_id', createdCollectionId);
                                // Append each file to the FormData object
                                files.forEach((file, index) => {
                                    formData.append('files', file);
                                });
                                // Make a POST request to the Backend Indexer API with the files data to upload and index
                                fetch(`${indexerApi}`, {
                                    method: 'POST',
                                    headers: {
                                        // Add the access token to the request headers
                                        'Authorization': `Bearer ${supabaseAccessToken}`,
                                    },
                                    body: formData,
                                })
                                    .then(async response => {
                                        if (response.ok) {
                                            // Get the response data
                                            const data = await response.json();
                                            console.log('Indexer Results:', data);
                                            setisLoading(false);
                                            // Update toast notification
                                            toast.update(toastId, {
                                                render: 'Documents uploaded and indexed successfully! 🎉',
                                                type: 'success',
                                                className: 'rotateY animated',
                                                autoClose: 5000,
                                                closeButton: true,
                                                isLoading: false
                                            });
                                            // Reset the form fields
                                            setDisplayName('');
                                            setDescription('');
                                            setFiles([]);
                                        } else {
                                            const data = await response.json();
                                            // Log to console
                                            console.error('Error uploading and indexing documents:', data.error);
                                            setisLoading(false);
                                            // Update toast notification
                                            toast.update(toastId, {
                                                render: 'Failed to upload and index documents! 😢 (Check Console for details)',
                                                type: 'error',
                                                className: 'rotateY animated',
                                                autoClose: 5000,
                                                closeButton: true,
                                                isLoading: false
                                            });
                                            // Delete the previously inserted collection from the database
                                            fetch('/api/user/collections', {
                                                method: 'DELETE',
                                                headers: {
                                                    'Content-Type': 'application/json',
                                                },
                                                body: JSON.stringify({
                                                    collection_id: createdCollectionId,
                                                    delete_vecs: false,
                                                }),
                                            })
                                                .then(async response => {
                                                    if (response.ok) {
                                                        // Get the response data
                                                        const data = await response.json();
                                                        console.log('Delete Collection Results:', data);
                                                    } else {
                                                        const data = await response.json();
                                                        // Log to console
                                                        console.error('Error deleting collection:', data.error);
                                                    }
                                                });
                                        }
                                    })
                                    .catch(error => {
                                        console.error('Error uploading and indexing documents:', error);
                                        setisLoading(false);
                                        // Update toast notification
                                        toast.update(toastId, {
                                            render: 'Failed to upload and index documents! 😢 (Check Console for details)',
                                            type: 'error',
                                            className: 'rotateY animated',
                                            autoClose: 5000,
                                            closeButton: true,
                                            isLoading: false
                                        });
                                        // Delete the previously inserted collection from the database
                                        fetch('/api/user/collections', {
                                            method: 'DELETE',
                                            headers: {
                                                'Content-Type': 'application/json',
                                            },
                                            body: JSON.stringify({
                                                collection_id: createdCollectionId,
                                                delete_vecs: false,
                                            }),
                                        })
                                            .then(async response => {
                                                if (response.ok) {
                                                    // Get the response data
                                                    const data = await response.json();
                                                    console.log('Delete Collection Results:', data);
                                                } else {
                                                    const data = await response.json();
                                                    // Log to console
                                                    console.error('Error deleting collection:', data.error);
                                                }
                                            });
                                    });
                            } else {
                                const data = await response.json();
                                // Log to console
                                console.error('Error uploading and indexing documents:', data.error);
                                // Show error dialog
                                Swal.fire({
                                    title: 'Error!',
                                    text: 'Failed to upload and index documents. Please try again later. (Check Console for more details)',
                                    icon: 'error',
                                    confirmButtonColor: '#4caf50',
                                });
                                setisLoading(false);
                            }
                        })
                        .catch(error => {
                            console.error('Error uploading and indexing documents:', error);
                            // Show error dialog
                            Swal.fire({
                                title: 'Error!',
                                text: 'Failed to upload and index documents. Please try again later. (Check Console for more details)',
                                icon: 'error',
                                confirmButtonColor: '#4caf50',
                            });
                            setisLoading(false);
                        });
                }
                else {
                    setisLoading(false);
                }
            });
        }
    };

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col divide-y overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col w-full justify-center gap-4">
                    <h2 className="text-lg text-center font-semibold mb-4">Upload & Index Your Own Document Set:</h2>
                    {/* Warning Banner */}
                    <div className="flex flex-col bg-red-100 border border-orange-400 text-orange-600 px-4 py-3 rounded text-center items-center" role="alert">
                        <AlertTriangle />
                        <div className="flex text-center items-center font-bold">
                            WARNING
                        </div>
                        <div className="flex">Smart Retrieval is still in the demo stage, avoid uploading sensitive/secret documents.</div>
                    </div>
                    <div className={`flex flex-col ${displayNameError ? 'has-error' : ''}`}>
                        <label htmlFor="displayName" title='Display Name' className='mb-2'>Display Name:</label>
                        <input
                            type="text"
                            id="displayName"
                            title='Display Name'
                            value={displayName}
                            onChange={handleDisplayNameChange}
                            className={`h-10 rounded-lg w-full border px-2 bg-gray-300 dark:bg-zinc-700/65 ${displayNameError ? 'border-red-500 ' : ''}`}
                        />
                        {displayNameError && <p className="text-red-500 text-sm pl-1 pt-1">Display Name is required!</p>}
                    </div>
                    <div className={`flex flex-col ${descriptionError ? 'has-error' : ''}`}>
                        <label htmlFor="collectionName" title='Description' className='mb-2'>Description:</label>
                        <input
                            type="text"
                            id="description"
                            title='Description'
                            value={description}
                            onChange={handleDescriptionChange}
                            className={`h-10 rounded-lg w-full border px-2 bg-gray-300 dark:bg-zinc-700/65 ${descriptionError ? 'border-red-500' : ''}`}
                        />
                        {descriptionError && <p className="text-red-500 text-sm pl-1 pt-1">Description is required!</p>}
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="fileUpload" title='Select Files' className='mb-2'>Select Files:</label>
                        <input
                            type="file"
                            id="fileUpload"
                            title='Select Files'
                            multiple
                            accept={allowedTypesString}
                            onChange={handleFileChange}
                            className={`h-12 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2 py-2 ${fileError ? 'border-red-500' : ''}`}
                        />
                        {fileError && <p className="text-red-500 text-sm pl-1 pt-1">{fileErrorMsg}</p>}
                    </div>
                    <div className="flex flex-col gap-4">
                        <button
                            disabled={isLoading}
                            type="submit"
                            title='Submit'
                            className="text-center items-center text-l disabled:bg-orange-400 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100">
                            {isLoading ? <IconSpinner className="animate-spin h-5 w-5 mx-auto" /> : "Submit"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}