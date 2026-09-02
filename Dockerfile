# syntax=docker/dockerfile:1.7

ARG NODE_IMAGE=node:22.22.3-alpine@sha256:e58326d0d441090181ac150dc2078d3e2cf6a0d42e809aebba3ef5880935ffdd
ARG NGINX_IMAGE=nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284

# The Astro output is architecture-neutral. Keep Node/npm on the native builder
# platform so multi-arch publication does not execute npm under QEMU.
FROM --platform=$BUILDPLATFORM ${NODE_IMAGE} AS build

WORKDIR /app
ENV ASTRO_TELEMETRY_DISABLED=1

COPY package.json package-lock.json ./
RUN --mount=type=cache,target=/root/.npm npm ci --no-audit --no-fund

COPY . .
RUN npm run build

FROM ${NGINX_IMAGE} AS runtime

COPY deployment/nginx/container-nginx.conf /etc/nginx/nginx.conf
COPY deployment/nginx/local-smoke.conf /etc/nginx/conf.d/default.conf
COPY deployment/nginx/maps.conf /etc/nginx/smartcontrol/maps.conf
COPY deployment/nginx/site-rules.conf /etc/nginx/smartcontrol/site-rules.conf
COPY --from=build --chown=nginx:nginx /app/dist/ /srv/site/

RUN mkdir -p \
      /tmp/client_temp \
      /tmp/proxy_temp \
      /tmp/fastcgi_temp \
      /tmp/uwsgi_temp \
      /tmp/scgi_temp \
    && chown -R nginx:nginx /tmp/client_temp /tmp/proxy_temp /tmp/fastcgi_temp /tmp/uwsgi_temp /tmp/scgi_temp \
    && nginx -t

USER nginx
EXPOSE 8080
STOPSIGNAL SIGQUIT

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget -q -O /dev/null http://127.0.0.1:8080/ || exit 1

# Skip the base image's root-oriented entrypoint mutations. The configuration
# and static site are complete and immutable at build time.
ENTRYPOINT []
CMD ["nginx", "-g", "daemon off;"]
