import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "@/app/globals.css";
import { Providers } from "@/app/providers";
import Header from "@/app/components/header";
import Footer from "@/app/components/footer";
import Main from "@/app/components/ui/main-container";

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' }
  ],
}

export const metadata: Metadata = {
  title: "Smart Retrieval",
  description: "A chatbot powered by LLM for information retrieval",
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
    <html lang="en" className={inter.variable}>
      <body>
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
