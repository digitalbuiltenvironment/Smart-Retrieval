import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Main from "@/app/components/ui/main-container";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Smart Retrieval",
  description: "A chatbot powered by LLM for information retrieval",
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  }
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Main>
            <Header />
            {children}
            <Footer />
          </Main>
        </Providers>
      </body>
    </html>
  );
}
