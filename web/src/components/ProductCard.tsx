'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Minus, ShoppingBag, Flame, Sparkles } from 'lucide-react';
import Image from 'next/image';
import type { Product } from '@/data/products';
import { useCartStore } from '@/store/cartStore';

interface ProductCardProps {
  product: Product;
  index: number;
}

export default function ProductCard({ product, index }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [localQuantity, setLocalQuantity] = useState(0);
  const { addItem, openCart } = useCartStore();

  const handleAddToCart = () => {
    addItem(product);
    setLocalQuantity((prev) => prev + 1);
    
    // Reset animation after delay
    setTimeout(() => {
      setLocalQuantity(0);
    }, 2000);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('ru-RU').format(price);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="card-premium card-hover-effect group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
        
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900 via-transparent to-transparent opacity-60" />
        
        {/* Badges */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          {product.isPopular && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="px-3 py-1 bg-gold-500 text-dark-900 text-xs font-bold rounded-full flex items-center gap-1"
            >
              <Flame size={12} /> Хит
            </motion.span>
          )}
          {product.isNew && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="px-3 py-1 bg-emerald-500 text-white text-xs font-bold rounded-full flex items-center gap-1"
            >
              <Sparkles size={12} /> Новинка
            </motion.span>
          )}
          {product.oldPrice && (
            <motion.span
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full"
            >
              -{Math.round((1 - product.price / product.oldPrice) * 100)}%
            </motion.span>
          )}
        </div>

        {/* Spicy Indicator */}
        {product.spicyLevel && product.spicyLevel > 0 && (
          <div className="absolute top-4 right-4 flex gap-0.5">
            {[...Array(product.spicyLevel)].map((_, i) => (
              <span key={i} className="text-lg">🌶️</span>
            ))}
          </div>
        )}

        {/* Weight Badge */}
        <div className="absolute bottom-4 right-4 px-3 py-1 bg-dark-800/90 backdrop-blur-sm text-gold-400 text-sm font-medium rounded-full border border-gold-500/20">
          {product.weight}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Title & Description */}
        <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
          {product.name}
        </h3>
        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        {/* Ingredients */}
        <div className="mb-4">
          <h4 className="text-xs text-gold-500/80 uppercase tracking-wider mb-2 font-medium">
            Состав
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {product.ingredients.slice(0, 5).map((ingredient, i) => (
              <span
                key={i}
                className="px-2 py-0.5 bg-dark-500 text-gray-300 text-xs rounded-md border border-gold-500/10"
              >
                {ingredient}
              </span>
            ))}
            {product.ingredients.length > 5 && (
              <span className="px-2 py-0.5 text-gold-500 text-xs">
                +{product.ingredients.length - 5}
              </span>
            )}
          </div>
        </div>

        {/* Divider */}
        <div className="divider-gold mb-4" />

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-gold-500">
                {formatPrice(product.price)} ₽
              </span>
              {product.oldPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {formatPrice(product.oldPrice)} ₽
                </span>
              )}
            </div>
          </div>

          <motion.button
            onClick={handleAddToCart}
            className="relative flex items-center gap-2 bg-gold-gradient text-dark-900 px-4 py-2.5 rounded-xl font-semibold overflow-hidden"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Success Animation */}
            <motion.div
              initial={false}
              animate={localQuantity > 0 ? { x: 0 } : { x: '-100%' }}
              className="absolute inset-0 bg-emerald-500 flex items-center justify-center"
            >
              <span className="text-white font-bold">+{localQuantity}</span>
            </motion.div>
            
            <ShoppingBag size={18} />
            <span className="hidden sm:inline">В корзину</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
