import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StatusBar, StyleSheet } from 'react-native';
import { useCart } from '@/providers/CartProvider';
import { trpc } from '@/api/trpc';

const COLORS = {
  background: '#050505',
  surface: '#0F0B08',
  surfaceRaised: '#15110D',
  gold: '#D6B25E',
  goldSoft: '#F5E7B8',
  text: '#F8F5EE',
  muted: '#B9B1A3',
  border: '#2B241A'
};

const formatPrice = (priceCents: number) => `${(priceCents / 100).toFixed(0)} ₽`;

export default function CartScreen() {
  const { items, totalCents, increment, decrement, clear } = useCart();
  const createOrder = trpc.public.createOrder.useMutation({
    onSuccess: () => clear()
  });

  const handleCheckout = async () => {
    if (!items.length || createOrder.isPending) return;
    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({ dishId: item.dishId, qty: item.qty }))
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Корзина</Text>
          <Text style={styles.subtitle}>Ваши премиальные позиции</Text>
        </View>
        <TouchableOpacity onPress={clear} disabled={!items.length} style={styles.clearButton}>
          <Text style={[styles.clearText, !items.length && styles.clearTextDisabled]}>Очистить</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.dishId.toString()}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.itemCard}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              <Text style={styles.itemPrice}>{formatPrice(item.priceCents)}</Text>
            </View>
            <View style={styles.qtyControls}>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => decrement(item.dishId)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.qty}</Text>
              <TouchableOpacity
                style={styles.qtyButton}
                onPress={() => increment(item.dishId)}
                activeOpacity={0.7}
              >
                <Text style={styles.qtyButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>Корзина пуста</Text>
            <Text style={styles.emptyText}>Добавьте блюда из меню</Text>
          </View>
        }
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Итого</Text>
          <Text style={styles.totalValue}>{formatPrice(totalCents)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.checkoutButton, (!items.length || createOrder.isPending) && styles.checkoutButtonDisabled]}
          onPress={handleCheckout}
          disabled={!items.length || createOrder.isPending}
          activeOpacity={0.85}
        >
          <Text style={styles.checkoutButtonText}>
            {createOrder.isPending ? 'Оформляем...' : 'Оформить заказ'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
    padding: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  title: {
    color: COLORS.text,
    fontSize: 26,
    fontWeight: '700'
  },
  subtitle: {
    color: COLORS.muted,
    marginTop: 6
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.border
  },
  clearText: {
    color: COLORS.goldSoft,
    fontSize: 12,
    fontWeight: '600'
  },
  clearTextDisabled: {
    opacity: 0.4
  },
  listContent: {
    paddingBottom: 20
  },
  itemCard: {
    backgroundColor: COLORS.surfaceRaised,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  itemInfo: {
    flex: 1,
    paddingRight: 12
  },
  itemName: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600'
  },
  itemPrice: {
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
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40
  },
  emptyTitle: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700'
  },
  emptyText: {
    color: COLORS.muted,
    marginTop: 6
  },
  footer: {
    marginTop: 'auto'
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14
  },
  totalLabel: {
    color: COLORS.muted
  },
  totalValue: {
    color: COLORS.gold,
    fontSize: 20,
    fontWeight: '700'
  },
  checkoutButton: {
    backgroundColor: COLORS.gold,
    borderRadius: 999,
    paddingVertical: 14,
    alignItems: 'center'
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
