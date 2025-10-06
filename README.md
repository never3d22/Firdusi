# Codex — платформа заказа еды

## Развёртывание на beget.com

Ниже — пошаговая инструкция по развёртыванию проекта на VPS от beget.com с Ubuntu 22.04. Все действия выполняйте последовательно под пользователем с правами `sudo`.

### 1. Подготовка SSH-доступа

1. В панели Beget создайте (или уточните) IP-адрес сервера и пользователя с SSH-доступом.
2. Подключитесь к серверу из терминала локального компьютера:
   ```bash
   ssh <ssh_user>@<server_ip>
   ```
3. При первом входе смените пароль командой `passwd` и добавьте свой публичный SSH-ключ (это избавит от ввода пароля при следующих входах):
   ```bash
   mkdir -p ~/.ssh
   echo "<ваш_public_key>" >> ~/.ssh/authorized_keys
   chmod 700 ~/.ssh
   chmod 600 ~/.ssh/authorized_keys
   ```
4. Для работы без `root` создайте отдельного пользователя (если ещё не сделали) и добавьте его в группу `sudo`:
   ```bash
   sudo adduser codex
   sudo usermod -aG sudo codex
   sudo su - codex
   ```
   Все дальнейшие шаги выполняйте уже под этим пользователем.

### 2. Настройка сервера

1. Обновите систему и установите необходимые пакеты:
   ```bash
   sudo apt update && sudo apt upgrade -y
   sudo apt install -y build-essential curl git nginx mysql-server ufw dnsutils
   ```
2. Убедитесь, что на сервере установлена современная версия Node.js (на VPS Beget по умолчанию доступна ветка 22.x):
   ```bash
   node -v
   ```
   Если версия ниже 20, установите Node.js 20 LTS из официального репозитория:
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt install -y nodejs
   ```
3. Включите Corepack и активируйте pnpm:
   ```bash
   corepack enable
   corepack prepare pnpm@8.15.4 --activate
   ```
4. Установите PM2 глобально для управления бэкендом в продакшене:
   ```bash
   pnpm add -g pm2
   ```
5. Настройте firewall, если он ещё не включён:
   ```bash
   sudo ufw allow OpenSSH
   sudo ufw allow "Nginx Full"
   sudo ufw enable
   ```

### 3. Конфигурация MySQL

1. Запустите скрипт первичной настройки MySQL и задайте надёжный пароль root-пользователя:
   ```bash
   sudo mysql_secure_installation
   ```
2. Создайте БД и пользователя для приложения:
   ```bash
   mysql -u root -p
   ```
   В интерактивной консоли выполните по очереди (подставьте свои значения пароля и имени базы):
   ```sql
   CREATE DATABASE codexdb CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   CREATE USER 'codex_app'@'localhost' IDENTIFIED BY 'СложныйПароль123!';
   GRANT ALL PRIVILEGES ON codexdb.* TO 'codex_app'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### 4. Подготовка проекта

1. Выберите директорию для проекта (на Beget чаще всего используется `/var/www/<site>`). Пример:
   ```bash
   sudo mkdir -p /var/www/codex
   sudo chown -R "$USER":"$USER" /var/www/codex
   cd /var/www/codex
   ```
2. Склонируйте репозиторий и установите зависимости монорепозитория:
   ```bash
   git clone <URL вашего репозитория> .
   pnpm install
   pnpm --filter app run generate:assets
   ```
3. Создайте и заполните файл окружения для backend'а:
   ```bash
   cd server
   cp .env.example .env
   nano .env
   ```
   Обновите значения:
   - `DATABASE_URL=mysql://codex_app:СложныйПароль123!@127.0.0.1:3306/codexdb`
   - `SMSRU_API_KEY`, `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `REFRESH_TOKEN_SALT` — заполните реальными значениями.
   - `PUBLIC_WEB_APP_URL` и `CORS_ORIGINS` укажите на домен, который настроен в панели Beget (например, `https://example.beget.app`).

### 5. Миграции и сборка backend'а

1. Сгенерируйте Prisma Client, примените миграции и сиды:
   ```bash
   pnpm prisma:generate
   pnpm prisma:migrate deploy
   pnpm prisma:seed
   ```
2. Соберите backend и запустите его через PM2:
   ```bash
   pnpm build
   pm2 start pm2.config.cjs --env production
   pm2 save
   pm2 startup systemd
   ```
   После перезагрузки сервера восстановить процессы можно командой `pm2 resurrect`.

### 6. Настройка Nginx и HTTPS

1. Скопируйте подготовленный конфиг и при необходимости обновите `server_name` на ваш домен:
   ```bash
   sudo cp server/deploy.nginx.conf /etc/nginx/sites-available/codex.conf
   sudo nano /etc/nginx/sites-available/codex.conf
   ```
2. Активируйте конфигурацию и перезапустите Nginx:
   ```bash
   sudo ln -s /etc/nginx/sites-available/codex.conf /etc/nginx/sites-enabled/codex.conf
   sudo nginx -t
   sudo systemctl reload nginx
   ```
3. Если домен указывает на IP сервера (проверьте `dig +short <ваш_домен>`), получите сертификат Let's Encrypt:
   ```bash
   sudo apt install -y certbot python3-certbot-nginx
   sudo certbot --nginx -d <ваш_домен>
   ```
   В процессе подтвердите почту и включите редирект HTTP→HTTPS.

### 7. Мобильное приложение (Expo)

1. Перейдите в каталог клиента и подготовьте переменные окружения:
   ```bash
   cd /var/www/codex/app
   cp .env.example .env
   nano .env
   ```
   Обновите `EXPO_PUBLIC_API_URL` (указывает на `https://<ваш_домен>/trpc`) и `EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY`.
2. Сгенерируйте актуальные ассеты (если вы меняли иконки/сплэши):
   ```bash
   pnpm --filter app run generate:assets
   ```
3. Для тестирования в Expo Go запустите дев-сервер с туннелем:
   ```bash
   pnpm --filter app dev -- --tunnel
   ```
   В Expo Go отсканируйте QR-код из терминала и убедитесь, что приложение обращается к боевому API.
4. Для продакшн-сборки используйте EAS Build (требуется аккаунт Expo):
   ```bash
   pnpm dlx eas-cli login
   pnpm dlx eas-cli build --platform android --profile production
   pnpm dlx eas-cli build --platform ios --profile production
   ```
   Готовые артефакты будут доступны в разделе «Builds» на https://expo.dev/accounts/<your-account>/projects/codex-app/builds.

### 8. Финальная проверка

1. Убедитесь, что API отвечает: откройте `https://<ваш_домен>/trpc` — должна появиться ошибка `POST only` (это нормально).
2. Проверьте логи backend'а:
   ```bash
   pm2 status
   pm2 logs --lines 100
   ```
3. После перезагрузки сервера восстановите процессы: `pm2 resurrect`.

На этом развёртывание завершено: приложение доступно по HTTPS, backend работает под управлением PM2, а база данных защищена локальным доступом.
