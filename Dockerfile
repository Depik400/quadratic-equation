from node:16.13

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY . .

