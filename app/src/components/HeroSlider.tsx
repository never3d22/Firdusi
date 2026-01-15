import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Image, Dimensions, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

const { width } = Dimensions.get('window');

const SLIDER_DATA = [
  {
    id: 1,
    image: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?w=800&q=80',
    title: 'PREMIUM SHAWARMA',
    subtitle: 'Лучшая в городе'
  },
  {
    id: 2,
    image: 'https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=800&q=80',
    title: 'СВЕЖИЕ ИНГРЕДИЕНТЫ',
    subtitle: 'Только лучшее мясо'
  },
  {
    id: 3,
    image: 'https://images.unsplash.com/photo-1561651823-34febf5a90aa?w=800&q=80',
    title: 'БЫСТРАЯ ДОСТАВКА',
    subtitle: 'Горячая за 30 минут'
  },
];

export const HeroSlider = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const onScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const slideSize = event.nativeEvent.layoutMeasurement.width;
    const index = event.nativeEvent.contentOffset.x / slideSize;
    const roundIndex = Math.round(index);
    if (roundIndex !== activeIndex) {
      setActiveIndex(roundIndex);
    }
  };

  return (
    <View className="relative mb-8 mt-2">
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={onScroll}
        scrollEventThrottle={16}
        className="w-full h-56 rounded-2xl overflow-hidden"
      >
        {SLIDER_DATA.map((item) => (
          <View key={item.id} style={{ width }} className="h-56 relative">
             <Image
              source={{ uri: item.image }}
              className="w-full h-full object-cover"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/50" />
            <View className="absolute bottom-6 left-6 right-6">
                <View className="bg-primary self-start px-3 py-1 rounded mb-2">
                    <Text className="text-black font-bold text-xs uppercase">{item.title}</Text>
                </View>
                <Text className="text-white text-2xl font-bold">{item.subtitle}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
      <View className="flex-row justify-center absolute -bottom-5 w-full gap-2">
        {SLIDER_DATA.map((_, index) => (
          <View
            key={index}
            className={`h-1.5 rounded-full ${
              activeIndex === index ? 'w-6 bg-primary' : 'w-1.5 bg-gray-700'
            }`}
          />
        ))}
      </View>
    </View>
  );
};
