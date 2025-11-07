'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useActionState, useEffect, useTransition } from 'react';
import { useFormStatus } from 'react-dom';
import { createTask, updateTask, suggestDescriptionAction } from '@/lib/actions';
import type { Task } from '@/lib/definitions';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lightbulb, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const TaskSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters.'),
  description: z.string().optional(),
  status: z.enum(['todo', 'in-progress', 'done']),
});

type TaskFormValues = z.infer<typeof TaskSchema>;

type TaskFormProps = {
  task?: Task;
  onSuccess: () => void;
};

export function TaskForm({ task, onSuccess }: TaskFormProps) {
  const formAction = task ? updateTask.bind(null, task.id) : createTask;
  const [state, dispatch] = useActionState(formAction, { message: '' });
  const { toast } = useToast();

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(TaskSchema),
    defaultValues: {
      title: task?.title || '',
      description: task?.description || '',
      status: task?.status || 'todo',
    },
  });

  const [isSuggestionLoading, startSuggestionTransition] = useTransition();

  useEffect(() => {
    if (state.message && state.success === false) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: state.message,
      });
    }
    if (state.success === true) {
      toast({
        title: 'Success!',
        description: state.message,
      });
      onSuccess();
    }
  }, [state, toast, onSuccess]);

  const handleSuggestDescription = () => {
    const title = form.getValues('title');
    const existingDescription = form.getValues('description');
    startSuggestionTransition(async () => {
      const result = await suggestDescriptionAction({ title, existingDescription: existingDescription || '' });
      if(result.suggestedDescription) {
        form.setValue('description', result.suggestedDescription);
        toast({
            title: "Suggestion applied!",
            description: "The AI-suggested description has been added."
        })
      } else if (result.error) {
        toast({
            variant: "destructive",
            title: "Suggestion failed",
            description: result.error
        })
      }
    });
  };

  return (
    <Form {...form}>
      <form action={dispatch} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="e.g. Deploy the new feature" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Description</FormLabel>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={handleSuggestDescription}
                  disabled={isSuggestionLoading || !form.watch('title')}
                >
                  {isSuggestionLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Lightbulb className="mr-2 h-4 w-4" />
                  )}
                  Suggest
                </Button>
              </div>
              <FormControl>
                <Textarea placeholder="Add a detailed description..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value} name={field.name}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="todo">To Do</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="done">Done</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        
        {state.message && !state.success && (
          <Alert variant="destructive">
            <AlertDescription>{state.message}</AlertDescription>
          </Alert>
        )}

        <SubmitButton isEditing={!!task} />
      </form>
    </Form>
  );
}

function SubmitButton({ isEditing }: { isEditing: boolean }) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (isEditing ? 'Saving...' : 'Creating...') : (isEditing ? 'Save Changes' : 'Create Task')}
    </Button>
  );
}
