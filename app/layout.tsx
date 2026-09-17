import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Deaf LMS — K-12 Visual Learning & Digital Literacy Platform',
  description: 'An accessibility-first Learning Management System for Deaf and Hard-of-Hearing students, educators, and administrators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-slate-50 text-slate-900 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
