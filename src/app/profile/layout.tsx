import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { MainSidebar } from '@/components/shared/MainSidebar';
import { Header } from '@/components/shared/Header';
import { getSession } from '@/lib/auth';
import { findUserById } from '@/lib/data';
import { redirect } from 'next/navigation';

export default async function ProfileLayout({
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
    return <div>Could not load user data.</div>;
  }

  return (
    <SidebarProvider>
      <MainSidebar user={user} />
      <SidebarInset>
        <Header user={user} pageTitle="Profile" />
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
