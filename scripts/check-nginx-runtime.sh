#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
NGINX_IMAGE="nginx:1.28.0-alpine@sha256:30f1c0d78e0ad60901648be663a710bdadf19e4c10ac6782c235200619158284"
CONTAINER_NAME="smartcontrol-nginx-smoke-$$"
ORIGIN="http://127.0.0.1:18080"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

test -f "$ROOT_DIR/dist/index.html"

COMMON_MOUNTS=(
  -v "$ROOT_DIR/dist:/srv/site:ro"
  -v "$ROOT_DIR/deployment/nginx:/etc/nginx/smartcontrol:ro"
  -v "$ROOT_DIR/deployment/nginx/local-smoke.conf:/etc/nginx/conf.d/default.conf:ro"
)

docker run --rm "${COMMON_MOUNTS[@]}" "$NGINX_IMAGE" nginx -t
docker run --detach --name "$CONTAINER_NAME" -p 127.0.0.1:18080:8080 \
  "${COMMON_MOUNTS[@]}" "$NGINX_IMAGE" >/dev/null

for attempt in {1..20}; do
  if curl --fail --silent "$ORIGIN/" >/dev/null; then break; fi
  if [[ "$attempt" == 20 ]]; then
    docker logs "$CONTAINER_NAME"
    exit 1
  fi
  sleep 0.25
done

assert_status() {
  local expected="$1"
  local path="$2"
  local actual
  actual="$(curl --silent --output /dev/null --write-out '%{http_code}' "$ORIGIN$path")"
  [[ "$actual" == "$expected" ]] || {
    echo "Expected $path to return $expected, got $actual" >&2
    exit 1
  }
}

assert_body() {
  local path="$1"
  local marker="$2"
  local body
  body="$(curl --silent --show-error "$ORIGIN$path")"
  [[ "$body" == *"$marker"* ]] || {
    echo "Expected $path to contain: $marker" >&2
    exit 1
  }
}

assert_status 200 /
assert_body / '<html lang="ro">'
assert_status 200 /en/
assert_body /en/ '<html lang="en">'
assert_status 301 /servicii
assert_status 404 /__nginx-runtime-missing
assert_body /__nginx-runtime-missing 'Pagina nu a fost găsită'
assert_status 404 /en/__nginx-runtime-missing
assert_body /en/__nginx-runtime-missing 'Page not found'

echo "OK: native nginx config, routing, redirects and localized errors passed"
