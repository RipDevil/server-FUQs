FROM node:15-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install -q -s
COPY . .
EXPOSE ${PORT:-8080}
CMD ["node", "./src/index.js"]