# Codex — платформа заказа еды

Codex — это современное приложение для заказа и оплаты блюд с устойчивой SMS-авторизацией, корзиной, историей заказов и полноценной админ-панелью. Репозиторий содержит монорепозиторий с Expo-клиентом и Node.js/TypeScript backend'ом на Fastify + tRPC + Prisma (MySQL).

## Как пользоваться этим проектом, если вы «совсем новичок»

Ниже — сверхподробное руководство. Оно специально написано максимально простым языком и разбито на короткие шаги. Повторяйте их последовательно — так меньше шансов что‑то упустить.

### Шаг 0. Что вообще здесь лежит

Проект состоит из двух больших частей:

| Папка | Что внутри | Для чего | Как запускать |
|-------|-------------|----------|----------------|
| `app/` | Мобильное приложение на Expo (React Native) | Клиентское приложение и админка | `pnpm --filter app dev` |
| `server/` | Backend на Node.js/TypeScript + Fastify/tRPC | API, авторизация, база данных | `pnpm --filter server dev` |

### Шаг 1. Минимальные знания

1. Вы умеете копировать команды и вставлять их в терминал.
2. Вы можете отредактировать текстовый файл (например, через `nano`, `vim`, Visual Studio Code или хотя бы панельный редактор в WinSCP).
3. У вас есть аккаунт на [sms.ru](https://sms.ru/) и рабочий API-ключ.

Если что-то из списка не выполняется — сначала закройте этот пробел (например, посмотрите видео «как пользоваться терминалом»).

### Шаг 2. Что нужно установить на локальный компьютер

1. [Node.js 20 LTS](https://nodejs.org/en) (во время установки поставьте галочку «Add to PATH»).
2. [Git](https://git-scm.com/downloads).
3. [pnpm](https://pnpm.io/installation) — после установки Node запустите в терминале команду `corepack enable && corepack prepare pnpm@8.15.4 --activate`.
4. Для запуска клиента — [Expo Go](https://expo.dev/client) на телефоне **или** Android/iOS эмулятор на компьютере.

### Шаг 3. Скачиваем проект

```bash
git clone <URL вашего репозитория> codex
cd codex
pnpm install        # установит зависимости сразу и для backend, и для клиента
```

### Шаг 4. Что за переменные окружения и как их включить

1. В каждой из папок `app/` и `server/` есть файл `.env.example` — это шаблон.
2. Скопируйте шаблон в рабочий файл:
   ```bash
   cd server
   cp .env.example .env
   ```
   Повторите то же самое внутри `app/`.
3. Откройте файлы `.env` в любом редакторе и замените заглушки на свои значения. Например, строка `DATABASE_URL=mysql://user:pass@localhost:3306/codexdb` должна содержать ваш логин и пароль.
4. Если вы просто тестируете локально и у вас нет MySQL, временно можно поставить `DATABASE_URL="mysql://root:password@localhost:3306/codexdb"`, а саму базу поднять позже (backend без базы не стартует — это нормально).

### Шаг 5. Запуск backend'а для локальной проверки

```bash
cd server
pnpm install                # если ещё не сделали в корне
pnpm prisma:generate        # подготовит Prisma Client
pnpm prisma:migrate:dev     # создаст таблицы (нужен работающий MySQL 8)
pnpm prisma:seed            # наполнит таблицы демо-данными
pnpm dev                    # запустит сервер на http://localhost:3000
```

Что делать, если MySQL не установлен:

```bash
brew install mysql@8        # macOS (через Homebrew)
sudo apt install mysql-server # Ubuntu
```

После установки MySQL обязательно выполните:

```bash
mysql_secure_installation   # задайте root-пароль и включите безопасные опции
```

### Шаг 6. Запуск мобильного приложения

```bash
cd app
pnpm install                      # зависимости Expo
cp .env.example .env              # если ещё нет
pnpm run generate:assets          # создаёт иконку и сплэш (нужно один раз)
pnpm dev                          # откроется Expo DevTools
```

Дальше:

1. Отсканируйте QR-код телефоном с установленным Expo Go (Android) или используйте эмулятор (iOS/Android).
2. Убедитесь, что переменная `EXPO_PUBLIC_API_URL` указывает на ваш локальный backend `http://127.0.0.1:3000/trpc`.
3. Авторизуйтесь по SMS и проверьте корзину, заказы и админку.

### Шаг 7. Понимаем структуру файлов

```
Firdusi/
├── app/
│   ├── app/                # Экраны клиента и админки (Expo Router)
│   ├── src/components/     # Повторно используемые компоненты (карточки блюд и т.д.)
│   ├── src/providers/      # Провайдеры контекста (авторизация, корзина, TanStack Query)
│   └── tailwind.config.js  # Настройки NativeWind
├── server/
│   ├── prisma/schema.prisma     # Описание таблиц БД
│   ├── prisma/migrations/       # SQL миграции
│   ├── prisma/seed.ts           # Сценарий наполнения базы
│   ├── src/trpc/routers/        # Точки входа API
│   ├── src/modules/auth/        # JWT, refresh-токены, SMS авторизация
│   └── tests/                   # Vitest (юнит + интеграция)
└── README.md
```

### Шаг 8. Как сменить пароль админа сразу после логина

1. Зайдите в приложение под логином `admin` и паролем `1234`.
2. Перейдите в профиль администратора и нажмите «Сменить пароль» (или выполните запрос `admin.changePassword` через tRPC).
3. Если нужно сделать это из консоли:
   ```bash
   pnpm --filter server run admin:password -- --phone admin --password <новый_пароль>
   ```
   (скрипт использует argon2 и обновляет запись в БД)

### Шаг 9. Тесты (их запуск обязателен перед коммитом)

```bash
cd server
pnpm test
```

В результате должны пройти:

- Юнит-тесты SMS провайдера (`smsRuProvider.test.ts`).
- Юнит-тесты JWT и ротации refresh токенов (`token.test.ts`).
- Интеграционный тест заказа (`order.test.ts`).

Если какой-то тест «красный», внимательно прочитайте сообщение в консоли — там подсказка, что именно сломалось.

### Шаг 10. Что делать, если что-то не работает

- **Backend не стартует, пишет «ECONNREFUSED»** — MySQL не запущен. Запустите `sudo systemctl start mysql`.
- **Expo не видит сервер** — убедитесь, что телефон и компьютер в одной сети. При необходимости выставьте в `.env` клиента IP компьютера (`http://192.168.X.Y:3000/trpc`).
- **SMS не приходит** — проверьте баланс и статус отправки в кабинете sms.ru. В логах backend'а (`server/logs/*.log`) есть подробности.

---

## Очень подробный деплой на сервер (Ubuntu 22.04, Beget)

Эта часть рассчитана на человека, который впервые подключается к VPS по SSH.

### 1. Подключаемся к серверу

```bash
ssh root@IP_СЕРВЕРА
```

Если система попросит «Are you sure you want to continue connecting (yes/no/[fingerprint])?» — введите `yes` и нажмите Enter.

### 2. Создаём отдельного пользователя (не работать под root!)

```bash
adduser codex
usermod -aG sudo codex
su - codex
```

Дальше ВСЕ шаги выполняем уже от имени `codex` (а не root).

### 3. Устанавливаем необходимые программы

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y build-essential curl git nginx mysql-server ufw

# Установка Node.js 20 и pnpm
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
corepack enable
corepack prepare pnpm@8.15.4 --activate

# PM2 для управления процессами
pnpm add -g pm2
```

### 4. Настраиваем MySQL и создаём базу

```bash
sudo mysql_secure_installation
mysql -u root -p
```

В интерактивной консоли выполните по очереди (копируйте по строке):

```sql
CREATE DATABASE codexdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'appuser'@'localhost' IDENTIFIED BY 'ОченьСложныйПароль123!';
GRANT ALL PRIVILEGES ON codexdb.* TO 'appuser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### 5. Клонируем репозиторий в нужную папку

```bash
cd /var/www/html
git clone <URL вашего репозитория> codex
cd codex
pnpm install
pnpm --filter app run generate:assets
```

### 6. Настраиваем `.env`

```bash
cd server
cp .env.example .env
nano .env
```

Внутри файла замените заглушки на реальные значения (см. подсказки в самом `.env`). Сохраните (в nano: `Ctrl+O`, Enter, затем `Ctrl+X`).

### 7. Применяем миграции и сиды

```bash
pnpm prisma:generate
pnpm prisma:migrate
pnpm prisma:seed
```

### 8. Сборка и запуск backend'а

```bash
pnpm build
pm2 start pm2.config.cjs --env production
pm2 save
pm2 startup systemd
```

Команда `pm2 status` покажет, что приложение работает. `pm2 logs` — выведет логи.

### 9. Настраиваем Nginx

```bash
sudo cp deploy.nginx.conf /etc/nginx/sites-available/codex.conf
sudo nano /etc/nginx/sites-available/codex.conf
```

Внутри файла замените `codex.example.com` на ваш домен (или IP). Затем включите конфиг:

```bash
sudo ln -s /etc/nginx/sites-available/codex.conf /etc/nginx/sites-enabled/codex.conf
sudo nginx -t
sudo systemctl reload nginx
```

### 10. Получаем HTTPS сертификат (если есть домен)

```bash
sudo apt install -y certbot python3-certbot-nginx
sudo certbot --nginx -d codex.example.com
```

Certbot задаст несколько вопросов (email, согласие, нужно ли редиректить HTTP → HTTPS). Отвечайте «Yes».

### 11. Проверяем, что всё живо

1. Откройте `https://ваш-домен/trpc` в браузере — должна появиться ошибка `POST only` (значит Fastify жив).
2. Откройте Expo клиент, укажите `EXPO_PUBLIC_API_URL=https://ваш-домен/trpc` и проверьте авторизацию.
3. Зайдите в админку, закройте приложение и убедитесь, что при повторном открытии вы всё ещё авторизованы.

### 12. Что делать, если после перезагрузки всё пропало

1. Выполните `pm2 resurrect` (восстановит процессы из сохранения).
2. Если PM2 запускался под пользователем `codex`, убедитесь, что команда `pm2 startup systemd` была выполнена именно от него.

---

## Дополнительные подробности о технологии

### Клиент (Expo SDK 51)
- **Expo Router** — файловая навигация с разделением на клиентские и админские стеки.
- **TanStack Query** + **Zod** — типобезопасные запросы и строгая валидация.
- **NativeWind** — Tailwind-стили для быстрого прототипирования (подходит под Expo и TypeScript).
- **expo-secure-store** + **AsyncStorage** — безопасное хранение refresh токена.
- **@stripe/stripe-react-native** — готовность к реальной оплате (в dev используется mock).
- **i18next** — структура локализации (по умолчанию русский).

### Backend
- **Fastify** + **tRPC** — высокопроизводительный типобезопасный API.
- **Prisma ORM (MySQL 8)** — миграции, сиды и строгая схема данных.
- **JWT (access/refresh)** с ротацией и белым списком refresh-токенов.
- **sms.ru интеграция** — адаптер с защитой от брутфорса (TTL 5 минут, максимум 5 попыток, пауза 60 секунд).
- **argon2** — безопасное хранение админских паролей.
- **PM2** + **Nginx** — управление процессами и reverse-proxy в продакшене.

### Схема БД и сиды
- Файл `server/prisma/schema.prisma` содержит все модели (User, Address, Category, Dish, Order, OrderItem, RestaurantSetting, RefreshToken).
- Миграция `server/prisma/migrations/20240601000000_init` создаёт таблицы и индексы.
- `server/prisma/seed.ts` добавляет категории, блюда и администратора `admin/1234` (argon2-hash). После первого входа пароль обязательно смените.

### API (tRPC)
- Публичные роуты: `sendSmsCode`, `verifySmsCode`, `refreshSession`, `revokeRefresh`, `getCategories`, `getDishesByCategory`, `searchDishes`, `createOrder`, `getMyOrders`, `getMyAddresses`, `upsertMyAddress`, `deleteMyAddress`.
- Админские роуты: `admin.login`, `admin.categories.*`, `admin.dishes.*`, `admin.orders.*`, `admin.settings.*`.

### Безопасность
- SMS: код живёт 5 минут, не более 5 попыток, повторная отправка раз в 60 секунд.
- Refresh-токены: хранятся в таблице, привязаны к user-agent/IP, ротируются при каждом обновлении, удаляются при logout.

### Частые ошибки и как их лечить
- **MySQL < 8.0** — обновите пакет `mysql-server` до версии 8 или используйте Docker.
- **EACCES при записи в `/var/www/html`** — проверьте владельца: `sudo chown -R codex:codex /var/www/html/codex`.
- **Порт 3000 занят** — `sudo lsof -i :3000` → завершите лишний процесс или поменяйте `PORT` в `.env`.
- **PM2 не стартует после перезагрузки** — выполните `pm2 startup systemd` и `pm2 save` под тем же пользователем.
- **Firewall закрывает порты** — `sudo ufw allow 22`, `sudo ufw allow 80`, `sudo ufw allow 443`, `sudo ufw enable`.

### Expo + sms.ru (песочница)
- Для теста используйте пробный тариф sms.ru (доступно ограниченное число отправок).
- В `server/src/modules/auth/otpStore.ts` настроен rate-limit: пауза 60 секунд, максимум 5 попыток, после успешной проверки код удаляется.

### Почему NativeWind
NativeWind предоставляет знакомый синтаксис Tailwind, автоматически работает с Expo Router и TypeScript (см. `app/src/nativewind-env.d.ts`) и не требует ручного написания `StyleSheet`. Это ускоряет разработку и упрощает поддержку.

### Команды pnpm на каждый день
- `pnpm --filter server dev` — запустить backend в режиме разработки.
- `pnpm --filter server build` — собрать backend.
- `pnpm --filter server test` — запустить тесты backend'а.
- `pnpm --filter server prisma:migrate` — применить миграции.
- `pnpm --filter server prisma:seed` — наполнить базу данными.
- `pnpm --filter app dev` — запустить Expo клиент.
- `pnpm --filter app lint` — проверить код клиента линтером.
- `pnpm --filter app typecheck` — проверить типы TypeScript.

---
Готово! Репозиторий содержит все необходимые артефакты для развёртывания производственного решения и последующего масштабирования.
