import React, { useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { trpc } from '@/api/trpc';
import { DishCard } from '@/components/DishCard';
import { CartModal } from '@/components/CartModal';
import { HeroSlider } from '@/components/HeroSlider';
import { PremiumHeader } from '@/components/PremiumHeader';
import { useCart } from '@/providers/CartProvider';

export default function MenuScreen() {
  const { data: categories, isLoading } = trpc.public.getCategories.useQuery();
  const [cartOpen, setCartOpen] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 justify-center items-center bg-bg">
        <ActivityIndicator size="large" color="#D4AF37" />
      </View>
    );
  }

  const heroSlides = useMemo(
    () => [
      {
        id: 's1',
        title: 'Премиум шаурма',
        subtitle: 'Сочный мясной вкус в золоте',
        imageUrl: 'https://placehold.co/1400x600/07070A/D4AF37/png?text=SHAWARMA+GOLD'
      },
      {
        id: 's2',
        title: 'Только свежие ингредиенты',
        subtitle: 'Лаваш, соусы, овощи — каждый день',
        imageUrl: 'https://placehold.co/1400x600/0E0E13/E6CF7A/png?text=FRESH+INGREDIENTS'
      },
      {
        id: 's3',
        title: 'Быстро и красиво',
        subtitle: 'Заказ в пару кликов — и готово',
        imageUrl: 'https://placehold.co/1400x600/14141C/D4AF37/png?text=FAST+ORDER'
      }
    ],
    []
  );

  return (
    <View className="flex-1 bg-bg">
      <PremiumHeader onPressCart={() => setCartOpen(true)} />

      <ScrollView className="flex-1" contentContainerStyle={{ padding: 16, paddingBottom: 32 }}>
        <HeroSlider slides={heroSlides} />

        <View className="mt-8">
          <Text className="text-gold text-xs font-semibold tracking-widest">МЕНЮ</Text>
          <Text className="text-white text-3xl font-bold mt-1">Выберите свою шаурму</Text>
          <Text className="text-goldSoft mt-2">
            Карточки с ингредиентами, добавление в корзину и оформление — всё на месте.
          </Text>
        </View>

        <View className="mt-8">
          {categories?.map((category) => (
            <View key={category.id} className="mb-10">
              <Text className="text-white text-2xl font-bold">{category.name}</Text>
              <View className="h-[2px] w-16 bg-gold mt-3 mb-5 rounded-full" />
              <CategoryDishes categoryId={category.id} />
            </View>
          ))}
        </View>
      </ScrollView>

      <CartModal visible={cartOpen} onClose={() => setCartOpen(false)} />
    </View>
  );
}

const CategoryDishes: React.FC<{ categoryId: number }> = ({ categoryId }) => {
  const { data, isLoading } = trpc.public.getDishesByCategory.useQuery({ categoryId });
  const cart = useCart();

  if (isLoading) {
    return <ActivityIndicator color="#D4AF37" />;
  }

  if (!data?.length) {
    return <Text className="text-goldSoft">Пока пусто</Text>;
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
