import React from 'react';
import { PortalRouteGuard } from '@/components/auth/PortalRouteGuard';
import { Navbar } from '@/components/common/Navbar';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

export const metadata = {
  title: 'Admin Console | DeafLMS',
  description: 'School institutional administration, user roster management, and accessibility audit overview.',
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <PortalRouteGuard allowedRole="admin">
      <div className="min-h-screen bg-slate-50 flex flex-col text-slate-900">
        <Navbar currentRole="admin" />
        <div className="flex-1 flex flex-col md:flex-row">
          <AdminSidebar />
          <div className="flex-1 min-w-0 overflow-x-hidden">
            {children}
          </div>
        </div>
      </div>
    </PortalRouteGuard>
  );
}
