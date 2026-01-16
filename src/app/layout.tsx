import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "FreeHealthcareProxy - Navigate Healthcare Admin Problems With Ease",
  description: "Get free help understanding healthcare administrative issues - medical bills, insurance denials, records requests, and prior authorizations. Expert guidance when you need it most.",
  keywords: "healthcare proxy, medical bills help, insurance denial appeal, prior authorization, medical records, healthcare advocacy",
  openGraph: {
    title: "FreeHealthcareProxy - Navigate Healthcare Admin Problems With Ease",
    description: "Get free help understanding healthcare administrative issues. Expert guidance for medical bills, insurance denials, and more.",
    type: "website",
    url: "https://freehealthcareproxy.com",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
