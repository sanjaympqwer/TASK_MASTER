'use client';

import { findUserById } from '@/lib/data';
import type { User } from '@/lib/definitions';
import { useEffect, useState } from 'react';

export const useCurrentUser = (): User | null => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchUser() {
      // For now, we'll just use the mock user.
      // In a real app with auth, you'd get the current user's ID from a session.
      const currentUser = await findUserById('1');
      setUser(currentUser || null);
    }

    fetchUser();
  }, []);

  return user;
};
