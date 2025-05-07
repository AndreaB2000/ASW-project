# This is the server dockerfile
FROM node:22-alpine
WORKDIR /var/app
EXPOSE 3000
RUN apk add --no-cache bash

COPY ./src/ ./src/
COPY ./test/ ./test/
COPY ./views/ ./views/
COPY ./public/ ./public/
COPY ./* ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]
