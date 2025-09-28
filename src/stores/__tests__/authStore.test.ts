import { act, renderHook } from '@testing-library/react';
import { useAuthStore } from '../authStore';
import type { User } from '@/commons/types';

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('authStore', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    jest.clearAllMocks();
    // Reset the store state completely
    act(() => {
      useAuthStore.setState({
        token: null,
        user: null,
        userData: [],
      });
    });
  });

  describe('initial state', () => {
    it('should have correct initial state', () => {
      const { result } = renderHook(() => useAuthStore());
      
      expect(result.current.token).toBeNull();
      expect(result.current.user).toBeNull();
      expect(result.current.userData).toEqual([]);
    });
  });

  describe('login', () => {
    it('should set user and token on login', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('mock-access-token');
    });
  });

  describe('register', () => {
    it('should set user, token and add to userData on register', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const mockUser: User = {
        id: 1,
        username: 'newuser',
        email: 'new@example.com',
        firstName: 'New',
        lastName: 'User',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      act(() => {
        result.current.register(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('mock-access-token');
      expect(result.current.userData).toContain(mockUser);
    });

    it('should append to existing userData on register', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const firstUser: User = {
        id: 1,
        username: 'firstuser',
        email: 'first@example.com',
        firstName: 'First',
        lastName: 'User',
        image: 'https://example.com/avatar1.jpg',
        accessToken: 'first-access-token',
        refreshToken: 'first-refresh-token',
      };

      const secondUser: User = {
        id: 2,
        username: 'seconduser',
        email: 'second@example.com',
        firstName: 'Second',
        lastName: 'User',
        image: 'https://example.com/avatar2.jpg',
        accessToken: 'second-access-token',
        refreshToken: 'second-refresh-token',
      };

      act(() => {
        result.current.register(firstUser);
      });

      act(() => {
        result.current.register(secondUser);
      });

      expect(result.current.userData).toHaveLength(2);
      expect(result.current.userData).toContain(firstUser);
      expect(result.current.userData).toContain(secondUser);
      expect(result.current.user).toEqual(secondUser);
    });
  });

  describe('logout', () => {
    it('should clear user and token on logout', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      // First login
      act(() => {
        result.current.login(mockUser);
      });

      expect(result.current.user).toEqual(mockUser);
      expect(result.current.token).toBe('mock-access-token');

      // Then logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
    });

    it('should not affect userData on logout', () => {
      const { result } = renderHook(() => useAuthStore());
      
      const mockUser: User = {
        id: 1,
        username: 'testuser',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        image: 'https://example.com/avatar.jpg',
        accessToken: 'mock-access-token',
        refreshToken: 'mock-refresh-token',
      };

      // Register user
      act(() => {
        result.current.register(mockUser);
      });

      expect(result.current.userData).toHaveLength(1);

      // Logout
      act(() => {
        result.current.logout();
      });

      expect(result.current.user).toBeNull();
      expect(result.current.token).toBeNull();
      expect(result.current.userData).toHaveLength(1); // userData should remain
    });
  });

});
