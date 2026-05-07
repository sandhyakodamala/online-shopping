FROM node:19-alpine as firststage
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . . 
CMD ["node", "index.js"]

