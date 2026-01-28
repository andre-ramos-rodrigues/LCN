import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppProvider } from "./context/AppContext";
import ThemeProvider from "./context/ThemeProvider";
import Footer from "./components/Footer";
import Header from "./components/Header";
import prisma from "./lib/prisma";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "   ",
  description: "by André Rodrigues",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  
  const theme = await prisma.theme.findFirst();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AppProvider>
          <ThemeProvider initialTheme={theme ?? undefined}>
            <Header />
            {children}
            <Footer />
          </ThemeProvider>
        </AppProvider>
      </body>
    </html>
  );
}
