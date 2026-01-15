import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Firdusi | Премиальная Шаурма',
  description: 'Откройте для себя вкус настоящей восточной кухни. Премиальная шаурма из лучших ингредиентов с доставкой.',
  keywords: ['шаурма', 'доставка', 'восточная кухня', 'премиум', 'firdusi'],
  openGraph: {
    title: 'Firdusi | Премиальная Шаурма',
    description: 'Откройте для себя вкус настоящей восточной кухни',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="min-h-screen bg-dark-900">
        {children}
      </body>
    </html>
  );
}
