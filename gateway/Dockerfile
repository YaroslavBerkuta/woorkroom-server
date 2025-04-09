# 1. Базовий образ
FROM node:18-alpine

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json та lock-файли
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install --force

# 5. Копіюємо весь код
COPY . .

# 6. Білдимо NestJS Gateway
RUN npm run build

# 7. Вказуємо порт, на якому працює gateway
EXPOSE 3000

# 8. Запуск
CMD ["node", "dist/main"]
