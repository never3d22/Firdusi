'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ShoppingBag, Phone, MapPin } from 'lucide-react';
import { useCartStore } from '@/store/cartStore';
import { categories } from '@/data/products';

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Top Bar */}
      <div className="bg-dark-800 border-b border-gold-500/10">
        <div className="container mx-auto px-4 py-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-6">
              <a href="tel:+79999999999" className="flex items-center gap-2 text-gray-400 hover:text-gold-500 transition-colors">
                <Phone size={14} />
                <span>+7 (999) 999-99-99</span>
              </a>
              <span className="hidden sm:flex items-center gap-2 text-gray-400">
                <MapPin size={14} />
                <span>г. Москва, ул. Пушкина, 10</span>
              </span>
            </div>
            <div className="text-gray-400">
              <span className="text-gold-500">●</span> Открыто до 23:00
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-dark-900/95 backdrop-blur-md shadow-lg shadow-black/20'
            : 'bg-transparent'
        }`}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <motion.a
              href="#"
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="relative w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                <span className="text-dark-900 font-display font-bold text-xl">F</span>
                <div className="absolute inset-0 rounded-full animate-pulse-gold" />
              </div>
              <div className="hidden sm:block">
                <h1 className="font-display text-2xl font-bold text-gradient-gold">
                  Firdusi
                </h1>
                <p className="text-xs text-gray-500 -mt-1">Premium Shawarma</p>
              </div>
            </motion.a>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              {categories.slice(0, 5).map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => scrollToSection(category.id)}
                  className="text-gray-300 hover:text-gold-500 transition-colors font-medium"
                  whileHover={{ y: -2 }}
                  whileTap={{ y: 0 }}
                >
                  {category.icon} {category.name}
                </motion.button>
              ))}
            </nav>

            {/* Actions */}
            <div className="flex items-center gap-4">
              {/* Cart Button */}
              <motion.button
                onClick={openCart}
                className="relative flex items-center gap-2 bg-gold-gradient text-dark-900 px-4 py-2.5 rounded-full font-semibold"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ShoppingBag size={20} />
                <span className="hidden sm:inline">Корзина</span>
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
                  >
                    {totalItems}
                  </motion.span>
                )}
              </motion.button>

              {/* Mobile Menu Toggle */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 text-gold-500"
              >
                {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden bg-dark-800 border-t border-gold-500/20"
            >
              <div className="container mx-auto px-4 py-4">
                <nav className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => scrollToSection(category.id)}
                      className="text-left px-4 py-3 text-gray-300 hover:text-gold-500 hover:bg-dark-700 rounded-lg transition-colors font-medium"
                    >
                      {category.icon} {category.name}
                    </button>
                  ))}
                </nav>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  );
}
