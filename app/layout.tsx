import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/lib/auth-context';

export const metadata: Metadata = {
  title: 'DeafLMS — Visual Sign & Digital Literacy Platform',
  description: 'An accessibility-first Learning Management System for Deaf and Hard-of-Hearing students, educators, and administrators.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="min-h-full flex flex-col bg-[#F5F7FC] text-[#1F2937] antialiased selection:bg-[#1B4EA7] selection:text-white">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
