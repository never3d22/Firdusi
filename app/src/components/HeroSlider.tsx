import React, { useMemo, useRef, useState } from 'react';
import { Animated, Image, ScrollView, Text, useWindowDimensions, View } from 'react-native';

export type HeroSlide = {
  id: string;
  title: string;
  subtitle?: string;
  imageUrl: string;
};

type HeroSliderProps = {
  slides: HeroSlide[];
};

export const HeroSlider: React.FC<HeroSliderProps> = ({ slides }) => {
  const { width } = useWindowDimensions();
  const scrollX = useRef(new Animated.Value(0)).current;
  const [activeIndex, setActiveIndex] = useState(0);

  const dotWidths = useMemo(
    () =>
      slides.map((_, i) =>
        scrollX.interpolate({
          inputRange: [(i - 1) * width, i * width, (i + 1) * width],
          outputRange: [8, 20, 8],
          extrapolate: 'clamp'
        })
      ),
    [scrollX, slides, width]
  );

  return (
    <View className="rounded-3xl overflow-hidden border border-surface2 bg-surface">
      <Animated.ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={Animated.event([{ nativeEvent: { contentOffset: { x: scrollX } } }], { useNativeDriver: false })}
        onMomentumScrollEnd={(e) => {
          const idx = Math.round(e.nativeEvent.contentOffset.x / Math.max(1, width));
          setActiveIndex(Math.min(Math.max(idx, 0), slides.length - 1));
        }}
      >
        {slides.map((slide) => (
          <View key={slide.id} style={{ width }} className="h-44">
            <Image source={{ uri: slide.imageUrl }} style={{ width: '100%', height: '100%' }} />
            <View className="absolute inset-0 bg-black/55" />
            <View className="absolute inset-0 px-5 py-4 justify-end">
              <Text className="text-gold text-xs font-semibold tracking-widest">SHAWARMA GOLD</Text>
              <Text className="text-white text-2xl font-bold mt-1">{slide.title}</Text>
              {slide.subtitle ? <Text className="text-goldSoft mt-1">{slide.subtitle}</Text> : null}
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View className="flex-row items-center justify-center gap-2 py-3 bg-surface">
        {slides.map((s, i) => (
          <Animated.View
            key={s.id}
            style={{
              width: dotWidths[i],
              height: 8,
              borderRadius: 999
            }}
            className={i === activeIndex ? 'bg-gold' : 'bg-surface2'}
          />
        ))}
      </View>
    </View>
  );
};

