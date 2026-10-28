FROM node:26-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY index.html tsconfig*.json vite.config.ts vite-env.d.ts ./
COPY src ./src
ENV VITE_API_BASE_URL=/api/v1
RUN npm run build

FROM nginx:1.28-alpine
ENV PILOT_TRUSTED_PROXY=127.0.0.1
COPY nginx.conf /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 8080
