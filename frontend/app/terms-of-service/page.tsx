"use client";

import React from 'react';

const TermsOfServicePage: React.FC = () => {
    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
            <div className="max-w-3xl mx-auto p-4">
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
                            Smart-Retrieval currently does not collect & store any personal data. However, we may collect your data to provide and improve the Service in the future.
                        </p>
                        <p>
                            By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from Smart-Retrieval.
                        </p>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default TermsOfServicePage;
