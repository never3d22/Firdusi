'use client';

import { motion } from 'framer-motion';
import ProductCard from './ProductCard';
import type { Product, Category } from '@/data/products';

interface MenuSectionProps {
  category: Category;
  products: Product[];
}

export default function MenuSection({ category, products }: MenuSectionProps) {
  if (products.length === 0) return null;

  return (
    <section id={category.id} className="py-16">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <span className="text-4xl mb-4 block">{category.icon}</span>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-gradient-gold mb-4">
            {category.name}
          </h2>
          <div className="w-24 h-1 bg-gold-gradient mx-auto rounded-full" />
        </motion.div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
