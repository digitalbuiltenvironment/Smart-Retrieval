"use client";

import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">Terms of Service</h1>
                    <span>
                        <p className="mb-2 gap-2">
                            Smart-Retrieval the website (hereinafter referred to as the "Service").
                        </p>
                        <p className="mb-2">
                            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                        </p>
                        <p className="mb-2">
                            Smart-Retrieval currently collects certain personal data for authentication & authorization purposes only, it does not in anyway store any personal data on any servers or external services,
                            however in the future we may collect them to improve the service, where by the this privacy policy will be updated.
                        </p>
                        <p className='mb-2'>
                            By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from Smart-Retrieval.
                        </p>
                        <p className='mb-2'>
                            The terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, which is accessible at Smart-Retrieval unless otherwise defined in this Privacy Policy.
                        </p>
                        <p className='mb-2'>
                            The service is provided as is and we do not guarantee that the service will be available at all times, or that it will be free from errors or interruptions.
                        </p>
                        <p className='mb-2'>
                            It is your responsibility to ensure that the service is suitable for your intended purposes and that it meets your requirements.
                            It is also your responsibility to ensure that you fact check any information you retrieve from the service.
                        </p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
