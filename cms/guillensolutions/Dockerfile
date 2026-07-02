# Production image for the Payload (Next.js) CMS.
# Matches the standard output of `create-payload-app` (Next standalone build).
# If your generated project differs, keep its Dockerfile and only copy in our
# payload.config.ts + blocks.ts.
FROM node:20-alpine AS base
WORKDIR /home/node/app

FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

FROM base AS build
COPY --from=deps /home/node/app/node_modules ./node_modules
COPY . .
RUN npm run build

FROM base AS runtime
ENV NODE_ENV=production
COPY --from=build /home/node/app/.next ./.next
COPY --from=build /home/node/app/node_modules ./node_modules
COPY --from=build /home/node/app/package.json ./package.json
COPY --from=build /home/node/app/public ./public
COPY --from=build /home/node/app/src ./src
EXPOSE 3000
CMD ["npm", "start"]
