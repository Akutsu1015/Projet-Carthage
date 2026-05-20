# Déployer Piston en production

Trois options selon ton infra. Cible : exposer Piston sur HTTPS et le pointer depuis Next.js via `PISTON_URL`.

## Option A — VPS dédié (recommandé)

Sur un VPS Linux (Debian/Ubuntu, root SSH, Docker installé).

```bash
# 1. Cloner le repo ou copier docker-compose.piston.yml + scripts/
git clone https://github.com/Akutsu1015/Projet-Carthage.git
cd Projet-Carthage

# 2. Démarrer Piston
docker compose -f docker-compose.piston.yml up -d

# 3. Installer les runtimes (5–10 min)
bash scripts/piston-install-runtimes.sh

# 4. Reverse proxy Caddy (HTTPS auto via Let's Encrypt)
sudo apt install -y caddy
sudo tee /etc/caddy/Caddyfile > /dev/null <<'EOF'
piston.gamematcher.fr {
    reverse_proxy localhost:2000
    # Restreindre aux IPs de prod (recommandé)
    @blocked not remote_ip 1.2.3.4   # ← IP du serveur Next.js
    respond @blocked 403
}
EOF
sudo systemctl reload caddy
```

Puis dans `.env.local` de l'app Next.js :
```
PISTON_URL=https://piston.gamematcher.fr/api/v2
```

## Option B — Fly.io (machine privileged)

Piston a besoin de `--privileged` pour les cgroups. Fly.io le supporte via `[experimental] privileged = true` dans `fly.toml`. Voir [docs Fly](https://fly.io/docs/reference/configuration/#the-experimental-section).

## Option C — Même VPS que Next.js

Ajouter `docker-compose.piston.yml` au compose principal, exposer en interne (`expose: 2000` sans `ports:`), pointer `PISTON_URL=http://piston:2000/api/v2`. Plus simple mais Piston partage les ressources de l'app.

## Sécurité

- **Ne JAMAIS exposer `/api/v2/packages`** publiquement (permet d'installer n'importe quel runtime) — filtre Caddy :
  ```
  @packages path /api/v2/packages*
  respond @packages 403
  ```
- **IP allowlist** : seul le backend Next.js doit pouvoir POST `/api/v2/execute`
- **Logs** : `docker compose logs -f piston` pour surveiller les abus
- **Backup volume `piston-packages`** une fois les runtimes installés (évite la réinstall en cas de purge)

## Healthcheck

```bash
curl https://piston.gamematcher.fr/api/v2/runtimes
# Doit lister les 5 runtimes installés (python, c++, csharp, dart, javascript)
```
