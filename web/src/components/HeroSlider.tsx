'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { slides } from '@/data/products';
import Image from 'next/image';

export default function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(0);

  const nextSlide = useCallback(() => {
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(nextSlide, 6000);
    return () => clearInterval(timer);
  }, [nextSlide]);

  const scrollToMenu = () => {
    const element = document.getElementById('popular');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  const slide = slides[currentSlide];

  return (
    <section className="relative h-[90vh] min-h-[600px] overflow-hidden">
      {/* Background Images */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlide}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: 'spring', stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          className="absolute inset-0"
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 hero-gradient" />
        </motion.div>
      </AnimatePresence>

      {/* Golden Accent Lines */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-gold-500/0 via-gold-500/30 to-gold-500/0" />
        <div className="absolute top-0 right-0 w-1 h-full bg-gradient-to-b from-gold-500/0 via-gold-500/30 to-gold-500/0" />
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-gold-500/0 via-gold-500/50 to-gold-500/0" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 h-full flex items-center">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -30 }}
              transition={{ duration: 0.5 }}
            >
              {/* Subtitle */}
              <motion.p
                className="text-gold-500 font-medium text-lg mb-4 tracking-wider uppercase"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.subtitle}
              </motion.p>

              {/* Title */}
              <motion.h2
                className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <span className="text-gradient-gold">{slide.title}</span>
              </motion.h2>

              {/* Description */}
              <motion.p
                className="text-gray-300 text-xl mb-8 max-w-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                {slide.description}
              </motion.p>

              {/* CTA Button */}
              <motion.button
                onClick={scrollToMenu}
                className="btn-primary text-lg px-8 py-4 rounded-full inline-flex items-center gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {slide.cta}
                <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute bottom-1/2 translate-y-1/2 left-4 right-4 flex justify-between z-20 pointer-events-none">
        <motion.button
          onClick={prevSlide}
          className="p-3 rounded-full bg-dark-800/80 border border-gold-500/30 text-gold-500 pointer-events-auto"
          whileHover={{ scale: 1.1, borderColor: 'rgba(212, 175, 55, 0.8)' }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronLeft size={24} />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="p-3 rounded-full bg-dark-800/80 border border-gold-500/30 text-gold-500 pointer-events-auto"
          whileHover={{ scale: 1.1, borderColor: 'rgba(212, 175, 55, 0.8)' }}
          whileTap={{ scale: 0.9 }}
        >
          <ChevronRight size={24} />
        </motion.button>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => {
              setDirection(index > currentSlide ? 1 : -1);
              setCurrentSlide(index);
            }}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? 'w-8 bg-gold-500'
                : 'w-2 bg-gray-600 hover:bg-gray-500'
            }`}
          />
        ))}
      </div>

      {/* Scroll Indicator */}
      <motion.div
        className="absolute bottom-8 right-8 z-20 hidden md:block"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="flex flex-col items-center gap-2 text-gold-500/60">
          <span className="text-xs tracking-widest uppercase rotate-90 origin-center translate-x-8">
            Листайте
          </span>
          <div className="w-6 h-10 border-2 border-gold-500/30 rounded-full flex justify-center pt-2">
            <motion.div
              className="w-1.5 h-1.5 bg-gold-500 rounded-full"
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
