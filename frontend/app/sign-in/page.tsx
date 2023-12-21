"use client";

import { GoogleLoginButton, SGIDLoginButton } from '@/app/components/login-buttons';
import Header from "@/app/components/header";
import Main from "@/app/components/ui/main-container";

const SignInPage = () => {
  return (
    <Main>
      <Header />
      <div className="rounded-xl shadow-xl p-4 mb-8 z-10 max-w-5xl w-full">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex flex-col items-center justify-center py-10 space-y-4">
            <div className="bg-blue-500 text-white px-8 py-6 rounded-lg shadow-lg">
              <h1 className="text-4xl font-bold mb-4">Sign in to Smart Retrieval!</h1>
              <p className="text-lg text-gray-200 mb-4">
                Your intelligent solution for quick and accurate information retrieval.
              </p>
              <div className="flex flex-col gap-4">
                <GoogleLoginButton />
                <SGIDLoginButton />
                <p className="text-gray-200 text-sm">
                  Note: SGID login is only available via SingPass.
                </p>
                <div className="flex items-center justify-center gap-4">
                  <div className="w-full h-px bg-gray-300"></div>
                </div>
                <button
                  className="text-white font-bold hover:underline mt-4 rounded-md shadow-lg py-2 bg-gray-500 hover:bg-gray-300"
                  onClick={() => {
                    // Redirect back to the home page
                    window.location.href = '/';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Main>
  );
};

export default SignInPage;
