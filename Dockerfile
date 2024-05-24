FROM node:14

WORKDIR /app
COPY package*.json ./
COPY . .

RUN npm ci

CMD ["npm", "run", "dev"]
