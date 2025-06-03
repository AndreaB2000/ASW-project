# This is the server dockerfile
FROM node:22-alpine
WORKDIR /var/app
EXPOSE 3000
RUN apk add --no-cache bash

COPY . .

RUN if [ -d node_modules ]; then echo 'node_modules present, aborting' && exit; fi

RUN npm install
RUN npm run build

CMD ["npm", "start"]
