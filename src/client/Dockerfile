# This is the client dockerfile
FROM node:slim AS build

WORKDIR /var/app

ARG VITE_DOCKER
ARG VITE_SERVER_IP
ARG VITE_SERVER_PORT
ARG VITE_SERVER_PROTOCOL

ENV VITE_DOCKER=$VITE_DOCKER
ENV VITE_SERVER_IP=$VITE_SERVER_IP
ENV VITE_SERVER_PORT=$VITE_SERVER_PORT
ENV VITE_SERVER_PROTOCOL=$VITE_SERVER_PROTOCOL

COPY . .

RUN npm install

RUN npm run build

# Nginx stage
FROM nginx:1.27-alpine-slim AS production
COPY --from=build /dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
