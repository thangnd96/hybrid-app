import { KEYS } from '@/commons/key';
import { sleep } from './utils';
import bcrypt from 'bcryptjs';
import { uuidv7 } from 'uuidv7';
import type { User } from '@/commons/types';

const AVATARS = [
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
  'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
];

function getRandomAvatar(): string {
  const randomIndex = Math.floor(Math.random() * AVATARS.length);

  return AVATARS[randomIndex];
}

function hashPassword(password: string): string {
  return bcrypt.hashSync(password, 10);
}

async function findUser({ email, password }: { email: string; password: string }) {
  const authStore = await JSON.parse(localStorage.getItem(KEYS.AUTH_STORAGE) || '{}');
  await sleep(1000);

  const user = authStore?.state?.userData.find(
    (user: User) => user.email === email && user.password === hashPassword(password)
  );

  return user;
}

// Mock authentication functions
export const authService = {
  login: async (body: { email: string; password: string }): Promise<User> => {
    // Simulate API call delay
    const user = await findUser(body);

    if (!user) {
      throw new Error('Invalid email or password');
    }

    return user;
  },

  register: async (email: string, password: string, username: string): Promise<User> => {
    // Check if user already exists
    const existingUser = await findUser({ email, password });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: uuidv7(),
      email,
      username,
      avatar: getRandomAvatar(),
      password: hashPassword(password),
      createdAt: new Date().toISOString(),
    };

    return newUser;
  },
};
