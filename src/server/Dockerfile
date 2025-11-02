# This is the server dockerfile
FROM node:24-alpine
WORKDIR /var/app
EXPOSE 3000
RUN apk add --no-cache bash

COPY . .

RUN npm install
RUN npm run build

CMD ["npm", "start"]
