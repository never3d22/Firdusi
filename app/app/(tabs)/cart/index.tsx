import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useCart } from '@/providers/CartProvider';
import { trpc } from '@/api/trpc';
import { useAuth } from '@/hooks/useAuth';

export default function CartScreen() {
  const { items, totalCents, increment, decrement, clear } = useCart();
  const auth = useAuth();
  const createOrder = trpc.public.createOrder.useMutation({
    onSuccess: () => clear()
  });

  const handleCheckout = async () => {
    if (!items.length) return;
    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({ dishId: item.dishId, qty: item.qty }))
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-2xl font-bold mb-4">Корзина</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.dishId.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <View>
              <Text className="font-semibold text-lg">{item.name}</Text>
              <Text className="text-gray-500">{(item.priceCents / 100).toFixed(2)} ₽</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="px-3 py-1 bg-gray-200 rounded-full mr-3" onPress={() => decrement(item.dishId)}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text className="text-lg">{item.qty}</Text>
              <TouchableOpacity className="px-3 py-1 bg-gray-200 rounded-full ml-3" onPress={() => increment(item.dishId)}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-gray-400">Добавьте блюда из меню</Text>}
      />
      <View className="mt-auto">
        <Text className="text-xl font-bold mb-4">Итого: {(totalCents / 100).toFixed(2)} ₽</Text>
        <TouchableOpacity className="bg-primary rounded-2xl py-4" onPress={handleCheckout} disabled={!items.length || createOrder.isPending}>
          <Text className="text-center text-white text-lg font-semibold">
            {createOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
