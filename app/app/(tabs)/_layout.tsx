import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#E6CF7A',
        tabBarStyle: { backgroundColor: '#07070A', borderTopColor: '#14141C' },
        tabBarLabelStyle: { fontWeight: '700' }
      }}
    >
      <Tabs.Screen name="menu/index" options={{ title: 'Меню', tabBarIcon: () => null }} />
      <Tabs.Screen name="cart/index" options={{ title: 'Корзина', tabBarIcon: () => null }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Профиль', tabBarIcon: () => null }} />
    </Tabs>
  );
}
