# RAYA backup / restore kit

Encrypted, off-box, **append-only** backups of RAYA via [restic](https://restic.net) →
Backblaze B2. Designed so that if RAYA is lost (or ransomwared), you rebuild from GitHub +
B2 with the runbook in [`RECOVERY.md`](./RECOVERY.md).

## What it backs up
All of RAYA's real state lives in bind-mounts under a few dirs (verified: Docker named
volumes total ~130 KB), so the backup is just:

- `/srv/docker` — every stack, incl. **NPM config + certs**, the Minecraft world, File Browser
- `/srv/preview` — preview slots + shared nginx.conf
- `/var/www` — static web roots
- **Live DB dumps** — auto-detected `postgres` / `mariadb` containers (a no-op today, ready
  the moment a CMS stack exists)

## Why two keys (the security bit)
- **RAYA holds an append-only B2 key** (write, but *no delete*). A compromised RAYA can add
  snapshots but **cannot erase your history**.
- **Retention/pruning runs from your Mac** with a separate full key that never touches RAYA.
- restic encrypts everything client-side, so B2 only ever sees ciphertext.

---

## One-time setup

### 1. Backblaze B2
- Create a private bucket, e.g. `raya-backups`. Enable **Object Lock / versioning**.
- Create **two** application keys scoped to that bucket:
  - `raya-append` → `listBuckets, listFiles, readFiles, writeFiles` (**no** deleteFiles) — goes on RAYA
  - `maint-full` → all capabilities incl. `deleteFiles` — stays on your Mac only

### 2. On RAYA
```bash
sudo apt update && sudo apt install -y restic

# encryption passphrase (store it in your password manager too — losing it = losing the backups)
printf 'a-long-random-passphrase\n' | sudo install -m600 /dev/stdin /etc/raya-backup.pass

sudo cp ops/raya/.env.example /etc/raya-backup.env    # edit: repo + the raya-append key
sudo chmod 600 /etc/raya-backup.env

# init the repo (first time only) + first backup
sudo -E bash -c 'set -a; . /etc/raya-backup.env; set +a; restic init'
sudo ops/raya/backup.sh
```

### 3. Schedule it (systemd timer)
```bash
sudo cp ops/raya/raya-backup.service ops/raya/raya-backup.timer /etc/systemd/system/
sudo sed -i "s#/opt/cryark-ops#$(pwd)#" /etc/systemd/system/raya-backup.service   # fix ExecStart path
sudo systemctl daemon-reload && sudo systemctl enable --now raya-backup.timer
systemctl list-timers raya-backup.timer
```

### 4. On your Mac — retention (run monthly-ish)
```bash
brew install restic
mkdir -p ~/.config/raya-backup
cp ops/raya/.env.example ~/.config/raya-backup/maintain.env   # use the maint-full key
RAYA_BACKUP_ENV=~/.config/raya-backup/maintain.env ops/raya/maintain.sh
```

### 5. Add a swapfile — RAYA currently has none (0 B)
With no swap, a memory spike hard-OOM-kills a container. Cheap insurance:
```bash
sudo fallocate -l 4G /swapfile && sudo chmod 600 /swapfile
sudo mkswap /swapfile && sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

---

## Day-to-day
- **Backups** run themselves (nightly timer). Check: `sudo restic snapshots` on RAYA, or the maint output.
- **Restore / rebuild**: see [`RECOVERY.md`](./RECOVERY.md).
- **Test the restore at least once** into a throwaway VPS. A backup you've never restored is a hope, not a plan.
