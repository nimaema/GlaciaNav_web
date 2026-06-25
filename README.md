# GlaciaNav One-Pager

The GlaciaNav startup one-pager: a single-page site built for mentors and
maritime partners. React + Vite + TypeScript + Tailwind v4 + shadcn/ui,
served as a static site behind a Cloudflare Tunnel.

## Weekly updates

All page copy lives in one file: [`src/content.ts`](src/content.ts).

To update the page each week:

1. Edit the relevant section in `src/content.ts`.
2. Bump `meta.lastUpdated`.
3. Commit and push to `main`. GitHub Actions rebuilds and publishes the image;
   redeploy on the server (see below).

No layout code needs touching for a content change.

## Local development

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # type-check + production build into dist/
npm run preview  # serve the production build locally
```

## How deployment works

```
internet  ->  Cloudflare  ->  cloudflared (Hetzner)  ->  web:80 (nginx)
```

- The site is built into a static bundle and served by **nginx** in one image.
- That image is built and pushed to **GitHub Container Registry (GHCR)** by
  [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) on every push to `main`.
- On the Hetzner server, `docker compose` runs two containers: the `web` image
  and the official `cloudflared` connector. The web container is never exposed
  to the host; only the tunnel reaches it.

### Image name

The workflow publishes to `ghcr.io/<owner>/<repo>` (lowercased), tagged
`latest`, `sha-<commit>`, and any `v*` git tag. After the first successful run,
make the GHCR package **public** (Package settings > Change visibility) so the
server can pull it without auth, or log the server in with a `read:packages` PAT:

```bash
echo "$GHCR_PAT" | docker login ghcr.io -u <github-user> --password-stdin
```

## First-time server setup (Hetzner)

Requires Docker + the Docker Compose plugin.

```bash
# 1. Get the deploy files onto the server (clone, or copy these two files):
#      docker-compose.yml  and  .env.example
git clone https://github.com/<owner>/<repo>.git glacianav && cd glacianav

# 2. Configure secrets
cp .env.example .env
#    Edit .env and set:
#      CLOUDFLARE_TUNNEL_TOKEN=...   (from Cloudflare Zero Trust > Tunnels)
#      WEB_IMAGE=ghcr.io/<owner>/<repo>:latest

# 3. Start
docker compose pull
docker compose up -d
```

### Cloudflare Tunnel config

In **Cloudflare Zero Trust > Networks > Tunnels**:

1. Create a tunnel and copy its token into `.env` as `CLOUDFLARE_TUNNEL_TOKEN`.
2. Under the tunnel's **Public Hostnames**, add your domain and point the
   service to **`http://web:80`** (the compose service name, on the shared
   network). No ports need to be opened on the Hetzner firewall.

## Auto-deploy on push (recommended)

The compose stack includes a **watchtower** service that polls GHCR every 60s
and, when the GitHub Actions build publishes a new `web` image, pulls it and
restarts the container automatically. So the full flow is:

```
push to main  ->  Actions builds + pushes image to GHCR  ->  watchtower redeploys
```

Nothing to run on the server after the initial `docker compose up -d`. Watchtower
only watches the `web` container (it carries the `watchtower.enable=true` label),
so the Cloudflare tunnel is never disrupted. If the GHCR package is **private**,
uncomment the `~/.docker/config.json` mount in `docker-compose.yml` and
`docker login ghcr.io` once on the server so watchtower can pull.

### Alternative: instant SSH deploy

For zero-delay deploys instead of 60s polling, add an SSH step to the workflow
that runs `docker compose pull && docker compose up -d` on the server. It needs a
deploy SSH key in repo secrets and the server reachable over SSH. Watchtower is
simpler and needs no secrets, so it is the default here.

## Redeploying manually

```bash
docker compose pull && docker compose up -d
```

(Or pin `WEB_IMAGE` to a specific `sha-...` tag for reproducible rollouts.)

## Project structure

```
src/
  content.ts              # all page copy + team + meta (edit weekly)
  App.tsx                 # composes the sections
  components/site/        # one component per section + shared helpers
  components/ui/          # shadcn/ui primitives
  index.css               # brand tokens (teal palette) + type system
public/                   # brand logos + favicon
Dockerfile                # multi-stage: build -> nginx
nginx.conf                # SPA fallback, gzip, caching, security headers
docker-compose.yml        # web + cloudflared
.github/workflows/        # build & push image to GHCR
```
