FROM --platform=$BUILDPLATFORM node:26.8.1-alpine AS base
LABEL maintainer="Antoine ZANARDI"

ARG TARGETPLATFORM
ARG BUILDPLATFORM
RUN echo "Running on $BUILDPLATFORM, building for $TARGETPLATFORM"

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
ENV CI="true"

RUN npm install -g corepack --force

RUN corepack enable

RUN mkdir -p "$PNPM_HOME" && chown node:node "$PNPM_HOME"

FROM base AS development

RUN apk add --no-cache bash python3 make g++ build-base

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node envs ./
COPY --chown=node:node nuxt.config.ts ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node tsconfig*.json ./
COPY --chown=node:node scripts/post-install-prepare.sh ./scripts/post-install-prepare.sh
COPY --chown=node:node app/i18n ./app/i18n

RUN pnpm install --frozen-lockfile

COPY --chown=node:node app app/
COPY --chown=node:node server server/
COPY --chown=node:node shared shared/
COPY --chown=node:node content.config.ts ./
COPY --chown=node:node content ./content

CMD [ "pnpm", "run", "start:dev" ]

FROM --platform=$BUILDPLATFORM base AS build
ENV NODE_ENV=production

ARG NUXT_PUBLIC_DEFAULT_LOCALE
ENV NUXT_PUBLIC_DEFAULT_LOCALE=${NUXT_PUBLIC_DEFAULT_LOCALE}

ARG NUXT_PUBLIC_SITE_URL
ENV NUXT_PUBLIC_SITE_URL=${NUXT_PUBLIC_SITE_URL}

USER node

WORKDIR /app

COPY --chown=node:node package.json ./
COPY --chown=node:node pnpm-lock.yaml ./
COPY --chown=node:node pnpm-workspace.yaml ./
COPY --chown=node:node nuxt.config.ts ./
COPY --chown=node:node tsconfig.json ./

COPY --chown=node:node app ./app
COPY --chown=node:node server ./server
COPY --chown=node:node shared ./shared
COPY --chown=node:node modules ./modules
COPY --chown=node:node public ./public

COPY --chown=node:node content.config.ts ./
COPY --chown=node:node content ./content

COPY --chown=node:node --from=development /app/node_modules ./node_modules

RUN --mount=type=secret,id=goat_it_api_base_url,env=NUXT_GOAT_IT_API_BASE_URL \
    --mount=type=secret,id=goat_it_api_game_key,env=NUXT_GOAT_IT_API_GAME_KEY \
    --mount=type=secret,id=goat_it_og_image_security_secret,env=NUXT_OG_IMAGE_SECURITY_SECRET \
    pnpm run build

FROM node:26.8.1-alpine AS production

ENV NODE_ENV="production"
ENV PORT=3002
ENV HOST=0.0.0.0

USER node

WORKDIR /app

COPY --from=build --chown=node:node /app/.output ./.output

EXPOSE 3002

HEALTHCHECK --interval=20s --timeout=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3002 || exit 1

CMD ["node", ".output/server/index.mjs"]
