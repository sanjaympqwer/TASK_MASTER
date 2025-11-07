import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/shared/MainSidebar';
import { Header } from '@/components/shared/Header';
import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/data';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (!session?.userId) {
    redirect('/');
  }
  
  const user = await findUserById(session.userId);
  if (!user) {
    // In a real app, this would be an error state.
    // For now, we'll just render a fallback.
    return <div>Could not load user data.</div>;
  }

  return (
    <SidebarProvider>
      <MainSidebar user={user} />
      <SidebarInset>
        <Header user={user} pageTitle="Dashboard" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
