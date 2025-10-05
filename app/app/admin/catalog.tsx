import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { trpc } from '@/api/trpc';

export default function CatalogScreen() {
  const utils = trpc.useUtils();
  const categoriesQuery = trpc.admin.categories.list.useQuery();
  const dishesQuery = trpc.admin.dishes.list.useQuery({});

  const createCategory = trpc.admin.categories.create.useMutation({
    onSuccess: () => utils.admin.categories.list.invalidate()
  });

  const createDish = trpc.admin.dishes.create.useMutation({
    onSuccess: () => utils.admin.dishes.list.invalidate()
  });

  const [categoryName, setCategoryName] = useState('');
  const [dishName, setDishName] = useState('');
  const [dishPrice, setDishPrice] = useState('');
  const [dishCategory, setDishCategory] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-4">Каталог</Text>

      <View className="bg-white rounded-2xl p-4 mb-6 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Новая категория</Text>
        <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Название" value={categoryName} onChangeText={setCategoryName} />
        <TouchableOpacity className="bg-primary rounded-xl py-3" onPress={() => createCategory.mutate({ name: categoryName })}>
          <Text className="text-center text-white">Создать</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-semibold mb-2">Категории</Text>
      <FlatList
        data={categoriesQuery.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity className={`bg-white rounded-2xl p-4 mb-3 shadow-sm ${dishCategory === item.id ? 'border border-primary' : ''}`} onPress={() => setDishCategory(item.id)}>
            <Text className="font-semibold">{item.name}</Text>
            <Text className="text-gray-500">Позиция: {item.position}</Text>
          </TouchableOpacity>
        )}
      />

      <View className="bg-white rounded-2xl p-4 my-6 shadow-sm">
        <Text className="text-lg font-semibold mb-2">Новое блюдо</Text>
        <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Название" value={dishName} onChangeText={setDishName} />
        <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Цена (руб)" keyboardType="numeric" value={dishPrice} onChangeText={setDishPrice} />
        <TouchableOpacity
          className="bg-primary rounded-xl py-3"
          onPress={() => {
            if (!dishCategory) return;
            createDish.mutate({
              name: dishName,
              priceCents: Math.round(parseFloat(dishPrice || '0') * 100),
              categoryId: dishCategory
            });
          }}
        >
          <Text className="text-center text-white">Добавить</Text>
        </TouchableOpacity>
      </View>

      <Text className="text-2xl font-semibold mb-2">Блюда</Text>
      <FlatList
        data={dishesQuery.data}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View className="bg-white rounded-2xl p-4 mb-3 shadow-sm">
            <Text className="font-semibold">{item.name}</Text>
            <Text className="text-gray-500">{(item.priceCents / 100).toFixed(2)} ₽</Text>
          </View>
        )}
      />
    </View>
  );
}
