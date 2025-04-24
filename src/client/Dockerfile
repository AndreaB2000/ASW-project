# Build stage
FROM node:slim AS build
WORKDIR /var/app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Nginx stage
FROM nginx:1.27-alpine-slim AS production
COPY --from=build /dist/client /usr/share/nginx/html

# Optional: custom nginx.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]