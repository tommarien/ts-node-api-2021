FROM node:18.14.0-alpine
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
COPY tsconfig.json ./
COPY tsconfig.prod.json ./
COPY src ./src
COPY migrations ./migrations
COPY migrate-mongo-config.js ./
RUN yarn install --frozen-lockfile
RUN yarn build

FROM node:18.14.0-alpine
WORKDIR /usr
COPY package.json ./
COPY yarn.lock ./
COPY migrate-mongo-config.js ./
RUN yarn install --frozen-lockfile --prod
COPY --from=0 /usr/dist .
COPY --from=0 /usr/migrations ./migrations
EXPOSE 8080
CMD ["node", "./src/main.js"]
