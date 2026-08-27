#!/usr/bin/env bash
set -euo pipefail

IMAGE="${1:-smartcontrol-site:ci}"
CONTAINER_NAME="smartcontrol-container-smoke-$$"
ORIGIN="http://127.0.0.1:18081"

cleanup() {
  docker rm -f "$CONTAINER_NAME" >/dev/null 2>&1 || true
}
trap cleanup EXIT

docker run --detach \
  --name "$CONTAINER_NAME" \
  --read-only \
  --tmpfs /tmp:rw,noexec,nosuid,size=64m \
  --cap-drop ALL \
  --security-opt no-new-privileges:true \
  -p 127.0.0.1:18081:8080 \
  "$IMAGE" >/dev/null

for attempt in {1..30}; do
  if curl --fail --silent "$ORIGIN/" >/dev/null; then break; fi
  if [[ "$attempt" == 30 ]]; then
    docker logs "$CONTAINER_NAME"
    exit 1
  fi
  sleep 0.25
done

assert_response() {
  local path="$1"
  local expected_status="$2"
  local marker="$3"
  local response_file
  response_file="$(mktemp)"

  local actual_status
  actual_status="$(curl --silent --show-error --output "$response_file" --write-out '%{http_code}' "$ORIGIN$path")"
  [[ "$actual_status" == "$expected_status" ]] || {
    echo "Expected $path to return $expected_status, got $actual_status" >&2
    exit 1
  }
  grep -Fq "$marker" "$response_file" || {
    echo "Expected $path to contain: $marker" >&2
    exit 1
  }
  rm -f "$response_file"
}

assert_response / 200 '<html lang="ro">'
assert_response /en/ 200 '<html lang="en">'
assert_response /__container-smoke-missing 404 'Pagina nu a fost găsită'
assert_response /en/__container-smoke-missing 404 'Page not found'

[[ "$(docker inspect --format '{{.Config.User}}' "$CONTAINER_NAME")" == "nginx" ]]

echo "OK: rootless read-only container, routes and localized errors passed"
