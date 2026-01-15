import React, { useMemo, useState } from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions
} from 'react-native';
import { trpc } from '@/api/trpc';
import { DishCard } from '@/components/DishCard';
import { useCart } from '@/providers/CartProvider';

const COLORS = {
  background: '#050505',
  surface: '#0F0B08',
  surfaceRaised: '#15110D',
  gold: '#D6B25E',
  goldSoft: '#F5E7B8',
  text: '#F8F5EE',
  muted: '#B9B1A3',
  border: '#2B241A',
  overlay: 'rgba(0, 0, 0, 0.7)'
};

type PremiumSlide = {
  id: string;
  title: string;
  subtitle: string;
  price: string;
  badge: string;
  image: string;
};

type PremiumDish = {
  id: number;
  name: string;
  description?: string | null;
  priceCents: number;
  imageUrl?: string | null;
  ingredients?: string[];
};

type MenuCategory = {
  id: number;
  name: string;
  dishes?: PremiumDish[];
};

type CartItem = {
  dishId: number;
  name: string;
  priceCents: number;
  qty: number;
};

const heroSlides: PremiumSlide[] = [
  {
    id: 'noir',
    title: 'Шаурма Noir',
    subtitle: 'Мраморная говядина, трюфельный соус, авторская подача',
    price: 'от 590 ₽',
    badge: 'Signature',
    image: 'https://images.unsplash.com/photo-1606755962773-0c8cf160a0b4?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'gold',
    title: 'Gold Chicken',
    subtitle: 'Сочная курица гриль, чеддер, карамелизированный лук',
    price: 'от 420 ₽',
    badge: 'Best Seller',
    image: 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?auto=format&fit=crop&w=1400&q=80'
  },
  {
    id: 'spice',
    title: 'Spice Royale',
    subtitle: 'Острый перец, свежие травы, гранатовый соус',
    price: 'от 460 ₽',
    badge: 'Hot & Bold',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80'
  }
];

const premiumMenu: MenuCategory[] = [
  {
    id: 9001,
    name: 'Signature Noir',
    dishes: [
      {
        id: 5001,
        name: 'Noir Classic',
        description: 'Тонкий лаваш и мраморная говядина',
        priceCents: 59000,
        imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Говядина премиум', 'Трюфельный соус', 'Рукола', 'Маринованный лук']
      },
      {
        id: 5002,
        name: 'Gold Chicken',
        description: 'Сочная курица гриль с золотой корочкой',
        priceCents: 48000,
        imageUrl: 'https://images.unsplash.com/photo-1605475129393-3f1f0b9d453a?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Курица гриль', 'Чеддер', 'Карамелизированный лук', 'Соус Gold']
      },
      {
        id: 5003,
        name: 'Spice Royale',
        description: 'Пряный характер и насыщенный вкус',
        priceCents: 52000,
        imageUrl: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Говядина', 'Острый перец', 'Травы', 'Гранатовый соус']
      }
    ]
  },
  {
    id: 9002,
    name: 'Классика',
    dishes: [
      {
        id: 5101,
        name: 'Классика куриная',
        description: 'Нежная курица и свежие овощи',
        priceCents: 36000,
        imageUrl: 'https://images.unsplash.com/photo-1626074353765-517f2d208f44?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Курица гриль', 'Огурец', 'Томат', 'Чесночный соус']
      },
      {
        id: 5102,
        name: 'Original Beef',
        description: 'Сочный ростбиф и хрустящий лук',
        priceCents: 41000,
        imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Ростбиф', 'Красный лук', 'Айсберг', 'Фирменный соус']
      },
      {
        id: 5103,
        name: 'Cheese Deluxe',
        description: 'Сырное удовольствие и мягкая остринка',
        priceCents: 43000,
        imageUrl: 'https://images.unsplash.com/photo-1526318896980-cf78c088247c?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Курица', 'Сливочный сыр', 'Паприка', 'Соус барбекю']
      }
    ]
  },
  {
    id: 9003,
    name: 'Легкая линия',
    dishes: [
      {
        id: 5201,
        name: 'Green Harmony',
        description: 'Свежесть салатов и легкий йогуртовый соус',
        priceCents: 34000,
        imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Зелень', 'Огурец', 'Томат', 'Йогуртовый соус']
      },
      {
        id: 5202,
        name: 'Veggie Gold',
        description: 'Запеченные овощи и ароматные травы',
        priceCents: 36000,
        imageUrl: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=1400&q=80',
        ingredients: ['Цукини', 'Баклажан', 'Перец', 'Соус тахини']
      }
    ]
  }
];

const fallbackIngredients = ['Курица гриль', 'Свежие овощи', 'Фирменный соус', 'Тонкий лаваш'];

