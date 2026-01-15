import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, ScrollView, Dimensions } from 'react-native';
import { useCart } from '@/providers/CartProvider';

const { height } = Dimensions.get('window');

export const CartModal = () => {
  const { items, totalCents, increment, decrement, clear } = useCart();
  const [visible, setVisible] = useState(false);
  
  // A helper to expose the modal opening logic or we can just use a floating button
  // For this task, "modal cart" usually implies a button opens it, or it appears when adding items.
  // I will make it a floating bar at the bottom that opens the full modal.
  
  if (items.length === 0) return null;

  return (
    <>
      <TouchableOpacity 
        onPress={() => setVisible(true)}
        className="absolute bottom-6 left-4 right-4 bg-primary p-4 rounded-xl flex-row justify-between items-center shadow-lg shadow-black/50 z-50"
      >
        <View className="flex-row items-center gap-2">
            <View className="bg-black/20 w-8 h-8 rounded-full items-center justify-center">
                <Text className="text-black font-bold">{items.reduce((acc, i) => acc + i.qty, 0)}</Text>
            </View>
            <Text className="text-black font-bold text-lg">Корзина</Text>
        </View>
        <Text className="text-black font-bold text-lg">{(totalCents / 100).toFixed(0)} ₽</Text>
      </TouchableOpacity>

      <Modal
        animationType="slide"
        transparent={true}
        visible={visible}
        onRequestClose={() => setVisible(false)}
      >
        <View className="flex-1 bg-black/80 justify-end">
            <TouchableOpacity className="flex-1" onPress={() => setVisible(false)} />
            <View className="bg-surface rounded-t-3xl border-t border-white/10 h-[80%] w-full flex-col">
                <View className="p-4 border-b border-white/5 flex-row justify-between items-center">
                    <Text className="text-2xl font-bold text-white">Ваш заказ</Text>
                    <TouchableOpacity onPress={() => setVisible(false)} className="bg-white/5 p-2 rounded-full">
                        <Text className="text-white text-lg font-bold px-2">✕</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView className="flex-1 p-4">
                    {items.map((item) => (
                        <View key={item.dishId} className="flex-row justify-between items-center py-4 border-b border-white/5">
                            <View className="flex-1">
                                <Text className="text-white font-bold text-lg mb-1">{item.name}</Text>
                                <Text className="text-primary font-medium">{(item.priceCents / 100).toFixed(0)} ₽</Text>
                            </View>
                            <View className="flex-row items-center bg-white/5 rounded-lg border border-white/10">
                                <TouchableOpacity 
                                    onPress={() => decrement(item.dishId)}
                                    className="p-3 border-r border-white/10"
                                >
                                    <Text className="text-white font-bold text-lg">-</Text>
                                </TouchableOpacity>
                                <Text className="text-white font-bold text-lg w-10 text-center">{item.qty}</Text>
                                <TouchableOpacity 
                                    onPress={() => increment(item.dishId)}
                                    className="p-3 border-l border-white/10"
                                >
                                    <Text className="text-white font-bold text-lg">+</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))}
                </ScrollView>

                <View className="p-6 bg-surface border-t border-white/10 safe-area-bottom">
                    <View className="flex-row justify-between items-center mb-6">
                        <Text className="text-gray-400 text-lg">Итого</Text>
                        <Text className="text-white font-bold text-3xl">{(totalCents / 100).toFixed(0)} ₽</Text>
                    </View>
                    <TouchableOpacity className="bg-primary py-4 rounded-xl items-center shadow-lg active:bg-yellow-600 mb-4">
                        <Text className="text-black font-extrabold text-lg uppercase tracking-wider">Оформить заказ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
      </Modal>
    </>
  );
};
