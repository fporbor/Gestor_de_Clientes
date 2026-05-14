FROM node:24-alpine

RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
RUN chmod -R 777 /home/node

WORKDIR /home/node/app

COPY --chown=node:node package*.json ./

USER node

RUN npm install && npm install nodemon


COPY --chown=node:node . .

EXPOSE 3600

CMD ["npm", "run", "dev"]
