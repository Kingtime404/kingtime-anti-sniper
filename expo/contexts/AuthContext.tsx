import createContextHook from '@nkzw/create-context-hook';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useEffect, useCallback } from 'react';

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  createdAt: string;
  balance: number;
  tokensGenerated: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AUTH_STORAGE_KEY = '@crypto_auth';
const USERS_STORAGE_KEY = '@crypto_users';

export const [AuthProvider, useAuth] = createContextHook(() => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });
  const queryClient = useQueryClient();

  const authQuery = useQuery({
    queryKey: ['auth'],
    queryFn: async () => {
      const stored = await AsyncStorage.getItem(AUTH_STORAGE_KEY);
      if (stored) {
        const user = JSON.parse(stored) as User;
        return user;
      }
      return null;
    },
  });

  useEffect(() => {
    if (!authQuery.isLoading) {
      setAuthState({
        user: authQuery.data || null,
        isAuthenticated: !!authQuery.data,
        isLoading: false,
      });
    }
  }, [authQuery.data, authQuery.isLoading]);

  const loginMutation = useMutation({
    mutationFn: async ({ email, password }: { email: string; password: string }) => {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      
      const user = users.find(u => u.email === email && u.password === password);
      if (!user) {
        throw new Error('Invalid email or password');
      }
      
      const { password: _, ...userWithoutPassword } = user;
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      setAuthState({ user, isAuthenticated: true, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async ({ email, password, username, fullName }: { 
      email: string; 
      password: string; 
      username: string;
      fullName: string;
    }) => {
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      
      if (users.find(u => u.email === email)) {
        throw new Error('Email already registered');
      }
      if (users.find(u => u.username === username)) {
        throw new Error('Username already taken');
      }
      
      const newUser: User & { password: string } = {
        id: Date.now().toString(),
        email,
        password,
        username,
        fullName,
        createdAt: new Date().toISOString(),
        balance: 1000,
        tokensGenerated: 0,
      };
      
      users.push(newUser);
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      
      const { password: _, ...userWithoutPassword } = newUser;
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(userWithoutPassword));
      return userWithoutPassword;
    },
    onSuccess: (user) => {
      setAuthState({ user, isAuthenticated: true, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      await AsyncStorage.removeItem(AUTH_STORAGE_KEY);
    },
    onSuccess: () => {
      setAuthState({ user: null, isAuthenticated: false, isLoading: false });
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: async (updates: Partial<User>) => {
      if (!authState.user) throw new Error('No user logged in');
      
      const updatedUser = { ...authState.user, ...updates };
      await AsyncStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(updatedUser));
      
      const usersData = await AsyncStorage.getItem(USERS_STORAGE_KEY);
      const users: (User & { password: string })[] = usersData ? JSON.parse(usersData) : [];
      const userIndex = users.findIndex(u => u.id === authState.user?.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...updates };
        await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      }
      
      return updatedUser;
    },
    onSuccess: (user) => {
      setAuthState(prev => ({ ...prev, user }));
      queryClient.invalidateQueries({ queryKey: ['auth'] });
    },
  });

  const login = useCallback((email: string, password: string) => {
    return loginMutation.mutateAsync({ email, password });
  }, [loginMutation.mutateAsync]);

  const register = useCallback((email: string, password: string, username: string, fullName: string) => {
    return registerMutation.mutateAsync({ email, password, username, fullName });
  }, [registerMutation.mutateAsync]);

  const logout = useCallback(() => {
    return logoutMutation.mutateAsync();
  }, [logoutMutation.mutateAsync]);

  const updateUser = useCallback((updates: Partial<User>) => {
    return updateUserMutation.mutateAsync(updates);
  }, [updateUserMutation.mutateAsync]);

  return {
    ...authState,
    login,
    register,
    logout,
    updateUser,
    isLoginLoading: loginMutation.isPending,
    isRegisterLoading: registerMutation.isPending,
    loginError: loginMutation.error?.message || null,
    registerError: registerMutation.error?.message || null,
  };
});
