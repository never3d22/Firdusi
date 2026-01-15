import React from 'react';
import { FlatList, Modal, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { trpc } from '@/api/trpc';
import { useCart } from '@/providers/CartProvider';

type CartModalProps = {
  visible: boolean;
  onClose: () => void;
};

export const CartModal: React.FC<CartModalProps> = ({ visible, onClose }) => {
  const { bottom } = useSafeAreaInsets();
  const { items, totalCents, increment, decrement, clear } = useCart();

  const createOrder = trpc.public.createOrder.useMutation({
    onSuccess: () => {
      clear();
      onClose();
    }
  });

  const handleCheckout = async () => {
    if (!items.length || createOrder.isPending) return;
    try {
      await createOrder.mutateAsync({
        items: items.map((i) => ({ dishId: i.dishId, qty: i.qty }))
      });
    } catch (e) {
      // keep modal open; error is logged by react-query/trpc in dev
      console.log(e);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View className="flex-1 bg-black/70">
        <TouchableOpacity className="flex-1" activeOpacity={1} onPress={onClose} />

        <View
          className="bg-surface border-t border-surface2 rounded-t-3xl px-5 pt-5"
          style={{ paddingBottom: Math.max(bottom, 16) }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-gold text-xs font-semibold tracking-widest">ВАША КОРЗИНА</Text>
              <Text className="text-white text-2xl font-bold mt-1">Заказ</Text>
            </View>
            <TouchableOpacity onPress={onClose} className="px-4 py-2 rounded-full bg-surface2">
              <Text className="text-white font-semibold">Закрыть</Text>
            </TouchableOpacity>
          </View>

          <FlatList
            data={items}
            keyExtractor={(i) => i.dishId.toString()}
            ListEmptyComponent={<Text className="text-goldSoft">Добавьте блюда из меню</Text>}
            renderItem={({ item }) => (
              <View className="flex-row items-center justify-between bg-bg border border-surface2 rounded-2xl p-4 mb-3">
                <View className="flex-1 pr-3">
                  <Text className="text-white font-semibold text-base">{item.name}</Text>
                  <Text className="text-goldSoft mt-1">{(item.priceCents / 100).toFixed(2)} ₽</Text>
                </View>
                <View className="flex-row items-center">
                  <TouchableOpacity className="px-3 py-2 bg-surface2 rounded-full" onPress={() => decrement(item.dishId)}>
                    <Text className="text-white text-base">−</Text>
                  </TouchableOpacity>
                  <Text className="text-white font-semibold text-base mx-3 w-6 text-center">{item.qty}</Text>
                  <TouchableOpacity className="px-3 py-2 bg-surface2 rounded-full" onPress={() => increment(item.dishId)}>
                    <Text className="text-white text-base">+</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />

          <View className="mt-2 pt-4 border-t border-surface2">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-goldSoft">Итого</Text>
              <Text className="text-white text-xl font-bold">{(totalCents / 100).toFixed(2)} ₽</Text>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                className="flex-1 bg-surface2 rounded-2xl py-4"
                onPress={clear}
                disabled={!items.length || createOrder.isPending}
              >
                <Text className="text-center text-white font-semibold">Очистить</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className="flex-1 bg-gold rounded-2xl py-4"
                onPress={handleCheckout}
                disabled={!items.length || createOrder.isPending}
              >
                <Text className="text-center text-bg font-bold">{createOrder.isPending ? 'Оформляем...' : 'Оформить'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

