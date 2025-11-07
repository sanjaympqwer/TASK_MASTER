import { getSession } from '@/lib/auth';
import { findUserById, getTasksForUser } from '@/lib/data';
import { redirect } from 'next/navigation';
import { TaskList } from '@/components/dashboard/TaskList';
import { NewTaskDialog } from '@/components/dashboard/TaskDialogs';

export default async function DashboardPage() {
  const session = await getSession();
  const user = await findUserById(session!.userId!);

  if (!user) {
    redirect('/');
  }

  const tasks = await getTasksForUser(user.id);

  return (
    <main className="flex-1 overflow-y-auto p-4 sm:p-6">
      <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold font-headline">Your Tasks</h2>
          <NewTaskDialog />
      </div>
      <TaskList tasks={tasks} />
    </main>
  );
}
