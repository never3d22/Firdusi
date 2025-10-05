import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useAuth } from '@/hooks/useAuth';
import { trpc } from '@/api/trpc';

export default function ProfileScreen() {
  const auth = useAuth();
  const { data: orders } = trpc.public.getMyOrders.useQuery(undefined, { enabled: !!auth.user });
  const { data: addresses } = trpc.public.getMyAddresses.useQuery(undefined, { enabled: !!auth.user });

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-2">{auth.user?.name || 'Гость'}</Text>
      <Text className="text-gray-500 mb-6">{auth.user?.phone}</Text>
      <TouchableOpacity className="bg-gray-900 rounded-2xl py-3 mb-6" onPress={auth.signOut}>
        <Text className="text-center text-white text-base">Выйти</Text>
      </TouchableOpacity>

      <Text className="text-2xl font-semibold mb-3">Адреса</Text>
      <FlatList
        data={addresses}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="font-semibold">{item.label}</Text>
            <Text className="text-gray-500">{item.street}, {item.city}</Text>
            {item.comment ? <Text className="text-gray-400 mt-1">{item.comment}</Text> : null}
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-400 mb-4">Добавьте адрес при оформлении заказа</Text>}
      />

      <Text className="text-2xl font-semibold mt-6 mb-3">История заказов</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="font-semibold">Заказ #{item.id}</Text>
            <Text className="text-gray-500">{new Date(item.createdAt).toLocaleString()}</Text>
            <Text className="text-primary font-bold mt-2">{(item.totalCents / 100).toFixed(2)} ₽</Text>
            <Text className="text-gray-500">Статус: {item.status}</Text>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-400">Заказы еще не оформлялись</Text>}
      />
    </View>
  );
}
