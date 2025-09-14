FROM node:23

WORKDIR /temp

COPY . .

RUN npm install
RUN npm run build

RUN mkdir /app
RUN mv dist/* /app

WORKDIR /
RUN rm -rf /temp