# Stage 1: Build React app
FROM node:20-alpine AS build

WORKDIR /app

# Build-time argument for Vite environment variable
ARG VITE_SBP_BACKEND_BASE_URL
ENV VITE_SBP_BACKEND_BASE_URL=$VITE_SBP_BACKEND_BASE_URL

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Stage 2: Serve with Nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Default Nginx configuration for SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html index.htm; \
        try_files $uri $uri/ /index.html; \
    } \
}' > /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]