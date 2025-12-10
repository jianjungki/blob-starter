#!/bin/sh
# Write runtime config file that client can fetch at runtime
RUNTIME_FILE="/app/public/runtime-config.json"

echo "Writing runtime config to ${RUNTIME_FILE}"

cat > "$RUNTIME_FILE" <<EOF
{
  "NEXT_PUBLIC_TASK_API_URL": "${NEXT_PUBLIC_TASK_API_URL:-http://localhost:89}"
}
EOF

exec "$@"
