'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from './store';
import apiClient from './api';

export const useAuth = () => {
  const router = useRouter();
  const { user, accessToken, setUser, setAccessToken, logout } = useAuthStore();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      setAccessToken(token);
    }
  }, [setAccessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiClient.post('/auth/login', { email, password });
      const { user, accessToken } = response.data;

      setUser(user);
      setAccessToken(accessToken);
      localStorage.setItem('accessToken', accessToken);

      router.push('/dashboard');
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed';
      return { success: false, error: message };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      await apiClient.post('/auth/register', { name, email, password });
      return { success: true };
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed';
      return { success: false, error: message };
    }
  };

  const handleLogout = async () => {
    try {
      await apiClient.post('/auth/logout');
      logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
      logout();
      router.push('/login');
    }
  };

  return {
    user,
    accessToken,
    isAuthenticated: !!accessToken,
    login,
    register,
    logout: handleLogout,
  };
};
