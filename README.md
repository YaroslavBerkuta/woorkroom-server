📦 Woorkroom Server
Цей репозиторій містить три основні сервіси, які є частиною мікросервісної архітектури для проєкту Woorkroom:

Gateway — шлюз для маршрутизації запитів.

Woorkroom Server Session — сервіс для управління сесіями користувачів.

Woorkroom Server Users — сервіс для управління користувачами.

📁 Структура репозиторію
🚪 Gateway
Шлюз побудований на основі NestJS і відповідає за маршрутизацію запитів до відповідних мікросервісів.

🗝️ Woorkroom Server Session
Сервіс для управління сесіями користувачів. Використовує базу даних PostgreSQL для зберігання даних.

👥 Woorkroom Server Users
Сервіс для управління користувачами. Також використовує базу даних PostgreSQL.

📦 Встановлення
1️⃣ Клонувати репозиторій:
bash
Копіювати
Редагувати
git clone https://github.com/your-repo/woorkroom-server.git
cd woorkroom-server
2️⃣ Встановити залежності для кожного сервісу:
bash
Копіювати
Редагувати
cd gateway
npm install

cd ../woorkroom-server-session
npm install

cd ../woorkroom-server-users
npm install
🚀 Запуск
🛠️ Локальний запуск:
Запустіть базу даних та інші залежності через Docker Compose:

bash
Копіювати
Редагувати
docker-compose up -d
Запустіть кожен сервіс окремо:

Gateway

bash
Копіювати
Редагувати
cd gateway
npm run start:dev
Woorkroom Server Session

bash
Копіювати
Редагувати
cd ../woorkroom-server-session
npm run start:dev
Woorkroom Server Users

bash
Копіювати
Редагувати
cd ../woorkroom-server-users
npm run start:dev
📦 Запуск у продакшн-режимі:
Зберіть кожен сервіс:

bash
Копіювати
Редагувати
npm run build
Запустіть зібрані файли:

bash
Копіювати
Редагувати
npm run start:prod
📄 Ліцензія
Цей проєкт ліцензовано під MIT License.