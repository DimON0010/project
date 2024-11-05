FROM node:22-slim AS builder

ENV NODE_ENV production

WORKDIR /app

COPY package.json yarn.lock .yarnrc.yml ./

RUN corepack enable && \
    yarn set version $(npm pkg get packageManager | sed 's/.*@//;s/"//') && \
    yarn --immutable

COPY . .

RUN yarn build

FROM gcr.io/distroless/nodejs22-debian12:nonroot

WORKDIR /app

COPY --from=builder /app .

CMD ["dist/main"]
