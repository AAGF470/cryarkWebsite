#!/usr/bin/env bash
# ---------------------------------------------------------------------------
# Retention + integrity — run from a TRUSTED machine (your Mac), NOT RAYA.
# Uses the FULL B2 key (with deleteFiles), kept off RAYA, so pruning can never
# be triggered by a compromised server.
# ---------------------------------------------------------------------------
set -euo pipefail

ENV_FILE="${RAYA_BACKUP_ENV:-$HOME/.config/raya-backup/maintain.env}"
[ -f "$ENV_FILE" ] || { echo "Missing env file: $ENV_FILE"; exit 1; }
set -a; . "$ENV_FILE"; set +a

echo "-- forget + prune (keep 7 daily / 4 weekly / 6 monthly) --"
restic forget --tag raya \
  --keep-daily 7 --keep-weekly 4 --keep-monthly 6 --prune

echo "-- integrity check --"
restic check

echo "-- current snapshots --"
restic snapshots --tag raya
