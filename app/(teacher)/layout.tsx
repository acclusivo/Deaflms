import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';
import { Navbar } from '@/components/common/Navbar';

export const metadata = {
  title: 'Facilitator Studio | DeafLMS',
  description: 'Classroom curriculum management, AI lesson co-pilot, and student progress tracking for deaf educators.',
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalRouteGuard allowedRole="teacher">
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900 selection:bg-teal-700 selection:text-white">
        <Navbar currentRole="teacher" />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </PortalRouteGuard>
  );
}
