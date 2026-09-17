import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';

export const metadata = {
  title: 'Facilitator Studio | Deaf LMS',
  description: 'Classroom curriculum management, AI lesson co-pilot, and student progress tracking for deaf educators.',
};

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
  return <PortalRouteGuard allowedRole="teacher">{children}</PortalRouteGuard>;
}
