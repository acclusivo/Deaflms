import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';

export const metadata = {
  title: 'Admin Console | Deaf LMS',
  description: 'School institutional administration, user roster management, and accessibility audit overview.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <PortalRouteGuard allowedRole="admin">{children}</PortalRouteGuard>;
}
