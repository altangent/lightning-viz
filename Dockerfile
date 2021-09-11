FROM node:16-alpine
RUN apk add --no-cache python3 make g++ musl-dev linux-headers
WORKDIR /usr/src/app
COPY package.json .
RUN npm install --no-save --production
COPY . .

USER node
ENV NODE_ENV=production
ENTRYPOINT ["npm", "start"]


