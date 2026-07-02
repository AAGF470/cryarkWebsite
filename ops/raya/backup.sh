#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# RAYA nightly backup — run ON RAYA (systemd timer / cron).
# 1) dumps live databases (auto-detected), 2) pushes an encrypted restic
# snapshot to B2. APPEND-ONLY: uses a B2 key without delete permission, so a
# compromised RAYA can add snapshots but cannot erase history. Retention/prune
# happens from a trusted machine via maintain.sh.
# ---------------------------------------------------------------------------
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ENV_FILE="${RAYA_BACKUP_ENV:-/etc/raya-backup.env}"
[ -f "$ENV_FILE" ] || { echo "Missing env file: $ENV_FILE (copy .env.example)"; exit 1; }
set -a; . "$ENV_FILE"; set +a

DUMP_DIR="${DUMP_DIR:-/srv/backups/dumps}"
PATHS=(/srv/docker /srv/preview /var/www)
mkdir -p "$DUMP_DIR"

echo "[$(date -Is)] === RAYA backup start ==="

# 1) Database dumps ----------------------------------------------------------
# No-op until a CMS stack (postgres/mariadb) is running; then dumps appear
# automatically and get swept into the snapshot below.
echo "-- dumping databases --"
rm -f "$DUMP_DIR"/*.sql 2>/dev/null || true
for c in $(docker ps --format '{{.Names}}'); do
  img="$(docker inspect --format '{{.Config.Image}}' "$c" 2>/dev/null || echo '')"
  case "$img" in
    *postgres*)
      user="$(docker exec "$c" printenv POSTGRES_USER 2>/dev/null || echo postgres)"
      echo "   pg_dumpall: $c (user=$user)"
      docker exec "$c" pg_dumpall -U "$user" > "$DUMP_DIR/${c}.sql" \
        || echo "   WARN: pg dump failed for $c"
      ;;
    *mariadb*|*mysql*)
      pw="$(docker exec "$c" printenv MYSQL_ROOT_PASSWORD 2>/dev/null || echo '')"
      echo "   mysqldump: $c"
      docker exec -e MYSQL_PWD="$pw" "$c" mysqldump -uroot --all-databases > "$DUMP_DIR/${c}.sql" \
        || echo "   WARN: mysql dump failed for $c"
      ;;
  esac
done

# 2) restic snapshot ---------------------------------------------------------
echo "-- restic backup --"
restic backup \
  --tag raya --host raya \
  --exclude-file "$SCRIPT_DIR/restic-excludes.txt" \
  "${PATHS[@]}" "$DUMP_DIR"

echo "[$(date -Is)] === RAYA backup done ==="
