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
    <View className="bg-surface rounded-2xl border border-white/10 mb-4 overflow-hidden shadow-sm">
      <View className="relative">
        <Image
          source={{ uri: imageUrl || 'https://images.unsplash.com/photo-1619860860774-1e7e17397526?w=600&q=80' }}
          style={{ width: '100%', height: 180 }}
          className="opacity-90"
        />
        <View className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-surface to-transparent" />
      </View>
      
      <View className="p-4">
        <View className="flex-row justify-between items-start mb-2">
            <Text className="text-xl font-bold text-white flex-1 mr-2">{name}</Text>
        </View>
        
        {description ? (
            <View className="mb-4">
                 <Text className="text-muted text-sm leading-5">{description}</Text>
                 <View className="flex-row mt-2 flex-wrap gap-1">
                    {/* Mock Ingredients for visuals since we don't have them in props yet */}
                    {['Мясо', 'Соус', 'Овощи'].map((ing, i) => (
                        <View key={i} className="bg-white/5 px-2 py-0.5 rounded border border-white/10">
                            <Text className="text-xs text-gray-400">{ing}</Text>
                        </View>
                    ))}
                 </View>
            </View>
        ) : null}

        <View className="flex-row justify-between items-center mt-2">
          <Text className="text-primary font-bold text-xl">{(priceCents / 100).toFixed(0)} ₽</Text>
          <TouchableOpacity 
            className="bg-primary px-6 py-2.5 rounded-xl active:bg-yellow-600" 
            onPress={onAdd}
          >
            <Text className="text-black font-bold text-sm">В корзину</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
