import { KEYS } from '@/commons/key';
import { sleep } from './utils';
import { uuidv7 } from 'uuidv7';
import type { RegisterBody, User } from '@/commons/types';
import SHA256 from 'crypto-js/sha256';
import { api } from './api';

function generateToken(user: unknown): string {
  return btoa(JSON.stringify(user));
}

function hashPassword(password: string): string {
  const hashPassword = SHA256(password);

  return hashPassword.toString();
}

async function findUser({ username, password }: { username: string; password: string }) {
  const authStore = await JSON.parse(localStorage.getItem(KEYS.AUTH_STORAGE) || '{}');
  await sleep(1000);
  console.log('🚀 ~ authStore:', authStore);

  const user = authStore?.state?.userData.find(
    (user: User) => user.username === username && user.password === hashPassword(password)
  );

  return user;
}

// Mock authentication functions
export const authService = {
  login: async (body: { username: string; password: string }): Promise<User> => {
    // Simulate API call delay
    const user = await findUser(body);

    if (user) return user;

    try {
      const { data } = await api.post<User>('/user/login', body);

      return data;
    } catch {
      throw new Error('Invalid email or password');
    }
  },

  register: async (body: RegisterBody): Promise<User> => {
    const { password, username, ...payload } = body;
    // Check if user already exists
    const existingUser = await findUser({ username, password });

    if (existingUser) {
      throw new Error('User already exists');
    }

    const dataUser: Omit<User, 'accessToken' | 'refreshToken'> = {
      id: uuidv7(),
      image: `https://dummyjson.com/icon/${username}/128`,
      password: hashPassword(password),
      username,
      ...payload,
    };

    return {
      ...dataUser,
      accessToken: generateToken(dataUser),
      refreshToken: generateToken(dataUser),
    };
  },
};
