# syntax = docker/dockerfile:1

# Adjust BUN_VERSION as desired
ARG BUN_VERSION=1.1.21
FROM oven/bun:${BUN_VERSION}-slim as base

LABEL fly_launch_runtime="Bun"

# Bun app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"
ENV POSTGRES_URL="postgresql://carepulseDb_owner:XsQ87NDpmHeu@ep-polished-poetry-a23wqnsz.eu-central-1.aws.neon.tech/carepulseDb?sslmode=require"
ENV ACCESS_SECRET=61f970605d2b490b863b002f0b1c5cecfcabdbe2a5793d58b129552c14eb292bef0d86e834de54ca9be4e521339fe34d5a0543a2bdd4dd77c07ebf74b9853ee6
ENV REFRESH_SECRET=043a053cabe35869e9944f2a0be05a3d668bad704db5f794f4daee0fac9cd374047ebf2fd902e73ec976b96682a3958a33b0fe94b0d16575186ffa9628918b0b


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    apt-get install --no-install-recommends -y build-essential pkg-config python-is-python3

# Install node modules
COPY bun.lockb package.json ./
RUN bun install --ci

# Copy application code
COPY . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 3000
CMD [ "bun", "app.ts" ]
