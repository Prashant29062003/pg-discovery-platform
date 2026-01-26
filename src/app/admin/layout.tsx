import { redirect } from 'next/navigation';
import { auth } from '@clerk/nextjs/server';
import { SidebarProvider } from '@/context/SidebarContext';
import AdminLayoutWrapper from '@/components/admin/layout/AdminLayoutWrapper';
import { PageTransition } from '@/components/animations/PageTransition';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  return (
    <SidebarProvider>
      <AdminLayoutWrapper>
        <PageTransition variant="fade">
          {children}
        </PageTransition>
      </AdminLayoutWrapper>
    </SidebarProvider>
  );
}
