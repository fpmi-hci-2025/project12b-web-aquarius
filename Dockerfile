# Этап сборки React-приложения
FROM node:18-alpine AS build

WORKDIR /app

COPY bookstore/package*.json ./
RUN npm ci

COPY bookstore/. .
RUN npm run build

# Этап запуска через nginx
FROM nginx:alpine

# Vite → артефакты лежат в /app/dist
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx/default.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
