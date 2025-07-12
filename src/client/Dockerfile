# This is the client dockerfile
FROM node:slim AS build
WORKDIR /var/app
COPY . .

ARG VITE_SERVER_IP
ARG VITE_SERVER_PORT
ARG VITE_SERVER_PROTOCOL
ARG VITE_DOCKER

RUN npm install

RUN npm run build

# Nginx stage
FROM nginx:1.29-alpine-slim AS production
COPY --from=build /dist/client /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]