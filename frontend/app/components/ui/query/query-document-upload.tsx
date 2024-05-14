"use client";

import { useState } from 'react';
import { toast } from 'react-toastify';

export default function QueryDocumentUpload() {
    const [files, setFiles] = useState<File[]>([]);
    const [displayName, setDisplayName] = useState('');
    const [description, setDescription] = useState('');
    const [displayNameError, setDisplayNameError] = useState(false);
    const [descriptionError, setDescriptionError] = useState(false);
    const [fileError, setFileError] = useState(false);
    const [fileErrorMsg, setFileErrorMsg] = useState('');

    const MAX_FILES = 1; // Maximum number of files allowed
    const MAX_TOTAL_SIZE = 10 * 1024 * 1024; // Maximum total size allowed (10 MB in bytes)
    // The total size of all selected files should not exceed this value

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
                toast.error(`Total size of selected files exceeds the maximum allowed (${MAX_TOTAL_SIZE} bytes).`, {
                    position: "top-right",
                });
                setFileError(true);
                setFileErrorMsg(`Total size of selected files exceeds the maximum allowed (${MAX_TOTAL_SIZE} bytes).`);
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
            // Submit logic
            console.log("Form submitted successfully!");
            // Show toast notification
            toast.success("Document set uploaded successfully!", {
                position: "top-right",
                closeOnClick: true,
            });
            // Reset the form fields
            setDisplayName('');
            setDescription('');
            setFiles([]);
        }
    };

    return (
        <div className="w-full rounded-xl bg-white dark:bg-zinc-700/30 dark:from-inherit p-4 shadow-xl">
            <div className="rounded-lg pt-5 pr-10 pl-10 flex h-[50vh] flex-col divide-y overflow-y-auto">
                <form onSubmit={handleSubmit} className="flex flex-col w-full justify-center gap-4">
                    <h2 className="text-lg text-center font-semibold mb-4">Upload & Index Your Own Document Set:</h2>
                    <div className={`flex flex-col ${displayNameError ? 'has-error' : ''}`}>
                        <label htmlFor="displayName" className='mb-2'>Display Name:</label>
                        <input
                            type="text"
                            id="displayName"
                            value={displayName}
                            onChange={handleDisplayNameChange}
                            className={`h-10 rounded-lg w-full border px-2 bg-gray-300 dark:bg-zinc-700/65 ${displayNameError ? 'border-red-500 ' : ''}`}
                        />
                        {displayNameError && <p className="text-red-500 text-sm pl-1 pt-1">Display Name is required!</p>}
                    </div>
                    <div className={`flex flex-col ${descriptionError ? 'has-error' : ''}`}>
                        <label htmlFor="collectionName" className='mb-2'>Description:</label>
                        <input
                            type="text"
                            id="description"
                            value={description}
                            onChange={handleDescriptionChange}
                            className={`h-10 rounded-lg w-full border px-2 bg-gray-300 dark:bg-zinc-700/65 ${descriptionError ? 'border-red-500' : ''}`}
                        />
                        {descriptionError && <p className="text-red-500 text-sm pl-1 pt-1">Description is required!</p>}
                    </div>
                    <div className='flex flex-col'>
                        <label htmlFor="fileUpload" className='mb-2'>Select Files:</label>
                        <input
                            type="file"
                            id="fileUpload"
                            multiple
                            accept=".pdf,.doc,.docx,.txt"
                            onChange={handleFileChange}
                            className={`h-12 rounded-lg w-full bg-gray-300 dark:bg-zinc-700/65 border px-2 py-2 ${fileError ? 'border-red-500' : ''}`}
                        />
                        {fileError && <p className="text-red-500 text-sm pl-1 pt-1">{fileErrorMsg}</p>}
                    </div>
                    <button type="submit" className="text-center items-center text-l disabled:bg-orange-400 bg-blue-500 text-white px-6 py-3 rounded-md font-bold transition duration-300 ease-in-out transform hover:scale-105 disabled:hover:scale-100">Submit</button>
                </form>
            </div>
        </div>
    );
}