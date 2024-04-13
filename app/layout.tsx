import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Credential",
  description: "Okhub Agency Credential",
  keywords: "Okhub, Credential, Agency",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-main">
      <body className={`${inter.className}`}>{children}</body>
    </html>
  );
}
