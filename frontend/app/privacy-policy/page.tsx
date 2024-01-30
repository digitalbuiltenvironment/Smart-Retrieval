"use client";

const PrivacyPolicyPage: React.FC = () => {
    return (
        <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
            <div className="max-w-3xl mx-auto p-4">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
                    <h1 className="text-2xl md:text-4xl font-bold mb-4">Privacy Policy</h1>
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
                    <h2 className="text-xl md:text-2xl font-bold mb-4 mt-4">Information Collection And Use</h2>
                    <span>
                        <p className="mb-4">
                            We collect several different types of information for various purposes to provide and improve our Service to you.
                        </p>
                    </span>
                    <h2 className="text-lg md:text-xl font-bold mb-4">Types of Data Collected</h2>
                    <span>
                        <h2 className="text-l md:text-xl font-bold mb-4">Personal Data</h2>
                        <span>
                            <p className="mb-2">
                                While using our Service, we may ask you to provide us with certain personally identifiable information that can be used to contact or identify you ("Personal Data").
                            </p>
                            <p className="mb-2">
                                Personally identifiable information may include, but is not limited to:
                            </p>
                            <ul className="list-disc list-inside mt-2 ml-4">
                                <li>Email Address</li>
                                <li>First name and last name</li>
                                <li>Cookies and Usage Data</li>
                            </ul>
                        </span>
                        <h2 className="text-l md:text-xl font-bold mb-4 mt-4">Usage Data</h2>
                        <span>
                            <p className="mb-2">
                                We may also collect information how the Service is accessed and used ("Usage Data"). This Usage Data may include information such as your computer's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that you visit, the time and date of your visit, the time spent on those pages, unique device identifiers and other diagnostic data.
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
