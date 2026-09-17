import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';

export const metadata = {
  title: 'Learner Portal | Deaf LMS',
  description: 'Interactive visual sign language and digital literacy learning for deaf students.',
};

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return <PortalRouteGuard allowedRole="student">{children}</PortalRouteGuard>;
}
