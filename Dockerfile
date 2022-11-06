# syntax=docker/dockerfile:experimental
FROM node:18.9.0-alpine AS base

WORKDIR /app
HEALTHCHECK CMD node /app/healthcheck.js
RUN npm set cache /usr/src/app/.npm

FROM base AS root-deps
COPY package*.json ./
RUN --mount=type=cache,target=/usr/src/app/.npm npm i

FROM root-deps AS server-deps
COPY server/package*.json ./server/
RUN --mount=type=cache,target=/usr/src/app/.npm npm i

FROM server-deps AS gql-schema
WORKDIR /app/server
COPY server/tsconfig.json ./
COPY server/src/exportSchema.ts ./src/exportSchema.ts
COPY server/src/repositories.ts ./src/repositories.ts
COPY server/src/resolvers ./src/resolvers/
COPY server/src/services ./src/services/
COPY server/src/models ./src/models/
COPY server/src/jwt.ts ./src/
RUN mkdir lib && npm run export-schema && cp lib/schema.graphql /lib/schema.graphql

FROM server-deps AS server
WORKDIR /app/server
COPY ormconfig.js /app
COPY server/ ./
COPY health.js ./
CMD ["npm", "run", "dev"]

FROM root-deps AS frontend-deps
COPY frontend/package*.json ./frontend/
RUN --mount=type=cache,target=/usr/src/app/.npm npm i

FROM frontend-deps AS frontend
WORKDIR /app/frontend
COPY frontend/ ./
COPY --from=gql-schema /lib/schema.graphql ./
RUN npm run relay-compiler
COPY health.js ./
CMD ["npm", "run", "dev:docker"]


