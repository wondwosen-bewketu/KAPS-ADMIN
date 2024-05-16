FROM node:16-alpine
WORKDIR /app
COPY package.json .
RUN npm install --verbose
COPY . .
CMD [ "npm", "start" ]
