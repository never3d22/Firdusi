'use client';

import Header from '@/components/Header';
import HeroSlider from '@/components/HeroSlider';
import Features from '@/components/Features';
import MenuSection from '@/components/MenuSection';
import CartModal from '@/components/CartModal';
import Footer from '@/components/Footer';
import { categories, products } from '@/data/products';

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <HeroSlider />
      <Features />
      
      {/* Menu Sections */}
      {categories.map((category) => (
        <MenuSection
          key={category.id}
          category={category}
          products={products.filter((p) => p.category === category.id)}
        />
      ))}
      
      <Footer />
      <CartModal />
    </main>
  );
}
