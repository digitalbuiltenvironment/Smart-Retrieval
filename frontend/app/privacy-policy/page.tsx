"use client";

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
                    <span>
                        <p className="mb-2 gap-2">
                            Smart-Retrieval the website (hereinafter referred to as the &quot;Service&quot;).
                        </p>
                        <p className="mb-2">
                            This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our Service and the choices you have associated with that data.
                        </p>
                        <p className="mb-2">
                            Smart-Retrieval currently collects certain personal data for authentication & authorization purposes only, it does not in anyway store any personal data on any servers or external services,
                            however we may collect them to improve the service for purposes as stated in this privacy policy.
                        </p>
                        <p>
                            By using the Service, you agree to the collection and use of information in accordance with this policy. Unless otherwise defined in this Privacy Policy, terms used in this Privacy Policy have the same meanings as in our Terms and Conditions, accessible from Smart-Retrieval.
                        </p>
                    </span>
                    <h2 className="text-xl md:text-2xl font-bold mb-4 mt-4">Information Collection And Use</h2>
                    <span>
                        <p className="mb-2">
                            We collect several different types of information for various purposes to provide and/or improve our Service to you.
                        </p>
                        <p className="mb-2">
                                We will use your data to provide you with the services you requested, such as email notification and newsletter, etc.
                            </p>
                            <p className="mb-2">
                                We will not sell your data to third parties, but we may share it with our partners who help us provide our services.
                            </p>
                            <p className="mb-2">
                                The data we collected about you is what you have provided to us, including your name, cell phone number, address, etc
                            </p>
                            <p className="mb-4">
                                We may collect, or process on behalf of our customers, the following categories of personal data when you use or interact with our products and services.
                            </p>
                    </span>
                    <h2 className="text-lg md:text-2xl font-bold mb-4">Types of Data Collected</h2>
                    <span>
                        <h2 className="text-l md:text-xl font-bold mb-4">Google User Data</h2>
                        <span>
                            <p className="mb-2">
                                While using our Service and signing in through Google, certain personally identifiable information will be shared with us from Google.
                            </p>
                            <p className="mb-2">
                                Scopes Requested from Google include:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4 mb-4">
                                <li>openid - Associate you with your Personal Info on Google</li>
                                <li>User Info/Profile - Any Personal Info made publicly available by you on Google</li>
                            </ul>
                            <p className="mb-2">
                                Personally identifiable information may include, but is not limited to:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4 mb-4">
                                <li>Email Address</li>
                                <li>Profile Image URL</li>
                                <li>First name and last name and Full Name</li>
                                <li>Google ID</li>
                            </ul>
                        </span>
                        <h2 className="text-l md:text-xl font-bold mb-4">sgID User Data</h2>
                        <span>
                            <p className="mb-2">
                                While using our Service and signing in through sgID, certain personally identifiable information will be shared with us from sgID.
                            </p>
                            <p className="mb-2">
                                Scopes Requested from sgID include:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4">
                                <li>openid - Associate you with your Personal Info</li>
                            </ul>
                            <p className="mb-2">
                                Personally identifiable information from sgID include:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4">
                                <li>First name and last name</li>
                            </ul>
                        </span>
                        <h2 className="text-l md:text-xl font-bold mb-4 mt-4">Usage Data</h2>
                        <span>
                            <p className="mb-2">
                                We may also collect information how the Service is accessed and used (&quot;Usage Data&quot;). This Usage Data may include information such as your computer&apos;s Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
                            </p>
                            <p className="mb-2">
                                This Usage Data may be collected automatically when using the Service.
                            </p>
                        </span>
                        <h2 className="text-l md:text-xl font-bold mb-4 mt-4">Tracking & Cookies Data</h2>
                        <span>
                            <p className="mb-2">
                                We use cookies and similar tracking technologies to track the activity on our Service and hold certain information.
                            </p>
                            <p className="mb-2">
                                Cookies are files with small amount of data which may include an anonymous unique identifier. Cookies are sent to your browser from a website and stored on your device. Tracking technologies also used are beacons, tags, and scripts to collect and track information and to improve and analyze our Service.
                            </p>
                            <p className="mb-2">
                                You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, if you do not accept cookies, you may not be able to use some portions of our Service.
                            </p>
                            <p>
                                Examples of Cookies we use:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4">
                                <li>Session Cookies. We use Session Cookies to operate our Service.</li>
                                <li>Preference Cookies. We use Preference Cookies to remember your preferences and various settings.</li>
                                <li>Security Cookies. We use Security Cookies for security purposes.</li>
                            </ul>
                        </span>
                        <h2 className="text-l md:text-xl font-bold mb-4 mt-4">Use of Data</h2>
                        <span>
                            <p className="mb-2">
                                Smart-Retrieval uses the collected data for various purposes:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4">
                                <li>To provide and maintain the Service.</li>
                                <li>To notify you about changes to our Service.</li>
                                <li>To allow you to participate in interactive features of our Service when you choose to do so.</li>
                            </ul>
                        </span>
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicyPage;
