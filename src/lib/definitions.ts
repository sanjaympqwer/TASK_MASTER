export type User = {
  id: string;
  name: string;
  email: string;
  password?: string; // Hashed password, should not be sent to client
  avatarUrl: string;
  createdAt: string;
  updatedAt: string;
};

export type Task = {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  createdBy: string; // User ID
  createdAt: string;
  updatedAt: string;
};

export type SessionPayload = {
  userId: string;
  expiresAt: Date;
};
