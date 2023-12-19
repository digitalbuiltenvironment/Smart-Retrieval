"use client";

import Header from "@/app/components/header";
import ChatSection from "@/app/components/chat-section";

export default function Search() {

  return (
    <main id='main-container' className="flex min-h-screen flex-col items-center gap-10 background-gradient dark:background-gradient-dark md:pt-10 pt-24 px-10">
      <Header />
      <ChatSection />
    </main>
  );
}
