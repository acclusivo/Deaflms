import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';
import { SignyAITutorModal } from '@/components/student/SignyAITutorModal';
import { Navbar } from '@/components/common/Navbar';

export const metadata = {
  title: 'Learner Portal | DeafLMS',
  description: 'Interactive visual sign language and digital literacy learning for deaf students.',
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalRouteGuard allowedRole={['student', 'parent']}>
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        <Navbar currentRole="student" />
        <div className="flex-1 flex flex-col">
          {children}
        </div>
        <SignyAITutorModal />
      </div>
    </PortalRouteGuard>
  );
}
