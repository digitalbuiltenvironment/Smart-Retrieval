"use client";

export default function About() {

  return (
    <div className="rounded-xl shadow-xl p-4 mb-8 max-w-5xl w-full">
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
        </div>
      </div>
    </div>
  );
}
