FROM node:10
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080
ENV test test
CMD ["npm", "run", "index"]
