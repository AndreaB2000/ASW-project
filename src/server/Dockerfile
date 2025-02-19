# This is the server dockerfile
FROM node:22-alpine
WORKDIR /var/app
EXPOSE 3000

COPY package*.json ./
COPY ./ ./
# RUN npm install --production
RUN npm install

CMD ["npm", "start"]
