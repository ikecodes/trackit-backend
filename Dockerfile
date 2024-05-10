FROM --platform=linux/amd64 node:16-alpine

WORKDIR /

COPY package*.json ./

RUN npm install --omit=dev

COPY . .

EXPOSE 8080

CMD ["npm","start"]