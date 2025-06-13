// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Ethiopian Orthodox Sunday School",
  description: "Attendance management for Sunday School",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="bg-gray-800 text-white p-4 shadow-md">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">Sunday School SIS</h1>
            <div className="flex gap-4">
              <Link href="/" className="hover:underline">
                Home
              </Link>
              <Link href="/students" className="hover:underline">
                Student
              </Link>
              <Link href="/register" className="hover:underline">
                Register
              </Link>
            </div>
          </div>
        </nav>
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
