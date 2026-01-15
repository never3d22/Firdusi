import React, { useMemo } from 'react';
import { Image, Text, TouchableOpacity, View } from 'react-native';

type DishCardProps = {
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  onAdd: () => void;
};

export const DishCard: React.FC<DishCardProps> = ({ name, description, priceCents, imageUrl, onAdd }) => {
  const ingredients = useMemo(() => {
    const src = (description ?? '').trim();
    if (!src) return [];
    return src
      .split(/[,•\n;]/g)
      .map((s) => s.trim())
      .filter(Boolean)
      .slice(0, 6);
  }, [description]);

  return (
    <View className="bg-surface rounded-3xl border border-surface2 mb-4 overflow-hidden">
      <Image
        source={{ uri: imageUrl || 'https://placehold.co/1200x800/07070A/D4AF37/png?text=Shawarma+Gold' }}
        style={{ width: '100%', height: 160 }}
      />
      <View className="absolute inset-x-0 top-0 h-16 bg-black/45" />
      <View className="p-4">
        <Text className="text-white text-lg font-semibold">{name}</Text>

        {ingredients.length ? (
          <View className="flex-row flex-wrap gap-2 mt-3">
            {ingredients.map((ing) => (
              <View key={ing} className="bg-bg border border-surface2 rounded-full px-3 py-1">
                <Text className="text-goldSoft text-xs">{ing}</Text>
              </View>
            ))}
          </View>
        ) : null}

        <View className="flex-row justify-between items-center mt-4">
          <View>
            <Text className="text-gold text-xl font-bold">{(priceCents / 100).toFixed(2)} ₽</Text>
            <Text className="text-goldSoft text-xs mt-1">Премиум подача</Text>
          </View>
          <TouchableOpacity className="bg-gold px-5 py-3 rounded-full" onPress={onAdd}>
            <Text className="text-bg font-bold">В корзину</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
