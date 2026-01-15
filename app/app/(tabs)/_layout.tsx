import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
// You might want to add icons here later, for now we keep it simple or add generic icons if we had a library
// forcing no icons as per previous code, but styling the bar.

export default function TabsLayout() {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#1A1A1A',
          borderTopColor: '#333',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#D4AF37',
        tabBarInactiveTintColor: '#888888',
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
        }
      }}
    >
      <Tabs.Screen name="menu/index" options={{ title: 'Меню' }} />
      <Tabs.Screen name="cart/index" options={{ title: 'Корзина', href: null }} /> 
      {/* We hide the cart tab since we have a modal cart now, or keep it as backup. 
          href: null hides it from the tab bar but keeps the route accessible. 
          Actually user asked for modal cart, so maybe hide the tab. */}
      <Tabs.Screen name="profile/index" options={{ title: 'Профиль' }} />
    </Tabs>
  );
}
