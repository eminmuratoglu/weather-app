FROM node:17-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN npm install sass --save-dev

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "start"]