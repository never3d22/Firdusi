'use client';

import { motion } from 'framer-motion';
import { Truck, Clock, Award, Flame } from 'lucide-react';

const features = [
  {
    icon: Flame,
    title: 'Свежие ингредиенты',
    description: 'Только свежие продукты высшего качества',
  },
  {
    icon: Clock,
    title: 'Быстрая доставка',
    description: 'Доставим за 30-40 минут по городу',
  },
  {
    icon: Truck,
    title: 'Бесплатно от 1000₽',
    description: 'Бесплатная доставка при заказе от 1000₽',
  },
  {
    icon: Award,
    title: 'Гарантия качества',
    description: 'Если не понравится — вернём деньги',
  },
];

export default function Features() {
  return (
    <section className="py-16 bg-dark-800">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center text-center p-6 rounded-2xl bg-dark-700/50 border border-gold-500/10 hover:border-gold-500/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-full bg-gold-gradient/10 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon size={28} className="text-gold-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-white mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-400 text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
