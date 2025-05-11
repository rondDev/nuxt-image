# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM oven/bun:1 AS base
WORKDIR /app

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install -y build-essential pkg-config python-is-python3

ENV NODE_ENV="production"

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS build
COPY --link package.json bun.lock ./
RUN bun install --frozen-lockfile --ci --production

COPY --link . .

RUN bun run build --dotenv

# copy production dependencies and source code into final image
FROM base AS release
COPY --from=build /app /app

# run the app
USER bun
EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "index.mjs" ]
