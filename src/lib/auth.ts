import 'server-only';
import { cookies } from 'next/headers';
import { SessionPayload } from './definitions';
import { getIronSession, IronSession } from 'iron-session';

const sessionOptions = {
  password: process.env.AUTH_SECRET || 'your-super-secret-key-that-is-at-least-32-characters-long',
  cookieName: 'taskmaster-session',
  cookieOptions: {
    secure: process.env.NODE_ENV === 'production',
  },
};

export async function getSession(): Promise<IronSession<SessionPayload> | null> {
    const session = await getIronSession<SessionPayload>(cookies(), sessionOptions);
    if (!session.userId) {
        return null;
    }
    return session;
}

export async function createSession(userId: string) {
    const session = await getIronSession<SessionPayload>(cookies(), sessionOptions);
    session.userId = userId;
    session.expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
    await session.save();
}

export async function deleteSession() {
    const session = await getIronSession<SessionPayload>(cookies(), sessionOptions);
    session.destroy();
}
