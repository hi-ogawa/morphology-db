#
# Default
#
# FROM node:16.5.0-buster-slim AS default
FROM node:16.5.0-alpine3.13 AS default

RUN mkdir -p /app
WORKDIR /app


#
# Builder
#
FROM default AS builder

COPY package.json package-lock.json ./
RUN npm install

COPY src tsconfig.json ./
RUN npm run build

# For testing
COPY .mocharc.js ./
COPY ormconfig.js .


#
# Runner
#
FROM default AS runner

COPY package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/build ./build
COPY data/ ./data
COPY ormconfig.js .

CMD ["node", "build/server/main"]
