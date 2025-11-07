'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { findUserByEmail, createUser, findUserById, updateUser, createTaskForUser, updateTask as dbUpdateTask, deleteTask as dbDeleteTask } from './data';
import { suggestTaskDescription } from '@/ai/flows/task-description-suggestion';
import { createSession, deleteSession, getSession } from './auth';
import bcrypt from 'bcryptjs';

// --- Auth Actions ---

const LoginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(1, { message: "Password is required." }),
});

const SignupSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  password: z.string().min(6, { message: "Password must be at least 6 characters." }),
});

export async function authenticate(prevState: string | undefined, formData: FormData) {
  try {
    const validatedFields = LoginSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
      return 'Invalid credentials.';
    }

    const { email, password } = validatedFields.data;
    const user = await findUserByEmail(email);

    if (!user || !user.password) {
      return 'Invalid credentials.';
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (passwordsMatch) {
      await createSession(user.id);
      // This redirect should only happen on success
      redirect('/dashboard');
    } else {
      return 'Invalid credentials.';
    }
  } catch (error) {
    if ((error as Error).message.includes('NEXT_REDIRECT')) {
      throw error;
    }
    return 'Something went wrong.';
  }
  // This should not be reached if logic is correct
  return 'An unexpected error occurred.';
}

export async function signup(prevState: string | undefined, formData: FormData) {
    const validatedFields = SignupSchema.safeParse(
      Object.fromEntries(formData.entries())
    );

    if (!validatedFields.success) {
        return 'Invalid form data.';
    }

    const { name, email, password } = validatedFields.data;

    try {
        const existingUser = await findUserByEmail(email);
        if (existingUser) {
            return 'An account with this email already exists.';
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await createUser({ name, email, password: hashedPassword, avatarUrl: '' });
        await createSession(newUser.id);
    } catch(e) {
        if ((e as Error).message.includes('NEXT_REDIRECT')) {
          throw e;
        }
        return 'Failed to create account.';
    }

    redirect('/dashboard');
}

export async function logout() {
  await deleteSession();
  redirect('/');
}


// --- Profile Actions ---
const ProfileSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters.'),
});
type FormState = {
    message: string;
    success?: boolean;
};

export async function updateProfile(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session?.userId) {
        return { message: 'Not authenticated', success: false };
    }
    const validatedFields = ProfileSchema.safeParse({
        name: formData.get('name'),
    });

    if (!validatedFields.success) {
        return { message: 'Invalid name.', success: false };
    }
    
    try {
        await updateUser(session.userId, { name: validatedFields.data.name });
        revalidatePath('/profile');
        revalidatePath('/dashboard'); // To update header/sidebar
        return { message: 'Profile updated successfully!', success: true };
    } catch(e) {
        return { message: 'Failed to update profile.', success: false };
    }
}

// --- Task Actions ---

const TaskSchema = z.object({
    title: z.string().min(3, 'Title must be at least 3 characters.'),
    description: z.string().optional(),
    status: z.enum(['todo', 'in-progress', 'done']),
});

export async function createTask(prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session?.userId) {
        return { message: 'Not authenticated', success: false };
    }
    const validatedFields = TaskSchema.safeParse(Object.fromEntries(formData.entries()));

    if(!validatedFields.success) {
        return { message: 'Invalid task data.', success: false };
    }

    try {
        await createTaskForUser(session.userId, validatedFields.data);
        revalidatePath('/dashboard');
        return { message: 'Task created successfully!', success: true };
    } catch (e) {
        return { message: 'Failed to create task.', success: false };
    }
}

export async function updateTask(id: string, prevState: FormState, formData: FormData): Promise<FormState> {
    const session = await getSession();
    if (!session?.userId) {
        return { message: 'Not authenticated', success: false };
    }
    const validatedFields = TaskSchema.safeParse(Object.fromEntries(formData.entries()));
    if(!validatedFields.success) {
        return { message: 'Invalid task data.', success: false };
    }

    try {
        await dbUpdateTask(id, validatedFields.data);
        revalidatePath('/dashboard');
        return { message: 'Task updated successfully!', success: true };
    } catch (e) {
        return { message: 'Failed to update task.', success: false };
    }
}

export async function deleteTask(id: string): Promise<FormState> {
    const session = await getSession();
    if (!session?.userId) {
        return { message: 'Not authenticated', success: false };
    }
    try {
        await dbDeleteTask(id);
        revalidatePath('/dashboard');
        return { message: 'Task deleted.', success: true };
    } catch (e) {
        return { message: 'Failed to delete task.', success: false };
    }
}

// --- AI Action ---
export async function suggestDescriptionAction(input: { title: string; existingDescription: string }) {
    if (!input.title) {
        return { error: 'A title is required to suggest a description.' };
    }

    try {
        const result = await suggestTaskDescription(input);
        return { suggestedDescription: result.suggestedDescription };
    } catch (e) {
        console.error(e);
        return { error: 'Failed to get suggestion from AI.' };
    }
}
