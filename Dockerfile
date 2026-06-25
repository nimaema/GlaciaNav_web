# syntax=docker/dockerfile:1

# ---- Build the static site ----
FROM node:22-alpine AS build
WORKDIR /app

# Install deps from the lockfile for reproducible builds
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ---- Serve with nginx ----
FROM nginx:1.27-alpine AS runtime

# SPA-aware config (gzip, caching, security headers)
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Static output
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Lightweight healthcheck for the container
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -qO- http://127.0.0.1/ >/dev/null 2>&1 || exit 1

# nginx:alpine already runs `nginx -g 'daemon off;'`
