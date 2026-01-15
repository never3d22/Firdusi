'use client';

import { motion } from 'framer-motion';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  Instagram, 
  Facebook, 
  Send as Telegram,
  Heart
} from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Telegram, href: '#', label: 'Telegram' },
  ];

  const workingHours = [
    { day: 'Пн-Чт', hours: '10:00 - 22:00' },
    { day: 'Пт-Сб', hours: '10:00 - 23:00' },
    { day: 'Воскресенье', hours: '11:00 - 21:00' },
  ];

  return (
    <footer className="bg-dark-900 border-t border-gold-500/20">
      {/* Main Footer */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center">
                  <span className="text-dark-900 font-display font-bold text-xl">F</span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-gradient-gold">
                    Firdusi
                  </h3>
                  <p className="text-xs text-gray-500">Premium Shawarma</p>
                </div>
              </div>
              <p className="text-gray-400 text-sm leading-relaxed">
                Откройте для себя вкус настоящей восточной кухни. 
                Премиальная шаурма из лучших ингредиентов, 
                приготовленная с любовью и мастерством.
              </p>
            </motion.div>

            {/* Social Links */}
            <div className="flex gap-3">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, y: -2 }}
                  className="w-10 h-10 rounded-full bg-dark-700 border border-gold-500/20 flex items-center justify-center text-gray-400 hover:text-gold-500 hover:border-gold-500/50 transition-colors"
                  aria-label={social.label}
                >
                  <social.icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            <h4 className="font-display text-lg font-semibold text-gold-500 mb-6">
              Контакты
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="tel:+79999999999" 
                  className="flex items-center gap-3 text-gray-400 hover:text-gold-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-700 border border-gold-500/10 flex items-center justify-center group-hover:border-gold-500/30 transition-colors">
                    <Phone size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Телефон</p>
                    <p className="font-medium">+7 (999) 999-99-99</p>
                  </div>
                </a>
              </li>
              <li>
                <a 
                  href="mailto:info@firdusi.ru" 
                  className="flex items-center gap-3 text-gray-400 hover:text-gold-500 transition-colors group"
                >
                  <div className="w-10 h-10 rounded-lg bg-dark-700 border border-gold-500/10 flex items-center justify-center group-hover:border-gold-500/30 transition-colors">
                    <Mail size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">info@firdusi.ru</p>
                  </div>
                </a>
              </li>
              <li>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-10 h-10 rounded-lg bg-dark-700 border border-gold-500/10 flex items-center justify-center">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Адрес</p>
                    <p className="font-medium">г. Москва, ул. Пушкина, 10</p>
                  </div>
                </div>
              </li>
            </ul>
          </motion.div>

          {/* Working Hours */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            <h4 className="font-display text-lg font-semibold text-gold-500 mb-6">
              Часы работы
            </h4>
            <div className="space-y-3">
              {workingHours.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center gap-3 p-3 bg-dark-700/50 rounded-lg border border-gold-500/10"
                >
                  <Clock size={16} className="text-gold-500" />
                  <div className="flex-1">
                    <span className="text-gray-400">{item.day}</span>
                  </div>
                  <span className="font-medium text-white">{item.hours}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 p-3 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
              <p className="text-sm text-emerald-400 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                Сейчас открыто
              </p>
            </div>
          </motion.div>

          {/* Newsletter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
          >
            <h4 className="font-display text-lg font-semibold text-gold-500 mb-6">
              Подпишитесь
            </h4>
            <p className="text-gray-400 text-sm mb-4">
              Получайте информацию о новинках и специальных предложениях
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Ваш email"
                className="w-full px-4 py-3 bg-dark-700 border border-gold-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-gold-500/50 transition-colors"
              />
              <button
                type="submit"
                className="w-full btn-primary py-3 rounded-lg"
              >
                Подписаться
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-500/10">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-gray-500 text-sm text-center md:text-left">
              © {currentYear} Firdusi. Все права защищены.
            </p>
            <p className="text-gray-500 text-sm flex items-center gap-1">
              Сделано с <Heart size={14} className="text-red-500" /> в России
            </p>
            <div className="flex gap-6 text-sm">
              <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
                Политика конфиденциальности
              </a>
              <a href="#" className="text-gray-500 hover:text-gold-500 transition-colors">
                Оферта
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
