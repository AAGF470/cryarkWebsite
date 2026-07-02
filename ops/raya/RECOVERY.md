# RAYA — Disaster Recovery Runbook

Rebuild RAYA from nothing. Target: ~30–45 minutes.

## What survives a total loss
Nothing irreplaceable lives on RAYA. It's all in two places:
- **GitHub** — this repo: compose stacks, these ops scripts, site source.
- **Backblaze B2** — encrypted restic snapshots of `/srv/docker`, `/srv/preview`,
  `/var/www`, and any DB dumps.

## Rebuild steps

1. **Provision** a new Hostinger VPS — Ubuntu 25.10, 4 vCPU / 16 GB / 200 GB. Note the new IP.

2. **Base setup**
   ```bash
   # as root on the fresh box
   adduser ag && usermod -aG sudo ag        # your user
   # add your SSH public key to /home/ag/.ssh/authorized_keys, then:
   sed -i 's/^#\?PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
   systemctl restart ssh
   apt update && apt install -y docker.io docker-compose-plugin restic ufw
   ufw allow OpenSSH && ufw allow 80 && ufw allow 443 && ufw --force enable
   ```
   Add the swapfile (see README §5).

3. **Get scripts + secrets**
   ```bash
   sudo git clone <this-repo-url> /opt/cryark-ops
   # restore the two secret files from your password manager:
   sudo install -m600 /dev/stdin /etc/raya-backup.pass   # paste passphrase, Ctrl-D
   sudo cp /opt/cryark-ops/ops/raya/.env.example /etc/raya-backup.env
   sudo nano /etc/raya-backup.env                        # repo + a B2 key (append or full)
   sudo chmod 600 /etc/raya-backup.env
   ```

4. **Restore state**
   ```bash
   sudo /opt/cryark-ops/ops/raya/restore.sh latest
   ```

5. **Bring services up**
   ```bash
   for d in /srv/docker/*/; do (cd "$d" && sudo docker compose up -d); done
   docker ps
   ```

6. **Restore databases** (only if CMS stacks exist)
   ```bash
   cat /srv/backups/dumps/<container>.sql | docker exec -i <container> psql -U postgres
   # mariadb:  ... | docker exec -i <container> sh -c 'exec mysql -uroot -p"$MYSQL_ROOT_PASSWORD"'
   ```

7. **DNS + TLS**
   - Point the domain A records (cryark.net, guillen.studio, guillensolutions.com and
     subdomains) at the **new IP** in Hostinger DNS.
   - NPM's config + Let's Encrypt certs were restored with `/srv/docker`. If any cert is
     expired, NPM re-issues on first HTTPS hit (ports 80/443 must be open — step 2).

8. **Verify**
   - Load each domain. `docker ps` shows all stacks up.
   - In NPM, confirm proxy hosts route to the right container names
     (reminder: cryark.net → `cryark-static`, not `guillen-static`).

## Test before you need it
Run steps 1–8 into a throwaway VPS once, end to end. The first real disaster is the wrong
time to discover a gap. When it works, you've *proven* the "couple of commands."
