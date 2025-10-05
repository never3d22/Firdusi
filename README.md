# Codex — платформа заказа еды

Codex — это современное приложение для заказа и оплаты блюд с устойчивой SMS-авторизацией, корзиной, историей заказов и полноценной админ-панелью. Репозиторий содержит монорепозиторий с Expo-клиентом и Node.js/TypeScript backend'ом на Fastify + tRPC + Prisma (MySQL).

## Технологии и решения

### Клиент (Expo SDK 51)
- **Expo Router** — файловая навигация с разделением на клиентские и админские стеки.
- **TypeScript** + **TanStack Query** — типобезопасные запросы и кэширование.
- **tRPC клиент** — единая точка связи с API без ручного описания типов.
- **NativeWind** — Tailwind-стили для React Native (выбран за скорость прототипирования и поддержку Expo/TypeScript).
- **expo-secure-store** + **AsyncStorage** — безопасное хранение refresh токена и локальный кэш access токена.
- **@stripe/stripe-react-native** — задел под реальную оплату (в dev включён mock-провайдер).
- **i18next** — структура для локализации (по умолчанию RU).

### Backend
- **Fastify** + **tRPC** — высокопроизводительное API с единым контрактом для клиента.
- **Prisma ORM (MySQL 8)** — строгая схема данных, миграции и сиды.
- **JWT (access/refresh)** + ротация и белый список refresh-токенов (устойчивые сессии админов).
- **sms.ru интеграция** — отправка кодов, защита от брута (TTL, частота повторной отправки, максимум попыток).
- **argon2** — хэширование админских паролей.
- **PM2** + **Nginx** — продакшн-оркестрация и reverse-proxy.

## Структура репозитория
```
Firdusi/
├── app/                # Expo клиент
│   ├── app/            # Файловые маршруты Expo Router
│   ├── src/            # Компоненты, провайдеры, утилиты
│   ├── assets/         # Заглушки и i18n
│   └── ...             # Expo конфигурация, NativeWind и т.д.
├── server/             # Node.js backend
│   ├── prisma/         # schema.prisma, миграции, сиды
│   ├── src/            # Fastify + tRPC код
│   ├── tests/          # Vitest (unit + integration)
│   ├── pm2.config.cjs  # PM2 конфиг
│   └── deploy.nginx.conf
├── pnpm-workspace.yaml
├── package.json        # корневой monorepo
└── README.md           # вы здесь
```

## База данных и Prisma
- `schema.prisma` описывает пользователей (админы/клиенты), адреса, категории, блюда, заказы, настройки ресторана, белый список refresh-токенов.
- Миграция `prisma/migrations/20240601000000_init` создаёт все таблицы и индексы.
- `prisma/seed.ts`:
  - Создаёт дефолтного администратора `admin / 1234` (argon2 hash).
  - Добавляет категории и блюда-заглушки.
  - Создаёт запись RestaurantSetting с расписанием.

⚠️ **Важно:** при первом входе под `admin/1234` смените пароль — в клиенте это подсвечивается уведомлением, в README ниже описано как обновить хэш.

## API (tRPC) — основные процедуры

### Публичные
- `public.sendSmsCode`, `public.verifySmsCode`, `public.refreshSession`, `public.revokeRefresh`
- `public.getCategories`, `public.getDishesByCategory`, `public.searchDishes`
- `public.createOrder`, `public.getMyOrders`, `public.getMyAddresses`, `public.upsertMyAddress`, `public.deleteMyAddress`

### Админские
- `admin.login`
- `admin.categories.*`
- `admin.dishes.*`
- `admin.orders.*`
- `admin.settings.*`

### Безопасность
- SMS: TTL 5 минут, максимум 5 попыток, повторная отправка раз в 60 секунд.
- Refresh-токены: хранение хэша (SHA-256 + salt), привязка к user-agent/ip, ротация при каждом обновлении, отзыв при logout.

## Тесты
- `vitest` + `@vitest/coverage-v8`
  - Юнит: `token.test.ts` (JWT/refresh логика), `smsRuProvider.test.ts` (интеграция с sms.ru, моки fetch).
  - Интеграция: `order.test.ts` (успешное/ошибочное создание заказа через tRPC).

Запуск:
```bash
cd server
pnpm install
pnpm test
```

## Локальный запуск

### Backend
```bash
cd server
pnpm install
pnpm prisma:generate
cp .env.example .env            # заполните переменные
pnpm prisma:migrate:dev
pnpm prisma:seed
pnpm dev
```

### Клиент (Expo)
```bash
cd app
pnpm install
cp .env.example .env
pnpm run generate:assets   # генерирует PNG-заглушки (бинарные файлы в git не храним)
pnpm dev   # откроется Expo DevTools (в эмуляторе / Expo Go)
```

## Продакшн деплой на beget (Ubuntu 22.04)

