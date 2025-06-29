# This is the server dockerfile
FROM node:22-alpine
WORKDIR /var/app
EXPOSE 3000
RUN apk add --no-cache bash

ARG NODE_ENV=production
ARG DOCKER=true

ENV NODE_ENV=${NODE_ENV}
ENV DOCKER=${DOCKER}

COPY . .

RUN npm install --include=dev
RUN npm run build

CMD ["npm", "start"]
