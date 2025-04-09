# 1. Базовий образ
FROM node:18-alpine

# 2. Робоча директорія всередині контейнера
WORKDIR /app

# 3. Копіюємо package.json та lock-файли
COPY package*.json ./

# 4. Встановлюємо залежності
RUN npm install --force

# 5. Копіюємо решту проєкту
COPY . .

# 6. Генеруємо Prisma клієнт
RUN npx prisma generate

# 7. Білдимо NestJS проєкт
RUN npm run build

# 8. Вказуємо порт
EXPOSE 3001

# 9. Команда запуску
CMD ["node", "dist/main"]
