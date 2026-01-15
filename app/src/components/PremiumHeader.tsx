import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCart } from '@/providers/CartProvider';

type PremiumHeaderProps = {
  onPressCart: () => void;
};

export const PremiumHeader: React.FC<PremiumHeaderProps> = ({ onPressCart }) => {
  const cart = useCart();
  const count = cart.items.reduce((sum, i) => sum + i.qty, 0);

  return (
    <SafeAreaView edges={['top']} className="bg-bg">
      <View className="px-4 pt-2 pb-3 flex-row items-center justify-between">
        <View>
          <Text className="text-gold text-xs font-semibold tracking-widest">PREMIUM</Text>
          <Text className="text-white text-2xl font-bold">Shawarma Gold</Text>
        </View>

        <TouchableOpacity
          onPress={onPressCart}
          className="relative rounded-2xl px-4 py-3 bg-surface border border-surface2"
          accessibilityRole="button"
          accessibilityLabel="Открыть корзину"
        >
          <Text className="text-gold font-semibold">Корзина</Text>
          {count > 0 ? (
            <View className="absolute -top-2 -right-2 bg-gold rounded-full min-w-[22px] h-[22px] items-center justify-center px-1 border border-bg">
              <Text className="text-bg text-xs font-bold">{count}</Text>
            </View>
          ) : null}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

