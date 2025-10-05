import { Tabs } from 'expo-router';
import React from 'react';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="menu/index" options={{ title: 'Меню', tabBarIcon: () => null }} />
      <Tabs.Screen name="cart/index" options={{ title: 'Корзина', tabBarIcon: () => null }} />
      <Tabs.Screen name="profile/index" options={{ title: 'Профиль', tabBarIcon: () => null }} />
    </Tabs>
  );
}
