#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'USAGE'
Usage: setup-mysql-via-ssh.sh [--repo-dir /var/www/codex]

Mandatory environment variables:
  SSH_HOST             Hostname или IP сервера (доступного по SSH)
  SSH_USER             Пользователь SSH, обладающий правами на запуск docker compose
  MYSQL_ROOT_PASSWORD  Пароль root внутри контейнера MySQL
  MYSQL_DATABASE       Имя основной базы данных
  MYSQL_USER           Имя прикладного пользователя (будет создан автоматически)
  MYSQL_PASSWORD       Пароль прикладного пользователя

Опциональные переменные окружения:
  SSH_PORT             Порт SSH (по умолчанию 22)
  REMOTE_DIR           Путь на сервере, куда будет скопирован docker-compose (по умолчанию /opt/codex/mysql)
  REMOTE_REPO_DIR      Путь до каталога проекта на сервере. Если указан, скрипт применит Prisma миграции и сиды.

Опции:
  --repo-dir PATH      Путь до локального каталога с репозиторием (если запускаете не из корня).
  -h, --help           Показать эту справку.
USAGE
}

REPO_DIR="$(pwd)"

while [[ $# -gt 0 ]]; do
  case "$1" in
    --repo-dir)
      REPO_DIR="$2"
      shift 2
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Неизвестный аргумент: $1" >&2
      usage >&2
      exit 1
      ;;
  esac
done

required_vars=(SSH_HOST SSH_USER MYSQL_ROOT_PASSWORD MYSQL_DATABASE MYSQL_USER MYSQL_PASSWORD)
for var in "${required_vars[@]}"; do
  if [[ -z "${!var-}" ]]; then
    echo "Ошибка: переменная $var не задана" >&2
    usage >&2
    exit 1
  fi
done

SSH_PORT="${SSH_PORT:-22}"
REMOTE_DIR="${REMOTE_DIR:-/opt/codex/mysql}"
REMOTE_REPO_DIR="${REMOTE_REPO_DIR:-}"

PNPM_VERSION="8.15.4"
REMOTE_PNPM_CMD="pnpm"

SCRIPT_DIR="${REPO_DIR%/}/server/scripts"
COMPOSE_FILE="$SCRIPT_DIR/mysql-docker-compose.yml"

if [[ ! -f "$COMPOSE_FILE" ]]; then
  echo "Не найден docker-compose файл: $COMPOSE_FILE" >&2
  exit 1
fi

TMP_ENV="$(mktemp)"
trap 'rm -f "$TMP_ENV"' EXIT

cat > "$TMP_ENV" <<ENV
MYSQL_ROOT_PASSWORD=$MYSQL_ROOT_PASSWORD
MYSQL_DATABASE=$MYSQL_DATABASE
MYSQL_USER=$MYSQL_USER
MYSQL_PASSWORD=$MYSQL_PASSWORD
ENV

ssh_cmd() {
  ssh -p "$SSH_PORT" "$SSH_USER@$SSH_HOST" "$@"
}

scp -P "$SSH_PORT" "$COMPOSE_FILE" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/docker-compose.yml" 2>/dev/null || {
  ssh_cmd "mkdir -p $REMOTE_DIR"
  scp -P "$SSH_PORT" "$COMPOSE_FILE" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/docker-compose.yml"
}

scp -P "$SSH_PORT" "$TMP_ENV" "$SSH_USER@$SSH_HOST:$REMOTE_DIR/.env"

ssh_cmd "cd $REMOTE_DIR && docker compose pull mysql"
ssh_cmd "cd $REMOTE_DIR && docker compose up -d mysql"

# Ожидаем готовность healthcheck'а
ssh_cmd "cd $REMOTE_DIR && docker compose ps mysql"

# Проверяем, что можно выполнить запрос от имени прикладного пользователя
QUERY="SELECT NOW() AS server_time, CURRENT_USER() AS connected_as;"
ssh_cmd "cd $REMOTE_DIR && docker compose exec -T mysql mysql -u$MYSQL_USER -p$MYSQL_PASSWORD $MYSQL_DATABASE -e \"$QUERY\""

echo "MySQL контейнер поднят и отвечает на запросы."

if [[ -n "$REMOTE_REPO_DIR" ]]; then
  echo "Проверяем наличие pnpm на сервере..."
  if ssh_cmd "command -v pnpm >/dev/null 2>&1"; then
    REMOTE_PNPM_CMD="pnpm"
  elif ssh_cmd "command -v corepack >/dev/null 2>&1"; then
    echo "pnpm не найден, активируем через corepack (pnpm@$PNPM_VERSION)..."
    ssh_cmd "corepack enable pnpm >/dev/null 2>&1 || true"
    ssh_cmd "corepack prepare pnpm@$PNPM_VERSION --activate"
    REMOTE_PNPM_CMD="corepack pnpm"
  else
    echo "pnpm не найден, устанавливаем в домашний каталог пользователя (pnpm@$PNPM_VERSION)..."
    ssh_cmd "curl -fsSL https://get.pnpm.io/install.sh | SHELL=bash bash -s -- --version $PNPM_VERSION"
    REMOTE_PNPM_CMD="\$HOME/.local/share/pnpm/pnpm"
  fi

  echo "Устанавливаем зависимости backend'а (может занять время)..."
  ssh_cmd "cd $REMOTE_REPO_DIR && $REMOTE_PNPM_CMD install --filter server"

  DB_URL="mysql://$MYSQL_USER:$MYSQL_PASSWORD@127.0.0.1:3306/$MYSQL_DATABASE"
  printf -v DB_URL_ESCAPED '%q' "$DB_URL"

  echo "Применяем Prisma миграции..."
  ssh_cmd "cd $REMOTE_REPO_DIR && DATABASE_URL=$DB_URL_ESCAPED $REMOTE_PNPM_CMD --filter server prisma:migrate deploy"

  echo "Запускаем сиды базы данных..."
  ssh_cmd "cd $REMOTE_REPO_DIR && DATABASE_URL=$DB_URL_ESCAPED $REMOTE_PNPM_CMD --filter server prisma:seed"
  echo "Prisma миграции и сиды применены."
fi

cat <<INFO
Готово! Подключайтесь к базе по строке:
  mysql://$MYSQL_USER:$MYSQL_PASSWORD@$SSH_HOST:3306/$MYSQL_DATABASE
(снаружи порт проброшен только на localhost сервера; используйте SSH-туннель, например: ssh -L 3307:127.0.0.1:3306 $SSH_USER@$SSH_HOST)
INFO
