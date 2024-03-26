"use client";

export default function About() {

  return (
    <div className="rounded-xl shadow-xl p-4 max-w-5xl w-full">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl md:text-4xl font-bold mb-4">About Smart Retrieval</h1>
          <p className="text-l mb-4">
            Welcome to Smart Retrieval, your go-to platform for efficient and streamlined information retrieval,
            especially in the realm of legal and compliance documents.
          </p>
          <p className="text-l mb-4">
            Our mission is to enhance user experiences at JTC by addressing key challenges such as manual search
            inefficiencies and rigid file naming conventions.
          </p>
          <p className="text-l mb-4">
            With cutting-edge technology, including Large Language Models (LLM) like GPT, BERT, and advanced chatbot
            integration, we aim to revolutionize the way JTC employees access and comprehend crucial documents.
          </p>
          <p className="text-l mb-4">
            We are committed to providing accurate, reliable, and user-friendly information retrieval services that
            empower JTC employees to make informed decisions and stay compliant with the latest regulations.
          </p>
          <p className="text-l mb-4">
            Thank you for choosing Smart Retrieval. We look forward to serving you and making your work life easier.
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mt-8 mb-4">Functions of Smart Retrieval</h2>
          <p className="text-l mb-4">
            Smart Retrieval is designed to provide users with a seamless and efficient experience when searching for
            information. Some of the key functions of Smart Retrieval include:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="text-l">Chat</li>
            <li className="text-l">Question & Answer (Q&A)</li>
            <li className="text-l">Search</li>
          </ul>
          <p className="text-l mb-4">
            These functions are designed to cater to different user preferences and requirements, ensuring that users
            can easily access the information they need.
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mt-8 mb-4">Functions In-Depth</h2>
          <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2">Chat</h3>
          <p className="text-l mb-4">
            The chat function allows users to interact with Smart Retrieval through a conversational interface via a fixed set of documents.
            Users can ask questions, seek information, and engage in dialogue with the system to retrieve the information they
            need. The chat function is designed to be intuitive, user-friendly, and responsive, providing users with a
            seamless experience. Current document sets include:
          </p>
          <ul className="list-disc list-inside mb-4">
            <li className="text-l">PSSCOC</li>
            <li className="text-l">EIR</li>
            <li className="text-l">And more...</li>
          </ul>

          <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2">Question & Answer (Q&A)</h3>
          <p className="text-l mb-4">
            The Q&A function enables users to ask specific questions relating to their own documents and receive accurate answers from Smart Retrieval.
            Users can simply upload their files and input their queries, and the system will provide relevant information based on the question asked.
            The Q&A function is designed to provide users with precise and concise answers to their queries, enhancing
            the information retrieval process.
          </p>

          <h3 className="text-xl md:text-2xl font-bold mt-4 mb-2">Search</h3>
          <p className="text-l mb-4">
            The search function allows users to input keywords or phrases to search for specific information within the
            document repository. Users can enter their search queries, and the system will retrieve relevant documents
            based on the search terms provided. The search function is designed to help users quickly locate the
            information they need, streamlining the search process.
          </p>

          <h2 className="text-2xl md:text-4xl font-bold mt-8 mb-4">Disclaimer</h2>
          <p className="text-l mb-4">
            The answer provided by Smart Retrieval may not be accurate and might be prone to hallucination. Users are advised to fact-check the answer and not use it as is. Smart Retrieval is not responsible for any consequences arising from the use of the answer.
          </p>
        </div>
      </div>
    </div>
  );
}
