# Woorkroom Server

Цей репозиторій містить три основні сервіси, які є частиною мікросервісної архітектури для проєкту Woorkroom:

1. **Gateway** - шлюз для маршрутизації запитів.
2. **Woorkroom Server Session** - сервіс для управління сесіями користувачів.
3. **Woorkroom Server Users** - сервіс для управління користувачами.

## Структура репозиторію



### Gateway

Шлюз побудований на основі [NestJS](https://nestjs.com) і відповідає за маршрутизацію запитів до відповідних мікросервісів.

### Woorkroom Server Session

Сервіс для управління сесіями користувачів. Використовує базу даних PostgreSQL для зберігання даних.

### Woorkroom Server Users

Сервіс для управління користувачами. Також використовує базу даних PostgreSQL.

---

## Встановлення

1. Клонувати репозиторій:

```bash
    git clone https://github.com/your-repo/woorkroom-server.git
    cd woorkroom-server
```

2. Встановити залежності для кожного сервісу:

```bash
    cd gateway
    npm install
    cd ../woorkroom-server-session
    npm install
    cd ../woorkroom-server-users
    npm install 
```

Запуск
    Локальний запуск:

1. Запустіть базу даних та інші залежності через Docker Compose:
```bash
        docker-compose up -d
```

2. Запустіть кожен сервіс окремо:

    # Gateway
```bash
    cd gateway
    npm run start:dev
```

# Woorkroom Server Session

```bash
    cd ../woorkroom-server-session
    npm run start:dev
```

# Woorkroom Server Users

```bash
    cd ../woorkroom-server-users
    npm run start:dev
```

Запуск у продакшн-режимі

1. Зберіть кожен сервіс:

```bash
    npm run build
```

2. Запустіть зібрані файли:

```bash
    npm run start:prod
```


Ліцензія
Цей проєкт ліцензовано під MIT. ```