FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm cache clean --force
RUN npm install --legacy-peer-deps
COPY . . 
CMD ["node", "index.js"]

