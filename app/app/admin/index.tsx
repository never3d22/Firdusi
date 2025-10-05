import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/hooks/useAuth';

export default function AdminDashboard() {
  const auth = useAuth();
  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-2">Админ-панель</Text>
      <Text className="text-gray-500 mb-6">{auth.user?.phone}</Text>
      <View className="space-y-4">
        <Link href="/admin/orders" asChild>
          <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-lg font-semibold">Заказы</Text>
            <Text className="text-gray-500">Управление статусами, фильтры, детали</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/catalog" asChild>
          <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-lg font-semibold">Каталог</Text>
            <Text className="text-gray-500">Категории, блюда, изображения</Text>
          </TouchableOpacity>
        </Link>
        <Link href="/admin/settings" asChild>
          <TouchableOpacity className="bg-white rounded-2xl p-5 shadow-sm">
            <Text className="text-lg font-semibold">Настройки ресторана</Text>
            <Text className="text-gray-500">Контакты, режим работы</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}
