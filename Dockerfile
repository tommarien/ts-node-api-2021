FROM node:16.17.0-alpine
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.prod.json ./
COPY src ./src
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:16.17.0-alpine
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
RUN yarn install --frozen-lockfile --prod
COPY --from=0 /usr/dist .
EXPOSE 8080
CMD ["node", "./src/main.js"]
