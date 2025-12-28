# Woorkroom Server

Backend monorepo на **NestJS** з мікросервісною архітектурою (RMQ) та окремим **API Gateway**.

## Архітектура

Репозиторій — NestJS monorepo (`nest-cli.json`), де:

- **apps/** — застосунки/мікросервіси
- **libs/** — спільні бібліотеки (конфіг, RMQ, Redis, SMTP, тощо)

### Сервіси (apps)

- **gateway** — API Gateway (GraphQL). Єдиний сервіс з пробросом порту назовні.
- **authorization** — авторизація/сесії (Redis).
- **users** — робота з користувачами (Postgres).
- **companys** — робота з компаніями (Postgres).
- **mails** — надсилання email (SMTP / Mailpit для dev).

### Інфраструктура (docker-compose)

- **Postgres** (порт `5432`)
- **Redis** (порт `6379`)
- **RabbitMQ** (порт `5672`, UI `15672`)
- **Mailpit** (SMTP `1025`, UI `8025`)

## Вимоги

- Node.js (для локального запуску без Docker)
- Docker + Docker Compose (рекомендовано для dev)
- GNU Make (або запускай `docker compose ...` напряму)

## Швидкий старт (Docker, рекомендовано)

1. Створи `.env` (або `.env.local`).

Важливо:

- Конфіг читається з `.env.local`, а якщо його нема — з `.env`.
- У `docker-compose.yml` для контейнерів підключений `env_file: .env`, тому для Docker **потрібен саме `.env`**.

2. Запусти інфраструктуру і сервіси:

```bash
make up
```

3. Перевір, що все піднялось:

```bash
make ps
```

4. Логи:

```bash
make logs
```

### Гарячий перезапуск під час розробки

Перезапустити всі сервіси:

```bash
make dev
```

Перезапустити один сервіс:

```bash
make dev-gateway
make dev-authorization
```

## Порти / URLs

- **Gateway**: `http://localhost:3000`
- **RabbitMQ Management UI**: `http://localhost:15672` (login/password: `woorkroom` / `woorkroom`)
- **Mailpit UI**: `http://localhost:8025`
- **Postgres**: `localhost:5432` (user/password/db: `root` / `root` / `woorkroom`)
- **Redis**: `localhost:6379`

## Змінні середовища (ENV)

Нижче — мінімальний список змінних, які очікує конфіг (`libs/config/src/configuration.ts`).

```dotenv
# App
PORT=3000

# Security
SECURITY_PASSWORD_SALT_ROUNDS=10
SECURITY_PASSWORD_PEPPER=change_me

# Authorization
AUTHORIZATION_SESSION_DAYS=7

# Redis
REDIS_HOST=redis
REDIS_PORT=6379

# RabbitMQ
RABBITMQ_HOST=rabbitmq
RABBITMQ_PORT=5672
RABBITMQ_USER=woorkroom
RABBITMQ_PASSWORD=woorkroom

RABBITMQ_QUEUE_USERS=users
RABBITMQ_QUEUE_COMPANYS=companys
RABBITMQ_QUEUE_MAILS=mails
RABBITMQ_QUEUE_AUTHORIZATION=authorization

# Postgres (Users service)
DATABASE_USER_HOST=db
DATABASE_USER_PORT=5432
DATABASE_USER_USER=root
DATABASE_USER_PASSWORD=root
DATABASE_USER_DATABASE=woorkroom

# Postgres (Companys service)
DATABASE_COMPANY_HOST=db
DATABASE_COMPANY_PORT=5432
DATABASE_COMPANY_USER=root
DATABASE_COMPANY_PASSWORD=root
DATABASE_COMPANY_DATABASE=woorkroom

# SMTP (dev можна підключити до Mailpit)
SMTP_HOST=mailpit
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=
SMTP_FROM_EMAIL=no-reply@woorkroom.local
SMTP_FROM_NAME=Woorkroom

# Telegram
TELEGRAM_BOT_TOKEN=
```

Примітки:

- Для локального запуску без Docker, значення `*_HOST` зазвичай мають бути `localhost`.
- Для Docker, `*_HOST` мають відповідати іменам сервісів в `docker-compose.yml` (`db`, `redis`, `rabbitmq`, `mailpit`).

## Локальний запуск без Docker (опційно)

Якщо ти хочеш запускати сервіси на хості:

1. Підніми інфраструктуру:

```bash
docker compose -f docker-compose.local.yml up -d
```

2. Встанови залежності:

```bash
npm install
```

3. Запускай потрібний app:

```bash
npx nest start gateway --watch
```

Аналогічно:

```bash
npx nest start users --watch
npx nest start authorization --watch
```

## Корисні команди

```bash
make build
make restart
make down
make reset
```

Також є скрипт збірки всіх apps/libs:

```bash
npm run build:all
```

## Troubleshooting

- Якщо не підхоплюються env змінні в Docker: переконайся, що створено саме файл `.env` (docker-compose підключає `env_file: .env`).
- Якщо watch в Docker “не бачить” змін: в compose вже увімкнені `CHOKIDAR_USEPOLLING` / `CHOKIDAR_INTERVAL`.
