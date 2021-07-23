#
# Default
#
FROM node:16.5.0-alpine3.13 AS default

RUN mkdir -p /app
WORKDIR /app


#
# Builder
#
FROM default AS builder

# Build sqlite spellfix extension
RUN apk add --no-cache gcc musl-dev sqlite-dev=3.34.1-r0 wget
RUN wget --quiet -P data https://github.com/sqlite/sqlite/raw/version-3.34.1/ext/misc/spellfix.c
RUN gcc -fPIC -shared -O3 data/spellfix.c -o data/spellfix.so

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
COPY --from=builder /app/data/spellfix.so ./data/
COPY ormconfig.js .
COPY data/morphology.sqlite3 ./data/

CMD ["node", "build/server/main"]