const formatPrice = (priceCents: number) => `${(priceCents / 100).toFixed(0)} ₽`;

const splitIngredients = (description?: string | null) => {
  if (!description) return [];
  return description
    .split(/[,•\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
};

const getDishPresentation = (dish: PremiumDish) => {
  const shouldUseTagline = Boolean(dish.description) && !/[,•\n]/.test(dish.description ?? '');
  const tagline = shouldUseTagline ? dish.description ?? undefined : undefined;
  let ingredients = dish.ingredients?.length ? dish.ingredients : splitIngredients(dish.description);
  if (!ingredients.length) {
    ingredients = fallbackIngredients;
  }
  return { tagline, ingredients };
};

const getItemLabel = (count: number) => {
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 === 1 && mod100 !== 11) return 'позиция';
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) return 'позиции';
  return 'позиций';
};

export default function MenuScreen() {
  const { data: categories, isLoading } = trpc.public.getCategories.useQuery();
  const { items, totalCents, increment, decrement, clear } = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const createOrder = trpc.public.createOrder.useMutation({
    onSuccess: () => clear()
  });

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.qty, 0), [items]);
  const menuCategories = useMemo(
    () => (categories?.length ? categories : premiumMenu) as MenuCategory[],
    [categories]
  );
  const isLoadingCategories = isLoading && !categories?.length;

  const handleCheckout = async () => {
    if (!items.length || createOrder.isPending) return;
    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({ dishId: item.dishId, qty: item.qty }))
      });
      setIsCartOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.eyebrow}>Премиальная шаурма</Text>
              <Text style={styles.brand}>Firdusi Noir</Text>
              <Text style={styles.subhead}>Черное золото с восточным характером</Text>
            </View>
            <TouchableOpacity style={styles.headerCartButton} onPress={() => setIsCartOpen(true)}>
              <Text style={styles.headerCartCount}>{totalItems}</Text>
              <Text style={styles.headerCartLabel}>{getItemLabel(totalItems)}</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.headerBadges}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Доставка 30 минут</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Рейтинг 4.9</Text>
            </View>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Премиальная свежесть</Text>
            </View>
          </View>
        </View>

        <HeroSlider slides={heroSlides} />

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Меню</Text>
          <Text style={styles.sectionSubtitle}>Выберите идеальную комбинацию вкуса</Text>
        </View>

        {isLoadingCategories ? (
          <View style={styles.loadingBlock}>
            <ActivityIndicator color={COLORS.gold} />
            <Text style={styles.loadingText}>Готовим меню...</Text>
          </View>
        ) : (
          menuCategories.map((category) => (
            <View key={category.id} style={styles.categoryBlock}>
              <View style={styles.categoryHeader}>
                <Text style={styles.categoryTitle}>{category.name}</Text>
                <View style={styles.categoryLine} />
              </View>
              <CategoryDishes categoryId={category.id} fallbackDishes={category.dishes} />
            </View>
          ))
        )}
      </ScrollView>

      <CartFloatingButton
        visible={totalItems > 0}
        totalItems={totalItems}
        totalCents={totalCents}
        onPress={() => setIsCartOpen(true)}
      />

      <CartModal
        visible={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={items}
        totalCents={totalCents}
        onIncrement={increment}
        onDecrement={decrement}
        onCheckout={handleCheckout}
        isCheckingOut={createOrder.isPending}
      />
    </View>
  );
}

