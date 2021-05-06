FROM node:14.16.1-alpine AS base

WORKDIR /app

FROM base AS root-deps
COPY package*.json ./
RUN npm i
COPY lerna.json ./

FROM root-deps AS server-deps
COPY packages/server/package*.json ./packages/server/
RUN npx lerna bootstrap

FROM server-deps AS gql-schema
WORKDIR /app/packages/server
COPY packages/server/tsconfig.json ./
COPY packages/server/src/exportSchema.ts ./src/exportSchema.ts
COPY packages/server/src/repositories.ts ./src/repositories.ts
COPY packages/server/src/resolvers ./src/resolvers/
COPY packages/server/src/models ./src/models/
RUN mkdir lib && npm run export-schema && cp lib/schema.graphql /lib/schema.graphql

FROM server-deps AS server
WORKDIR /app/packages/server
COPY packages/server/ ./
CMD ["npm", "run", "dev"]

FROM root-deps AS frontend-deps
COPY packages/frontend/package*.json ./packages/frontend/
RUN npx lerna bootstrap

FROM frontend-deps AS frontend
WORKDIR /app/packages/frontend
COPY packages/frontend/ ./
COPY --from=gql-schema /lib/schema.graphql ./
CMD ["npm", "start"]


