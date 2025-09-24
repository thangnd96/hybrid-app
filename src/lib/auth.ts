// Authentication utilities and mock data
export interface User {
  id: string;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
}

// Mock users for demonstration
const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'john@example.com',
    username: 'johndoe',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-15',
  },
  {
    id: '2',
    email: 'jane@example.com',
    username: 'janesmith',
    avatar:
      'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
    createdAt: '2024-01-20',
  },
];

// Mock authentication functions
export const authService = {
  login: async (email: string, password: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const user = MOCK_USERS.find(u => u.email === email);
    if (!user || password !== 'password123') {
      throw new Error('Invalid email or password');
    }

    // Store in localStorage for persistence
    localStorage.setItem('auth_token', 'mock_token_' + user.id);
    localStorage.setItem('current_user', JSON.stringify(user));

    return user;
  },

  register: async (email: string, password: string, username: string): Promise<User> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Check if user already exists
    const existingUser = MOCK_USERS.find(u => u.email === email || u.username === username);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      createdAt: new Date().toISOString(),
    };

    MOCK_USERS.push(newUser);

    // Store in localStorage
    localStorage.setItem('auth_token', 'mock_token_' + newUser.id);
    localStorage.setItem('current_user', JSON.stringify(newUser));

    return newUser;
  },
};
