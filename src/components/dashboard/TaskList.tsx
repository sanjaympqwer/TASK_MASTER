import type { Task } from '@/lib/definitions';
import { TaskCard } from './TaskCard';

export function TaskList({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 bg-muted/20 p-12 text-center h-full">
        <h3 className="text-xl font-semibold tracking-tight">You have no tasks</h3>
        <p className="text-sm text-muted-foreground">Get started by creating a new task.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
}
