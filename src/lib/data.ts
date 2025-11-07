import type { Task, User } from './definitions';
import { PlaceHolderImages } from './placeholder-images';

// In a real application, you would fetch this data from a database.
// We're using a mock in-memory store for demonstration purposes.

const users: User[] = [
  {
    id: '1',
    name: 'Jane Doe',
    email: 'user@example.com',
    password: 'password123', // In a real app, this would be hashed
    avatarUrl: PlaceHolderImages.find(img => img.id === 'user-avatar-1')?.imageUrl ?? '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

let tasks: Task[] = [
  {
    id: '1',
    title: 'Set up project structure',
    description: 'Initialize Next.js project and set up folder structure for components, lib, and styles.',
    status: 'done',
    createdBy: '1',
    createdAt: new Date('2023-10-26T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-26T12:00:00Z').toISOString(),
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Create login and signup pages with server-side validation and session management.',
    status: 'in-progress',
    createdBy: '1',
    createdAt: new Date('2023-10-27T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-27T15:00:00Z').toISOString(),
  },
  {
    id: '3',
    title: 'Design task card component',
    description: 'Build a responsive and accessible task card component using TailwindCSS and Shadcn UI.',
    status: 'todo',
    createdBy: '1',
    createdAt: new Date('2023-10-28T11:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-28T11:00:00Z').toISOString(),
  },
  {
    id: '4',
    title: 'Integrate AI suggestions',
    description: 'Connect the task creation form to the Genkit AI flow to provide description suggestions.',
    status: 'todo',
    createdBy: '1',
    createdAt: new Date('2023-10-28T14:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-28T14:00:00Z').toISOString(),
  },
];

// --- User Functions ---
export async function findUserByEmail(email: string): Promise<User | undefined> {
  return users.find(user => user.email === email);
}

export async function findUserById(id: string): Promise<User | undefined> {
  return users.find(user => user.id === id);
}

export async function createUser(data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
  const newUser: User = {
    ...data,
    id: String(users.length + 1),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  users.push(newUser);
  return newUser;
}

export async function updateUser(id: string, data: Partial<Omit<User, 'id'>>): Promise<User | undefined> {
    const userIndex = users.findIndex(u => u.id === id);
    if(userIndex === -1) return undefined;

    users[userIndex] = {
        ...users[userIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    return users[userIndex];
}

// --- Task Functions ---
export async function getTasksForUser(userId: string): Promise<Task[]> {
  return tasks.filter(task => task.createdBy === userId).sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function findTaskById(id: string): Promise<Task | undefined> {
  return tasks.find(task => task.id === id);
}

export async function createTaskForUser(userId: string, data: Omit<Task, 'id' | 'createdBy' | 'createdAt' | 'updatedAt'>): Promise<Task> {
  const newTask: Task = {
    ...data,
    id: String(Date.now()), // simple unique id
    createdBy: userId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  tasks.push(newTask);
  return newTask;
}

export async function updateTask(id: string, data: Partial<Omit<Task, 'id'>>): Promise<Task | undefined> {
    const taskIndex = tasks.findIndex(t => t.id === id);
    if(taskIndex === -1) return undefined;

    tasks[taskIndex] = {
        ...tasks[taskIndex],
        ...data,
        updatedAt: new Date().toISOString(),
    };
    return tasks[taskIndex];
}

export async function deleteTask(id: string): Promise<{ success: boolean }> {
  const initialLength = tasks.length;
  tasks = tasks.filter(task => task.id !== id);
  return { success: tasks.length < initialLength };
}
