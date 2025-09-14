FROM node:lts

WORKDIR /app

RUN chown -R node:node /app

COPY --chown=node:node package*.json ./

USER node

RUN npm install

COPY --chown=node:node . .

CMD ["npm", "run", "start"]