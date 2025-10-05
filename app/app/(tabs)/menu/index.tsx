import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { trpc } from '@/api/trpc';
import { DishCard } from '@/components/DishCard';
import { useCart } from '@/providers/CartProvider';

export default function MenuScreen() {
  const { data: categories, isLoading } = trpc.public.getCategories.useQuery();
  const cart = useCart();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-gray-50">
        <ActivityIndicator size="large" color="#1E6F9F" />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" contentContainerStyle={{ padding: 16 }}>
      {categories?.map((category) => (
        <View key={category.id} className="mb-8">
          <Text className="text-2xl font-bold mb-4">{category.name}</Text>
          <CategoryDishes categoryId={category.id} />
        </View>
      ))}
    </ScrollView>
  );
}

const CategoryDishes: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const { data, isLoading } = trpc.public.getDishesByCategory.useQuery({ categoryId });
  const cart = useCart();

  if (isLoading) {
    return <ActivityIndicator color="#1E6F9F" />;
  }

  if (!data?.length) {
    return <Text className="text-gray-400">Пока пусто</Text>;
  }

  return (
    <View>
      {data.map((dish) => (
        <DishCard
          key={dish.id}
          name={dish.name}
          description={dish.description}
          priceCents={dish.priceCents}
          imageUrl={dish.imageUrl ?? undefined}
          onAdd={() => cart.addItem({ dishId: dish.id, name: dish.name, priceCents: dish.priceCents })}
        />
      ))}
    </View>
  );
};
