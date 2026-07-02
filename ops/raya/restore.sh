#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Restore RAYA state from the latest (or a given) restic snapshot.
# Run on a freshly provisioned box AFTER installing docker + restic and placing
# /etc/raya-backup.env + the passphrase. Full runbook: RECOVERY.md.
#   usage:  ./restore.sh [snapshot-id | latest]
# ---------------------------------------------------------------------------
set -euo pipefail

ENV_FILE="${RAYA_BACKUP_ENV:-/etc/raya-backup.env}"
[ -f "$ENV_FILE" ] || { echo "Missing env file: $ENV_FILE"; exit 1; }
set -a; . "$ENV_FILE"; set +a

SNAP="${1:-latest}"
DUMP_DIR="${DUMP_DIR:-/srv/backups/dumps}"

echo "Restoring snapshot '$SNAP' → /  (/srv/docker, /srv/preview, /var/www, DB dumps)"
read -rp "This OVERWRITES those paths on THIS box. Continue? [y/N] " ok
[ "$ok" = y ] || { echo "aborted"; exit 1; }

restic restore "$SNAP" --target /

cat <<EOF

Files restored. Next steps:
  1) Bring up every stack:
       for d in /srv/docker/*/; do (cd "\$d" && docker compose up -d); done
  2) Restore any database dumps from ${DUMP_DIR}/ into their containers, e.g.:
       cat ${DUMP_DIR}/<container>.sql | docker exec -i <container> psql -U postgres
  3) Confirm NPM is routing (its config + certs were restored) and that DNS
     points at THIS box's IP. See RECOVERY.md.
EOF
