FROM node:12-alpine

WORKDIR /usr/src/app

COPY . .

RUN yarn && yarn workspace @bots/jira build

CMD [ "yarn", "workspace", "@bots/jira", "start" ]
