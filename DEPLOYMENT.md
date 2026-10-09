# Production deployment — soakingarri frontend

The React/Vite SPA runs on an EC2 box behind nginx, which also proxies the API so
the browser only ever talks to one origin.

| | |
|---|---|
| **URL** | **https://app.soakingarri.com** |
| **Host** | `100.27.246.63` (Amazon Linux 2023, x86_64, 2 vCPU / 1.9 GB) |
| **Instance** | `i-066718d55e263a515`, security group `launch-wizard-3` (80 + 443 open) |
| **SSH** | `ssh -i key/frontend-sg.pem ec2-user@100.27.246.63` |
| **DNS** | `app.soakingarri.com` is **proxied through Cloudflare** — it resolves to Cloudflare IPs, not to this box |
| **Certificate** | Let's Encrypt, `app.soakingarri.com`, auto-renewing |
| **API** | `api.soakingarri.com`, a separate instance — not managed from this box |

### Request path

```
browser --TLS--> Cloudflare edge --TLS--> this box :443 --TLS--> api.soakingarri.com
```

TLS is terminated three times, and every hop is encrypted. Two consequences that
are easy to trip over:

- **Cloudflare's SSL/TLS mode must stay on Full or Full (strict).** On *Flexible*
  Cloudflare would talk to this box over port 80, hit the HTTPS redirect, and
  loop. The certificate here is publicly trusted, so **Full (strict)** is correct
  and is what you should use.
- **Cloudflare caches and can serve stale assets.** If a deploy looks like it did
  not land, purge the Cloudflare cache before debugging anything on the server.

