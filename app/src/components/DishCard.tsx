import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';

type DishCardProps = {
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  onAdd: () => void;
};

export const DishCard: React.FC<DishCardProps> = ({ name, description, priceCents, imageUrl, onAdd }) => {
  return (
    <View className="bg-white rounded-2xl shadow-sm border border-gray-100 mb-4 overflow-hidden">
      <Image
        source={{ uri: imageUrl || 'https://placehold.co/600x400?text=Codex' }}
        style={{ width: '100%', height: 160 }}
      />
      <View className="p-4">
        <Text className="text-lg font-semibold mb-1">{name}</Text>
        {description ? <Text className="text-gray-500 mb-2">{description}</Text> : null}
        <View className="flex-row justify-between items-center">
          <Text className="text-primary font-bold text-base">{(priceCents / 100).toFixed(2)} ₽</Text>
          <TouchableOpacity className="bg-primary px-4 py-2 rounded-full" onPress={onAdd}>
            <Text className="text-white font-medium">В корзину</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
