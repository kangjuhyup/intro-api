FROM node:18-alpine AS builder

WORKDIR /usr/src/app

COPY .yarn/ .yarn/
COPY .yarnrc.yml .yarnrc.yml
COPY package.json yarn.lock ./

RUN yarn install --immutable

COPY . .

RUN yarn build

FROM node:18-alpine AS production

WORKDIR /usr/src/app

COPY --from=builder /usr/src/app/.yarn/ .yarn/
COPY --from=builder /usr/src/app/.yarnrc.yml .yarnrc.yml
COPY --from=builder /usr/src/app/package.json /usr/src/app/yarn.lock ./
COPY --from=builder /usr/src/app/.pnp.cjs .pnp.cjs
COPY --from=builder /usr/src/app/.pnp.loader.mjs .pnp.loader.mjs

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD ["yarn", "start:prod"]
