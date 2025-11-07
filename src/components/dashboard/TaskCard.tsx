'use client';

import { useTransition } from 'react';
import type { Task } from '@/lib/definitions';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Trash } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { deleteTask } from '@/lib/actions';
import { EditTaskDialog } from './TaskDialogs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

const statusStyles = {
  todo: 'bg-gray-500',
  'in-progress': 'bg-blue-500',
  done: 'bg-green-500',
};

const statusLabels = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done'
}

export function TaskCard({ task }: { task: Task }) {
    const { toast } = useToast();
    const [isPending, startTransition] = useTransition();

    const handleDelete = () => {
        startTransition(async () => {
            const result = await deleteTask(task.id);
            if(result.success) {
                toast({
                    title: 'Task Deleted',
                    description: `The task "${task.title}" has been successfully deleted.`,
                });
            } else {
                toast({
                    variant: 'destructive',
                    title: 'Error',
                    description: result.message,
                });
            }
        });
    }

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="text-lg font-semibold leading-tight">{task.title}</CardTitle>
          <Badge variant="secondary" className={`whitespace-nowrap ${statusStyles[task.status] || 'bg-gray-400'} text-white`}>
            {statusLabels[task.status]}
          </Badge>
        </div>
        <CardDescription className="text-xs text-muted-foreground pt-1">
          Updated {formatDistanceToNow(new Date(task.updatedAt), { addSuffix: true })}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm text-muted-foreground line-clamp-3">{task.description}</p>
      </CardContent>
      <CardFooter className="flex justify-end gap-2">
        <EditTaskDialog task={task} />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive">
                <Trash className="h-4 w-4" />
                <span className="sr-only">Delete Task</span>
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the task
                <span className="font-semibold"> &quot;{task.title}&quot;</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete} disabled={isPending}>
                {isPending ? 'Deleting...' : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  );
}
