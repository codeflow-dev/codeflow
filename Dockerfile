FROM node:latest

WORKDIR /app

RUN apt update && apt install g++

COPY package*.json .

RUN npm ci

COPY . .

CMD ["npm", "run", "dev"]
