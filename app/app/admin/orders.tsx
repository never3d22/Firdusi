import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { trpc } from '@/api/trpc';

const statuses = ['PENDING', 'PAID', 'COOKING', 'READY', 'DELIVERING', 'DONE', 'CANCELED'] as const;

type Status = typeof statuses[number];

export default function OrdersScreen() {
  const { data: orders, refetch } = trpc.admin.orders.list.useQuery({});
  const updateStatus = trpc.admin.orders.updateStatus.useMutation({ onSuccess: () => refetch() });

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-4">Заказы</Text>
      <FlatList
        data={orders}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
            <Text className="text-lg font-semibold">Заказ #{item.id}</Text>
            <Text className="text-gray-500">Клиент: {item.user?.phone}</Text>
            <Text className="text-gray-500 mb-2">Статус: {item.status}</Text>
            <View className="flex-row flex-wrap gap-2">
              {statuses.map((status) => (
                <TouchableOpacity
                  key={status}
                  className={`px-3 py-2 rounded-full ${item.status === status ? 'bg-primary' : 'bg-gray-200'}`}
                  onPress={() => updateStatus.mutate({ id: item.id, status })}
                >
                  <Text className={item.status === status ? 'text-white font-semibold' : 'text-gray-700'}>{status}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
}
