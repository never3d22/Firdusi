import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { trpc } from '@/api/trpc';

type User = {
  id: number;
  phone: string;
  name?: string | null;
  role: 'CUSTOMER' | 'ADMIN';
};

type AuthContextValue = {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  loading: boolean;
  signIn: (data: { user: User; accessToken: string; refreshToken: string }) => Promise<void>;
  signOut: () => Promise<void>;
  refresh: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ACCESS_TOKEN_KEY = 'codex:accessToken';
const REFRESH_TOKEN_KEY = 'codex:refreshToken';
const USER_KEY = 'codex:user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const bootstrap = async () => {
      try {
        const storedUser = await AsyncStorage.getItem(USER_KEY);
        const storedAccess = await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
        const storedRefresh = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
        if (storedUser && storedAccess && storedRefresh) {
          setUser(JSON.parse(storedUser));
          setAccessToken(storedAccess);
          setRefreshToken(storedRefresh);
        }
      } finally {
        setLoading(false);
      }
    };
    bootstrap();
  }, []);

  useEffect(() => {
    if (!loading) {
      void refresh();
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  const refresh = async () => {
    if (!refreshToken) return;
    try {
      const result = await trpc.public.refreshSession.mutate({ refreshToken });
      setAccessToken(result.accessToken);
      setRefreshToken(result.refreshToken);
      await AsyncStorage.setItem(ACCESS_TOKEN_KEY, result.accessToken);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, result.refreshToken);
    } catch (error) {
      await signOut();
    }
  };

  const signIn = async (data: { user: User; accessToken: string; refreshToken: string }) => {
    setUser(data.user);
    setAccessToken(data.accessToken);
    setRefreshToken(data.refreshToken);
    await AsyncStorage.multiSet([[USER_KEY, JSON.stringify(data.user)], [ACCESS_TOKEN_KEY, data.accessToken]]);
    await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, data.refreshToken);
  };

  const signOut = async () => {
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    await AsyncStorage.multiRemove([USER_KEY, ACCESS_TOKEN_KEY]);
    await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
  };

  const value = useMemo<AuthContextValue>(() => ({ user, accessToken, refreshToken, loading, signIn, signOut, refresh }), [user, accessToken, refreshToken, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('AuthContext not available');
  return ctx;
};