`http://100.27.246.63` still serves the app directly, bypassing Cloudflare, as a
debugging path. **Logins do not work over it** — see
[the cookie note](#why-the-api-is-proxied-rather-than-called-directly).

---

## Deploying an update

Push to `main`, then:

```bash
ssh -i key/frontend-sg.pem ec2-user@100.27.246.63
deploy-frontend
```

That fetches `origin/main`, builds it, publishes the result atomically and
reloads nginx. It ends with `deployed main @ <sha>`; anything else means the
site was left on the previous build.

Run it as `ec2-user`, **not** `sudo deploy-frontend` — it escalates on its own for
the nginx reload, and running the whole thing as root leaves release directories
root-owned.

Other forms:

```bash
deploy-frontend some-branch    # deploy a branch, tag or full sha
deploy-frontend --list         # releases, newest first; * marks live
deploy-frontend --rollback     # swap back to the previous release
deploy-frontend --install      # reinstall the script itself from the repo
deploy-frontend --help
```

`--rollback` only moves a symlink, so it takes effect instantly and needs no
rebuild. It alternates: running it twice returns you to where you started.

### Where the script lives

The canonical source is **[`scripts/deploy.sh`](scripts/deploy.sh) in this repo**.
`/usr/local/bin/deploy-frontend` is an installed copy of it, which is what puts it
on `$PATH` for anyone who SSHes in.

To change how deploys work, edit `scripts/deploy.sh`, push, then on the server:

```bash
deploy-frontend            # pulls the new script in with everything else
deploy-frontend --install  # copy it over /usr/local/bin/deploy-frontend
```

A deploy warns when the two have drifted, so a stale installed copy announces
itself instead of quietly running forever.

Do **not** run `/opt/soakingarri-frontend/scripts/deploy.sh` expecting it to be
special — it is the same file, and the script copies itself to a temp file and
re-execs before touching git precisely so that `git reset --hard` cannot rewrite
it out from under a running bash process.

### What a deploy actually does

1. `git fetch` + `git reset --hard origin/<ref>` in `/opt/soakingarri-frontend`
   — **the checkout is disposable; never keep local edits there.**
2. Copies `/etc/soakingarri/frontend.env` in as `.env.production`.
3. `npm ci && npm run build` (this runs `tsc -b`, so a type error fails the deploy).
4. Copies `dist/` to `/var/www/soakingarri/releases/<UTC timestamp>-<sha>`.
5. Atomically repoints the `current` symlink, verifies the config, reloads nginx.
6. Prunes to the 5 newest releases and checks `/healthz`.

Because the symlink swap is the last step, a failed build leaves the running
site untouched.

---

## Layout on the server

| Path | What |
|---|---|
| `/opt/soakingarri-frontend` | git checkout + build workspace (disposable) |
| `/var/www/soakingarri/releases/` | built releases, 5 kept |
| `/var/www/soakingarri/current` | symlink to the live release; nginx's root |
| `/etc/soakingarri/frontend.env` | build-time config, survives `git clean` |
| `/etc/soakingarri/DEPLOYMENT.md` | this doc |
| `/usr/local/bin/deploy-frontend` | the deploy script, installed copy of `scripts/deploy.sh` |
| `/etc/nginx/conf.d/soakingarri.conf` | the three server blocks (80 redirect, 80 bare-IP, 443) |
| `/etc/nginx/soakingarri-app.conf` | the app body, included by the 80 and 443 blocks |
| `/etc/nginx/soakingarri-acme.conf` | Let's Encrypt challenge location, included by all blocks |
| `/etc/nginx/soakingarri-realip.conf` | Cloudflare ranges for real-visitor-IP restoration |
| `/etc/letsencrypt/live/app.soakingarri.com/` | certificate and key |
| `/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh` | reloads nginx after a renewal |
| `/var/www/acme/` | ACME webroot, stable across deploys |
| `/etc/nginx/nginx.conf.orig` | untouched stock config, for reference |

The app body lives in its own file because the port-80 (bare IP) and port-443
blocks both serve it. Editing `soakingarri-app.conf` changes both at once, which
is the point — they must not drift.

---

## How requests are routed

nginx is the only thing listening. It serves the SPA and proxies the API:

- `/api/*` to `https://api.soakingarri.com` (same URI, `Host` rewritten)
- `/assets/*` — fingerprinted build output, cached one year immutable
- `/.well-known/acme-challenge/*` — certificate renewal, plain HTTP, never redirected
- `/healthz` — returns `ok`, used by the deploy script
- anything with a dot-segment (`/.env`, `/.git/…`) — `404`
- everything else — `index.html`, so client-side routes survive a hard refresh

`index.html` is served `no-store` on purpose. Caching it would pin browsers to an
old build whose hashed asset filenames no longer exist.

The dotfile rule exists because scanners constantly probe for `/.env` and the SPA
fallback would otherwise answer `200` with the app shell. Nothing was ever
exposed — no env file is inside the served directory — but `404` is the honest
answer. The ACME location uses `^~`, which nginx matches ahead of any regex
location, so the dotfile rule cannot shadow certificate renewal.

Visitor IPs are restored from Cloudflare's `CF-Connecting-IP` header, so the
access log shows real clients rather than Cloudflare edge IPs. The header is only
trusted when the connecting peer is inside Cloudflare's published ranges, so it
cannot be forged by someone hitting the origin IP directly.

### Why the API is proxied rather than called directly

`VITE_API_BASE_URL` is deliberately **empty**, so the app requests same-origin
`/api/v1/*` and nginx forwards them. This mirrors the Vite dev proxy in
`vite.config.ts` and buys two things:

- **No CORS.** The browser never makes a cross-origin request.
- **The cookie domain is rewritten** to whatever host the browser used, so the
  API's `.soakingarri.com` cookies apply correctly.

**Logins only work over `https://app.soakingarri.com`, not over the bare IP.**
While this box was HTTP-only the config stripped the `Secure` flag off auth
cookies, because browsers discard `Secure` cookies received over plain HTTP. That
line was deliberately removed when TLS went on — keeping it would have been
exactly the downgrade the certificate exists to prevent. The trade-off is that
`http://100.27.246.63` can serve pages but cannot hold a session. That is the
correct trade: use the real hostname.

To switch to direct browser-to-API calls instead, set
`VITE_API_BASE_URL=https://api.soakingarri.com` in `/etc/soakingarri/frontend.env`
and redeploy — but the API must then allow this origin in CORS. Since the site is
now served from `app.soakingarri.com`, the cookie scoping would work; the CORS
configuration on the API side is the remaining blocker.

---

## Changing configuration

Build-time config is baked into the bundle, so **editing it requires a rebuild**:

```bash
sudo vi /etc/soakingarri/frontend.env
deploy-frontend
```

Editing nginx does not need a rebuild:

```bash
sudo vi /etc/nginx/conf.d/soakingarri.conf
sudo nginx -t && sudo systemctl reload nginx
```

Always `nginx -t` before reloading — a reload with a broken config is refused,
and a restart with one leaves the site down.

---

## TLS and certificates

Already done and self-maintaining. This section is reference, not a checklist.

The certificate is a **Let's Encrypt** cert for `app.soakingarri.com`, obtained
with `certbot certonly --webroot` — deliberately *not* `certbot --nginx`, so
certbot never rewrites the vhost and the config stays readable.

```bash
sudo certbot certificates                 # what is installed and when it expires
sudo systemctl list-timers certbot-renew.timer
sudo certbot renew --dry-run              # prove renewal still works, changes nothing
```

### How renewal works

`certbot-renew.timer` runs twice daily and renews inside the last 30 days of
validity. The challenge is served from `/var/www/acme` over **plain HTTP on port
80**, which is why the port-80 blocks serve `/.well-known/acme-challenge/` and
never redirect it. After a successful renewal,
`/etc/letsencrypt/renewal-hooks/deploy/reload-nginx.sh` reloads nginx so the new
certificate is actually picked up — without that hook the cert renews on disk
while nginx keeps serving the expired one until something else reloads it.

Three things would break renewal, all of them worth knowing before you change
anything:

- **Closing port 80** in the security group. It must stay open even though all
  human traffic is HTTPS.
- **Turning on "Always Use HTTPS" in Cloudflare** *and* having it intercept the
  challenge path. Renewal currently works because Cloudflare passes port-80
  requests through to this box.
- **Grey-clouding the DNS record** is fine; renewal still works, and the
  certificate is publicly trusted, so the site keeps working without Cloudflare.

### Reissuing, or adding another hostname

```bash
sudo certbot certonly --webroot -w /var/www/acme \
  -d app.soakingarri.com -d another.soakingarri.com
sudo nginx -t && sudo systemctl reload nginx
```

Add the new name to `server_name` in `conf.d/soakingarri.conf` too. The ACME
account here is registered **without an email address**, so Let's Encrypt sends
no expiry warnings — auto-renewal is the only thing standing between you and an
expired certificate. That is why the dry-run above is worth running if you ever
change the nginx or Cloudflare configuration.

### If you ever move off Cloudflare

Point the A record straight at `100.27.246.63`. Nothing on the box needs to
change: the certificate is publicly trusted, so browsers accept it directly. Only
`soakingarri-realip.conf` becomes inert, and it is harmless when unused.

## Troubleshooting

```bash
sudo systemctl status nginx
sudo tail -f /var/log/nginx/soakingarri.error.log
sudo tail -f /var/log/nginx/soakingarri.access.log
curl -I http://127.0.0.1/healthz
```

**Site is 404 or blank** — check that `readlink -f /var/www/soakingarri/current`
points at a directory containing `index.html`.

**Deploy fails on `tsc`** — a real type error on the branch. Fix it in the repo
and push; the live site is untouched.

**Logins fail, or requests 502** — test the proxy path directly:

```bash
curl -i http://127.0.0.1/api/v1/auth/me     # expect 401, not 502
```

A 502 means nginx cannot reach the API box — check that instance and its security
group. A 401 means the proxy is healthy and the problem is in the app or the API.

**The API instance changed IP** — nginx re-resolves `api.soakingarri.com` every
30s via the VPC resolver (`169.254.169.253`), so this heals itself without a
reload. That is why `proxy_pass` uses a variable rather than a literal hostname;
with a literal, nginx resolves once at startup and pins that IP forever.

**Out of memory during build** — a 2 GB swapfile at `/swapfile` backs the 1.9 GB
of RAM (`swapon --show` to confirm; it is in `/etc/fstab`, so it survives reboot).

### Cloudflare-specific symptoms

Test the origin directly first — this bypasses Cloudflare entirely and tells you
which side the fault is on:

```bash
curl -sv --resolve app.soakingarri.com:443:100.27.246.63 \
  https://app.soakingarri.com/healthz
```

**Cloudflare error 521** — Cloudflare cannot open a connection to this box on
port 443. Either nginx is down (`systemctl status nginx`), or port 443 is closed
in the security group. This is exactly what the site showed before TLS was set
up, because Cloudflare was already in Full mode while nothing listened on 443.

**Cloudflare error 526** — the origin certificate failed validation under Full
(strict). Check it has not expired: `sudo certbot certificates`.

**A redirect loop** — Cloudflare's SSL mode was switched to Flexible. Cloudflare
then requests over port 80, this box redirects to HTTPS, and round it goes. Set
the mode back to Full (strict).

**A deploy does not appear** — Cloudflare is serving a cached copy. Purge its
cache. `index.html` is sent `no-store` so this should be rare, but hashed assets
are cached for a year by design.

---

## Notes on how this box was set up

- Installed `nginx`, `git`, `nodejs 22` (NodeSource), and `certbot`.
- Added a 2 GB swapfile — a Vite build on 1.9 GB of RAM is tight without one.
- Removed the stock catch-all `server` block from `nginx.conf`, and enabled gzip.
  The original is kept as `nginx.conf.orig`.
- Split the vhost into three server blocks (port 80 redirect for the hostname,
  port 80 plain for the bare IP, port 443 for the site) sharing one app include,
  so the two entry points cannot drift apart.
- Issued the certificate with `certbot certonly --webroot`, **not**
  `certbot --nginx`. The nginx installer plugin rewrites the vhost in place; the
  webroot method leaves the hand-written config alone and only manages the cert.
- TLS settings follow Mozilla's "intermediate" profile. `ssl_stapling` is
  deliberately off — Let's Encrypt has retired OCSP, so enabling it only fills
  the error log with warnings.
- nginx is `systemctl enable`d and `certbot-renew.timer` is enabled, so both
  return after a reboot.

`vercel.json` is still in the repo and is inert here — the nginx `try_files`
fallback does the same job. Leave it if the Vercel deployment is still live.