### 1. Подготовка сервера
```bash
# обновления и базовые пакеты
apt update && apt upgrade -y
apt install -y build-essential curl git nginx mysql-server ufw

# Node.js 20 + pnpm
distro=$(lsb_release -cs)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt install -y nodejs
corepack enable
corepack prepare pnpm@8.15.4 --activate

# PM2
pnpm add -g pm2
```

### 2. MySQL
```bash
mysql_secure_installation
mysql -u root -p
> CREATE DATABASE codexdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
> CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'СЛОЖНЫЙ_ПАРОЛЬ';
> GRANT ALL PRIVILEGES ON codexdb.* TO 'appuser'@'localhost';
> FLUSH PRIVILEGES;
```

### 3. Клонирование и подготовка репозитория
```bash
cd /var/www/html
git clone <ваш-репозиторий> codex
cd codex
pnpm install
pnpm --filter app run generate:assets  # создаёт icon/adaptive/splash локально
```

### 4. Настройка переменных окружения
```bash
cd server
cp .env.example .env
# заполните:
# DATABASE_URL=mysql://appuser:СЛОЖНЫЙ_ПАРОЛЬ@localhost:3306/codexdb
# SMSRU_API_KEY=ключ_из_sms.ru
# JWT_* и REFRESH_TOKEN_SALT — новые случайные строки >=32 символов
# PAYMENT_PROVIDER=mock или stripe
# STRIPE_* при использовании Stripe
```

### 5. Миграции и сиды
```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 6. Сборка и запуск backend'а под PM2
```bash
pnpm build
pm2 start pm2.config.cjs --env production
pm2 save
pm2 startup systemd
```

### 7. Nginx reverse proxy (80/443 → 3000)
```bash
cp deploy.nginx.conf /etc/nginx/sites-available/codex.conf
# отредактируйте server_name
ln -s /etc/nginx/sites-available/codex.conf /etc/nginx/sites-enabled/codex.conf
nginx -t
systemctl reload nginx
```

#### Certbot (если есть домен)
```bash
apt install -y certbot python3-certbot-nginx
certbot --nginx -d codex.example.com
```
Certbot автоматически пропишет редирект на HTTPS.

### 8. Expo клиент в продакшне
- **OTA / EAS Build**: настройте `eas.json`, выполните `eas build` (не входит в репо, но структура готова).
- **API URL**: в `.env` клиента пропишите `EXPO_PUBLIC_API_URL=https://codex.example.com/trpc`.
- **Assets**: перед сборкой выполните `pnpm --filter app run generate:assets`, чтобы Expo получил иконки/сплэш.
- **Сборка**: `pnpm install`, `pnpm dev` для локальной проверки, `eas build -p ios/android` для стора.

### 9. Проверка функционала
1. Отправьте SMS на тестовый номер, убедитесь в получении кода (sms.ru → статус 100).
2. После авторизации закройте приложение и убедитесь в авто-входе (silent refresh).
3. В админке обновите статус заказа и убедитесь, что клиентский список обновился.
4. Смените пароль администратора (через отдельный endpoint или прямое обновление `User.passwordHash` в БД):
   ```sql
   UPDATE User SET passwordHash='<argon2_hash>' WHERE phone='admin';
   ```
   Хэш можно получить локально через `pnpm prisma:seed` либо скриптом с `argon2.hash`.

### 10. Создание отдельного UNIX-пользователя
```bash
adduser codex
usermod -aG sudo codex
chown -R codex:codex /var/www/html/codex
su - codex
# дальше выполнять деплойные команды от этого пользователя (pm2 можно запускать под codex)
```

## Частые ошибки и решение
- **MySQL < 8.0**: обновите `mysql-server` до 8+, иначе Prisma не применит миграции.
- **EACCES при работе с `/var/www/html`**: поправьте права `chown -R` и работайте под отдельным пользователем.
- **Порт 3000 занят**: `lsof -i :3000` и остановите конфликтующий сервис или измените `PORT`.
- **PM2 не стартует при ребуте**: `pm2 startup systemd` и `pm2 save` под нужным пользователем.
- **Firewall (ufw)**: разрешите 80/443/22 — `ufw allow 80,443,22/tcp && ufw enable`.

## Expo + sms.ru (песочница)
- Для разработки можно использовать «пробный» тариф sms.ru — укажите реальный номер.
- В `otpStore` предусмотрен таймаут 60 секунд и максимум 5 попыток — при бруте возвращается ошибка.

## Почему NativeWind
NativeWind предоставляет знакомый синтаксис Tailwind, автоматически работает с Expo Router и TypeScript (см. `nativewind-env.d.ts`) и не требует ручного написания StyleSheet. Это ускоряет прототипирование UI и соблюдает современный «атомарный» подход, который легко адаптировать под дизайн-систему.

## Команды pnpm
- `pnpm --filter server dev|build|test|prisma:*`
- `pnpm --filter app dev|lint|typecheck`

---
Готово! Репозиторий содержит все необходимые артефакты для развёртывания производственного решения и последующего масштабирования.