const HeroSlider: React.FC<{ slides: PremiumSlide[] }> = ({ slides }) => {
  const { width } = useWindowDimensions();
  const slideWidth = Math.min(width - 32, 420);

  return (
    <View style={styles.sliderContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={slideWidth + 16}
        snapToAlignment="start"
        contentContainerStyle={styles.sliderContent}
      >
        {slides.map((slide, index) => (
          <ImageBackground
            key={slide.id}
            source={{ uri: slide.image }}
            style={[
              styles.slide,
              {
                width: slideWidth,
                marginRight: index === slides.length - 1 ? 0 : 16
              }
            ]}
            imageStyle={styles.slideImage}
          >
            <View style={styles.slideOverlay} />
            <View style={styles.slideContent}>
              <Text style={styles.slideBadge}>{slide.badge}</Text>
              <Text style={styles.slideTitle}>{slide.title}</Text>
              <Text style={styles.slideSubtitle}>{slide.subtitle}</Text>
              <View style={styles.slideFooter}>
                <Text style={styles.slidePrice}>{slide.price}</Text>
                <View style={styles.slideCta}>
                  <Text style={styles.slideCtaText}>Заказать</Text>
                </View>
              </View>
            </View>
          </ImageBackground>
        ))}
      </ScrollView>
    </View>
  );
};

const CategoryDishes: React.FC<{ categoryId: number; fallbackDishes?: PremiumDish[] }> = ({
  categoryId,
  fallbackDishes
}) => {
  const cart = useCart();
  const hasFallback = Boolean(fallbackDishes?.length);
  const { data, isLoading } = trpc.public.getDishesByCategory.useQuery(
    { categoryId },
    { enabled: !hasFallback }
  );

  const dishes = hasFallback ? fallbackDishes ?? [] : data ?? [];

  if (isLoading && !hasFallback) {
    return <ActivityIndicator color={COLORS.gold} />;
  }

  if (!dishes.length) {
    return <Text style={styles.emptyText}>Пока пусто</Text>;
  }

  return (
    <View>
      {dishes.map((dish) => {
        const { ingredients, tagline } = getDishPresentation(dish);
        return (
          <DishCard
            key={dish.id}
            name={dish.name}
            description={tagline}
            ingredients={ingredients}
            priceCents={dish.priceCents}
            imageUrl={dish.imageUrl ?? undefined}
            onAdd={() => cart.addItem({ dishId: dish.id, name: dish.name, priceCents: dish.priceCents })}
          />
        );
      })}
    </View>
  );
};

type CartModalProps = {
  visible: boolean;
  onClose: () => void;
  items: CartItem[];
  totalCents: number;
  onIncrement: (dishId: number) => void;
  onDecrement: (dishId: number) => void;
  onCheckout: () => void;
  isCheckingOut: boolean;
};

const CartModal: React.FC<CartModalProps> = ({
  visible,
  onClose,
  items,
  totalCents,
  onIncrement,
  onDecrement,
  onCheckout,
  isCheckingOut
}) => {
  return (
    <Modal transparent visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <Pressable style={styles.modalBackdrop} onPress={onClose} />
        <View style={styles.modalPanel}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Корзина</Text>
              <Text style={styles.modalSubtitle}>Премиальная доставка</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.modalCloseButton}>
              <Text style={styles.modalCloseText}>Закрыть</Text>
            </TouchableOpacity>
          </View>

          {items.length ? (
            <ScrollView
              style={styles.modalList}
              contentContainerStyle={styles.modalListContent}
              showsVerticalScrollIndicator={false}
            >
              {items.map((item) => (
                <View key={item.dishId} style={styles.cartRow}>
                  <View style={styles.cartRowInfo}>
                    <Text style={styles.cartRowName}>{item.name}</Text>
                    <Text style={styles.cartRowPrice}>{formatPrice(item.priceCents)}</Text>
                  </View>
                  <View style={styles.qtyControls}>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onDecrement(item.dishId)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyButtonText}>-</Text>
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{item.qty}</Text>
                    <TouchableOpacity
                      style={styles.qtyButton}
                      onPress={() => onIncrement(item.dishId)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.qtyButtonText}>+</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </ScrollView>
          ) : (
            <View style={styles.cartEmpty}>
              <Text style={styles.cartEmptyTitle}>Корзина пуста</Text>
              <Text style={styles.cartEmptyText}>Выберите шаурму из меню</Text>
            </View>
          )}

          <View style={styles.modalFooter}>
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Итого</Text>
              <Text style={styles.totalValue}>{formatPrice(totalCents)}</Text>
            </View>
            <Text style={styles.totalHint}>Бесплатная доставка от 1200 ₽</Text>
            <TouchableOpacity
              style={[styles.checkoutButton, (!items.length || isCheckingOut) && styles.checkoutButtonDisabled]}
              onPress={onCheckout}
              disabled={!items.length || isCheckingOut}
              activeOpacity={0.85}
            >
              <Text style={styles.checkoutButtonText}>
                {isCheckingOut ? 'Оформляем...' : 'Оформить заказ'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

type CartFloatingButtonProps = {
  visible: boolean;
  totalItems: number;
  totalCents: number;
  onPress: () => void;
};

const CartFloatingButton: React.FC<CartFloatingButtonProps> = ({ visible, totalItems, totalCents, onPress }) => {
  if (!visible) return null;

  return (
    <TouchableOpacity style={styles.cartFab} onPress={onPress} activeOpacity={0.9}>
      <View>
        <Text style={styles.cartFabTitle}>
          Корзина · {totalItems} {getItemLabel(totalItems)}
        </Text>
        <Text style={styles.cartFabSubtitle}>Открыть модальную корзину</Text>
      </View>
      <Text style={styles.cartFabPrice}>{formatPrice(totalCents)}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background
  },
  scrollContent: {
    paddingBottom: 140
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  eyebrow: {
    color: COLORS.goldSoft,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontSize: 11
  },
  brand: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '700',
    marginTop: 6
  },
  subhead: {
    color: COLORS.muted,
    marginTop: 6,
    maxWidth: 240
  },
  headerCartButton: {
    backgroundColor: COLORS.surface,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    alignItems: 'center'
  },
  headerCartCount: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '700'
  },
  headerCartLabel: {
    color: COLORS.muted,
    fontSize: 12
  },
  headerBadges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
  },
  badge: {
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
    marginBottom: 8
  },
  badgeText: {
    color: COLORS.goldSoft,
    fontSize: 12
  },
  sliderContainer: {
    paddingBottom: 8
  },
  sliderContent: {
    paddingHorizontal: 16
  },
  slide: {
    height: 200,
    borderRadius: 24,
    overflow: 'hidden',
    justifyContent: 'flex-end'
  },
  slideImage: {
    borderRadius: 24
  },
  slideOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.overlay
  },
  slideContent: {
    padding: 16
  },
  slideBadge: {
    color: COLORS.goldSoft,
    textTransform: 'uppercase',
    fontSize: 11,
    letterSpacing: 1
  },
  slideTitle: {
    color: COLORS.text,
    fontSize: 22,
    fontWeight: '700',
    marginTop: 6
  },
  slideSubtitle: {
    color: COLORS.muted,
    marginTop: 6
  },
  slideFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14
  },
  slidePrice: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '700'
  },
  slideCta: {
    backgroundColor: COLORS.gold,
    borderRadius: 999,
    paddingHorizontal: 16,
    paddingVertical: 8
  },
  slideCtaText: {
    color: COLORS.background,
    fontWeight: '700'
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginTop: 24,
    marginBottom: 12
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 24,
    fontWeight: '700'
  },
  sectionSubtitle: {
    color: COLORS.muted,
    marginTop: 6
  },
  loadingBlock: {
    alignItems: 'center',
    paddingVertical: 24
  },
  loadingText: {
    color: COLORS.muted,
    marginTop: 8
  },
  categoryBlock: {
    paddingHorizontal: 16,
    marginBottom: 24
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  categoryTitle: {
    color: COLORS.goldSoft,
    fontSize: 18,
    fontWeight: '700'
  },
  categoryLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
    marginLeft: 12
  },
  emptyText: {
    color: COLORS.muted
  },
  cartFab: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 18,
    backgroundColor: COLORS.gold,
    borderRadius: 999,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6
  },
  cartFabTitle: {
    color: COLORS.background,
    fontWeight: '700'
  },
  cartFabSubtitle: {
    color: '#3B2C0B',
    fontSize: 12,
    marginTop: 2
  },
  cartFabPrice: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '800'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: COLORS.overlay,
    justifyContent: 'flex-end'
  },
  modalBackdrop: {
    flex: 1
  },
  modalPanel: {
    backgroundColor: COLORS.surfaceRaised,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 20,
    maxHeight: '85%'
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700'
  },
  modalSubtitle: {
    color: COLORS.muted,
    marginTop: 4
  },
  modalCloseButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  modalCloseText: {
    color: COLORS.goldSoft,
    fontSize: 12
  },
  modalList: {
    maxHeight: 280
  },
  modalListContent: {
    paddingBottom: 8
  },
  cartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border
  },
  cartRowInfo: {
    flex: 1,
    paddingRight: 12
  },
  cartRowName: {
    color: COLORS.text,
    fontWeight: '600'
  },
  cartRowPrice: {
    color: COLORS.muted,
    marginTop: 4
  },
  qtyControls: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  qtyButton: {
    width: 32,
    height: 32,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center'
  },
  qtyButtonText: {
    color: COLORS.goldSoft,
    fontSize: 16,
    fontWeight: '700'
  },
  qtyText: {
    color: COLORS.text,
    fontWeight: '700',
    marginHorizontal: 10
  },
  cartEmpty: {
    alignItems: 'center',
    paddingVertical: 24
  },
  cartEmptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  cartEmptyText: {
    color: COLORS.muted,
    marginTop: 6
  },
  modalFooter: {
    marginTop: 12
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  totalLabel: {
    color: COLORS.muted
  },
  totalValue: {
    color: COLORS.gold,
    fontSize: 18,
    fontWeight: '700'
  },
  totalHint: {
    color: COLORS.muted,
    marginTop: 6
  },
  checkoutButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 16
  },
  checkoutButtonDisabled: {
    opacity: 0.6
  },
  checkoutButtonText: {
    color: COLORS.background,
    fontSize: 16,
    fontWeight: '700'
  }
});
