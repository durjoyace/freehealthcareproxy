import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Disclaimer } from "@/components/Disclaimer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FreeHealthcareProxy - Free Healthcare Admin Help",
  description: "Get free clarity on healthcare admin problems—bills, denials, prior authorizations, and more. Understand what's happening before deciding your next step.",
  keywords: "healthcare admin, medical bill help, insurance denial, prior authorization, claim pending, healthcare proxy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased pb-10`}>
        {children}
        <Disclaimer />
      </body>
    </html>
  );
}
