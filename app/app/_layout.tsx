import { Stack } from 'expo-router';
import React from 'react';
import '@/src/utils/i18n';
import { AuthProvider } from '@/providers/AuthProvider';
import { TrpcProvider } from '@/providers/TrpcProvider';
import { CartProvider } from '@/providers/CartProvider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <TrpcProvider>
        <CartProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </CartProvider>
      </TrpcProvider>
    </AuthProvider>
  );
}
