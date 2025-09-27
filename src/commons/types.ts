// Post
export interface Post {
  id: number;
  title: string;
  body: string;
  tags: string[];
  reactions: Reactions;
  views: number;
  userId: number;
}

export interface Reactions {
  likes: number;
  dislikes: number;
}

export type PostSortOrderOptions = 'asc' | 'desc';
export type PostSortByOptions = keyof Post;

export type PostFilters = {
  q?: string; // search title or body
  sortBy?: PostSortByOptions;
  order?: PostSortOrderOptions;
};

// Authentication
export type RegisterBody = {
  email: string;
  password: string;
  username: string;
  firstName: string;
  lastName: string;
};

export interface User {
  accessToken: string;
  refreshToken: string;
  id: number | string;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  image: string;
  password?: string
}

export interface AuthState {
  user: User | null;
  userData: User[];
}
