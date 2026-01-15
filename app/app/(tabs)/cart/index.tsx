import React from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useCart } from '@/providers/CartProvider';
import { trpc } from '@/api/trpc';

export default function CartScreen() {
  const { items, totalCents, increment, decrement, clear } = useCart();
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
    <View className="flex-1 bg-bg p-6">
      <Text className="text-gold text-xs font-semibold tracking-widest">ВАША КОРЗИНА</Text>
      <Text className="text-white text-3xl font-bold mt-1 mb-4">Корзина</Text>
      <FlatList
        data={items}
        keyExtractor={(item) => item.dishId.toString()}
        renderItem={({ item }) => (
          <View className="flex-row justify-between items-center bg-surface border border-surface2 rounded-2xl p-4 mb-3">
            <View>
              <Text className="text-white font-semibold text-lg">{item.name}</Text>
              <Text className="text-goldSoft">{(item.priceCents / 100).toFixed(2)} ₽</Text>
            </View>
            <View className="flex-row items-center">
              <TouchableOpacity className="px-3 py-2 bg-surface2 rounded-full mr-3" onPress={() => decrement(item.dishId)}>
                <Text className="text-white">−</Text>
              </TouchableOpacity>
              <Text className="text-white text-lg font-semibold">{item.qty}</Text>
              <TouchableOpacity className="px-3 py-2 bg-surface2 rounded-full ml-3" onPress={() => increment(item.dishId)}>
                <Text className="text-white">+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text className="text-goldSoft">Добавьте блюда из меню</Text>}
      />
      <View className="mt-auto">
        <Text className="text-white text-xl font-bold mb-4">Итого: {(totalCents / 100).toFixed(2)} ₽</Text>
        <TouchableOpacity className="bg-gold rounded-2xl py-4" onPress={handleCheckout} disabled={!items.length || createOrder.isPending}>
          <Text className="text-center text-bg text-lg font-bold">
            {createOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
