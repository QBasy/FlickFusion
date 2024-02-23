FROM node:14

WORKDIR /app

COPY /Users/QoidynBasy/Desktop/WebTech_2/package*.json ./

RUN npm install

COPY /Users/QoidynBasy/Desktop/WebTech_2 ./

EXPOSE 1337

CMD ["node", "server.js"]

