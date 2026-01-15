import React from 'react';
import { ScrollView, View, Text, ActivityIndicator, SafeAreaView, StatusBar } from 'react-native';
import { trpc } from '@/api/trpc';
import { DishCard } from '@/components/DishCard';
import { useCart } from '@/providers/CartProvider';
import { HeroSlider } from '@/components/HeroSlider';
import { CartModal } from '@/components/CartModal';

export default function MenuScreen() {
  const { data: categories, isLoading } = trpc.public.getCategories.useQuery();
  const cart = useCart();

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-dark">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-dark">
      <StatusBar barStyle="light-content" backgroundColor="#121212" />
      <View className="flex-1 relative">
        <ScrollView 
            className="flex-1 bg-dark" 
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
        >
          {/* Header Area */}
          <View className="px-4 py-4 flex-row justify-between items-center">
            <View>
                <Text className="text-primary font-bold text-xs tracking-widest uppercase mb-1">Premium Street Food</Text>
                <Text className="text-white text-3xl font-extrabold">SHAWARMA</Text>
            </View>
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                 <Text className="text-black font-bold">S</Text>
            </View>
          </View>

          <HeroSlider />
          
          <View className="px-4">
            {categories?.map((category) => (
                <View key={category.id} className="mb-8">
                <Text className="text-2xl font-bold mb-4 text-white pl-1 border-l-4 border-primary">{category.name}</Text>
                <CategoryDishes categoryId={category.id} />
                </View>
            ))}
          </View>
        </ScrollView>
        
        <CartModal />
      </View>
    </SafeAreaView>
  );
}

const CategoryDishes: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const { data, isLoading } = trpc.public.getDishesByCategory.useQuery({ categoryId });
  const cart = useCart();

  if (isLoading) {
    return <ActivityIndicator color="#D4AF37" />;
  }

  if (!data?.length) {
    return <Text className="text-gray-600 italic ml-2">В этой категории пока нет товаров</Text>;
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
