import React, { PropsWithChildren } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { httpBatchLink } from '@trpc/client';
import Constants from 'expo-constants';
import { trpc } from '@/api/trpc';
import { useAuth } from '@/hooks/useAuth';

const queryClient = new QueryClient();

const getApiUrl = () => {
  return Constants.expoConfig?.extra?.apiUrl ?? process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/trpc';
};

export const TrpcProvider = ({ children }: PropsWithChildren) => {
  const auth = useAuth();

  const client = React.useMemo(() => {
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: getApiUrl(),
          headers() {
            return auth.accessToken ? { Authorization: `Bearer ${auth.accessToken}` } : {};
          }
        })
      ]
    });
  }, [auth.accessToken]);

  return (
    <trpc.Provider client={client} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};
