'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Gift } from 'lucide-react';
import Image from 'next/image';
import { useCartStore } from '@/store/cartStore';

export default function CartModal() {
  const {
    items,
    isOpen,
    closeCart,
    removeItem,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCartStore();

  const totalPrice = getTotalPrice();
  const totalItems = getTotalItems();
  const deliveryThreshold = 1000;
  const freeDelivery = totalPrice >= deliveryThreshold;
  const deliveryCost = freeDelivery ? 0 : 150;
  const amountToFreeDelivery = deliveryThreshold - totalPrice;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Close on escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeCart();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [closeCart]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-lg bg-dark-800 z-50 flex flex-col shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gold-500/20">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                  <ShoppingBag size={20} className="text-dark-900" />
                </div>
                <div>
                  <h2 className="text-xl font-display font-bold text-white">Корзина</h2>
                  <p className="text-sm text-gray-400">
                    {totalItems} {totalItems === 1 ? 'товар' : totalItems < 5 ? 'товара' : 'товаров'}
                  </p>
                </div>
              </div>
              <button
                onClick={closeCart}
                className="p-2 rounded-full hover:bg-dark-600 transition-colors text-gray-400 hover:text-white"
              >
                <X size={24} />
              </button>
            </div>

            {/* Free Delivery Progress */}
            {!freeDelivery && totalItems > 0 && (
              <div className="px-6 py-4 bg-dark-700/50 border-b border-gold-500/10">
                <div className="flex items-center gap-2 mb-2">
                  <Gift size={16} className="text-gold-500" />
                  <span className="text-sm text-gray-300">
                    До бесплатной доставки: <span className="text-gold-500 font-semibold">{formatPrice(amountToFreeDelivery)} ₽</span>
                  </span>
                </div>
                <div className="h-2 bg-dark-600 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min((totalPrice / deliveryThreshold) * 100, 100)}%` }}
                    className="h-full bg-gold-gradient rounded-full"
                  />
                </div>
              </div>
            )}

            {freeDelivery && totalItems > 0 && (
              <div className="px-6 py-3 bg-emerald-500/10 border-b border-emerald-500/20">
                <div className="flex items-center gap-2 text-emerald-400">
                  <Gift size={16} />
                  <span className="text-sm font-medium">Бесплатная доставка!</span>
                </div>
              </div>
            )}

            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-24 h-24 rounded-full bg-dark-600 flex items-center justify-center mb-4">
                    <ShoppingBag size={40} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">Корзина пуста</h3>
                  <p className="text-gray-400 mb-6">
                    Добавьте что-нибудь вкусное!
                  </p>
                  <button
                    onClick={closeCart}
                    className="btn-secondary px-6 py-3"
                  >
                    Перейти к меню
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.product.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      className="flex gap-4 p-4 bg-dark-700 rounded-xl border border-gold-500/10"
                    >
                      {/* Product Image */}
                      <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-white truncate mb-1">
                          {item.product.name}
                        </h4>
                        <p className="text-sm text-gray-400 mb-2">
                          {item.product.weight}
                        </p>

                        {/* Quantity Controls */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                              className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-500 transition-colors"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="w-8 text-center font-semibold text-white">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                              className="w-8 h-8 rounded-lg bg-dark-600 flex items-center justify-center text-gray-400 hover:text-white hover:bg-dark-500 transition-colors"
                            >
                              <Plus size={16} />
                            </button>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="font-bold text-gold-500">
                              {formatPrice(item.product.price * item.quantity)} ₽
                            </span>
                            <button
                              onClick={() => removeItem(item.product.id)}
                              className="p-1.5 rounded-lg hover:bg-red-500/20 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {/* Clear Cart Button */}
                  <button
                    onClick={clearCart}
                    className="w-full py-3 text-gray-500 hover:text-red-500 text-sm font-medium transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={16} />
                    Очистить корзину
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-gold-500/20 bg-dark-900">
                {/* Summary */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-gray-400">
                    <span>Товары ({totalItems})</span>
                    <span>{formatPrice(totalPrice)} ₽</span>
                  </div>
                  <div className="flex justify-between text-gray-400">
                    <span>Доставка</span>
                    <span className={freeDelivery ? 'text-emerald-400' : ''}>
                      {freeDelivery ? 'Бесплатно' : `${formatPrice(deliveryCost)} ₽`}
                    </span>
                  </div>
                  <div className="divider-gold" />
                  <div className="flex justify-between text-xl font-bold">
                    <span className="text-white">Итого</span>
                    <span className="text-gold-500">
                      {formatPrice(totalPrice + deliveryCost)} ₽
                    </span>
                  </div>
                </div>

                {/* Checkout Button */}
                <motion.button
                  className="w-full btn-primary py-4 rounded-xl text-lg flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Оформить заказ
                  <ArrowRight size={20} />
                </motion.button>

                <p className="text-center text-xs text-gray-500 mt-3">
                  Нажимая кнопку, вы соглашаетесь с условиями оферты
                </p>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
