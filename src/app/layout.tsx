import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Header from "@/components/layout/Header";
import SplashScreen from "@/components/layout/SplashScreen";
import { ThemeProvider } from "@/context/ThemeContext";
import { SplashProvider } from "@/context/SplashContext";
import MainContent from "@/components/layout/MainContent";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Devon Lane - Full Stack Developer",
  description: "Portfolio website of Devon Lane, a full stack developer specializing in modern web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-black min-h-screen`}
        suppressHydrationWarning
      >
        <SplashProvider>
          <ThemeProvider>
            <SplashScreen />
            <MainContent>
              <Header />
              <main>
                {children}
              </main>
            </MainContent>
          </ThemeProvider>
        </SplashProvider>
      </body>
    </html>
  );
}
