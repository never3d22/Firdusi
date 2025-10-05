import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import * as Localization from 'expo-localization';

const resources = {
  ru: {
    translation: {
      welcome: 'Добро пожаловать в Codex',
      categories: 'Категории',
      dishes: 'Блюда',
      cart: 'Корзина',
      profile: 'Профиль',
      admin: 'Админ-панель',
      login: 'Войти',
      logout: 'Выйти'
    }
  }
};

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    compatibilityJSON: 'v3',
    lng: Localization.locale.split('-')[0] ?? 'ru',
    fallbackLng: 'ru',
    resources,
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
