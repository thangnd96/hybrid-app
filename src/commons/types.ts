// Post
export type Post = {
  body: string;
  id: number;
  title: string;
  userId: number;
};


// Authentication
export interface User {
  id: string;
  email: string;
  username: string;
  password: string;
  avatar?: string;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  userData: User[];
}
