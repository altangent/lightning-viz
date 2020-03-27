FROM node:10
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --no-save --production
COPY . .

USER node
ENV NODE_ENV=production
ENTRYPOINT ["npm", "start"]


