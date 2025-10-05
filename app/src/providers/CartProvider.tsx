import React, { createContext, useContext, useMemo, useState } from 'react';

type CartItem = {
  dishId: number;
  name: string;
  priceCents: number;
  qty: number;
};

type CartContextValue = {
  items: CartItem[];
  totalCents: number;
  addItem: (item: Omit<CartItem, 'qty'>) => void;
  increment: (dishId: number) => void;
  decrement: (dishId: number) => void;
  clear: () => void;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (item: Omit<CartItem, 'qty'>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.dishId === item.dishId);
      if (existing) {
        return prev.map((i) => (i.dishId === item.dishId ? { ...i, qty: i.qty + 1 } : i));
      }
      return [...prev, { ...item, qty: 1 }];
    });
  };

  const increment = (dishId: number) => {
    setItems((prev) => prev.map((i) => (i.dishId === dishId ? { ...i, qty: i.qty + 1 } : i)));
  };

  const decrement = (dishId: number) => {
    setItems((prev) => prev.flatMap((i) => {
      if (i.dishId !== dishId) return [i];
      if (i.qty <= 1) return [];
      return [{ ...i, qty: i.qty - 1 }];
    }));
  };

  const clear = () => setItems([]);

  const totalCents = useMemo(() => items.reduce((sum, item) => sum + item.priceCents * item.qty, 0), [items]);

  const value = useMemo(() => ({ items, totalCents, addItem, increment, decrement, clear }), [items, totalCents]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('CartContext not available');
  return ctx;
};
