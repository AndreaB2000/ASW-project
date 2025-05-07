# This is the client dockerfile
FROM node:22-alpine
WORKDIR /var/app
EXPOSE 4713

COPY ./src/ ./src/
COPY ./test/ ./test/
COPY ./public/ ./public/
COPY ./* ./

RUN npm install
RUN npm run build

CMD ["npm", "start"]
