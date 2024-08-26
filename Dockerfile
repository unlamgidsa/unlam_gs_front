ARG NODE_VERSION=18.0.0

FROM node:${NODE_VERSION}-alpine

WORKDIR /usr/src/app

RUN apk add git
COPY . .
RUN npm install
USER node
EXPOSE 8080
RUN git config --global --add safe.directory /usr/src/app

CMD npm start
