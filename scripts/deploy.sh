#!/usr/bin/env bash
#
# Deploy the soakingarri frontend to production.
#
# Normal use — ssh to the box and run the installed copy:
#
#     ssh -i key/frontend-sg.pem ec2-user@100.27.246.63
#     deploy-frontend                  # build + publish origin/main
#     deploy-frontend some-branch      # build + publish a branch, tag or sha
#     deploy-frontend --list           # releases, newest first; * marks live
#     deploy-frontend --rollback       # instant revert, no rebuild
#
# This file is the canonical source. /usr/local/bin/deploy-frontend is an
# installed copy of it; refresh that copy after changing this file with:
#
#     deploy-frontend --install
#
# Full docs: /etc/soakingarri/DEPLOYMENT.md (also DEPLOYMENT.md in the repo)
set -euo pipefail

REPO=/opt/soakingarri-frontend
RELEASES=/var/www/soakingarri/releases
CURRENT=/var/www/soakingarri/current
ENV_FILE=/etc/soakingarri/frontend.env
INSTALLED=/usr/local/bin/deploy-frontend
SELF_IN_REPO="$REPO/scripts/deploy.sh"
KEEP=5

log() { printf '\033[1;34m==>\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33mWARN:\033[0m %s\n' "$*" >&2; }
die() { printf '\033[1;31mERROR:\033[0m %s\n' "$*" >&2; exit 1; }

# `git reset --hard` below can rewrite this very file mid-run. bash reads a
# script incrementally from disk by byte offset, so a script that edits itself
# while running executes garbage. Re-exec from a private copy before touching
# git. Harmless when run from /usr/local/bin, so it is unconditional.
if [ "${DEPLOY_REEXEC:-}" != "1" ]; then
  _tmp=$(mktemp "${TMPDIR:-/tmp}/deploy-frontend.XXXXXX")
  cat "$0" >"$_tmp"
  chmod +x "$_tmp"
  DEPLOY_REEXEC=1 exec "$_tmp" "$@"
fi
# From here on $0 is the throwaway copy, so clean it up on the way out.
trap 'rm -f "$0"' EXIT

publish() { # $1 = release dir. Swap the symlink atomically, then reload nginx.
  local rel="$1"
  ln -sfn "$rel" "${CURRENT}.tmp"
  mv -Tf "${CURRENT}.tmp" "$CURRENT"
  sudo nginx -t -q ||
    die "nginx config invalid; $CURRENT now points at $rel but nginx was NOT reloaded"
  sudo systemctl reload nginx
  log "live: $(basename "$rel")"
}

install_self() { # Copy the repo's version over the one on $PATH.
  [ -f "$SELF_IN_REPO" ] || die "$SELF_IN_REPO not found — deploy at least once first"
  sudo install -o root -g root -m 755 "$SELF_IN_REPO" "$INSTALLED"
  log "installed $SELF_IN_REPO -> $INSTALLED"
  exit 0
}

case "${1:-}" in
--install)
  install_self
  ;;
--list)
  ls -1t "$RELEASES" |
    sed "s|^|  |" |
    sed "s|^  $(basename "$(readlink -f "$CURRENT")")$|* &|"
  exit 0
  ;;
--rollback)
  current_rel=$(basename "$(readlink -f "$CURRENT")")
  # `|| true`: head closing the pipe can SIGPIPE grep, and pipefail would turn
  # that into a bogus "no previous release" abort. The [ -n ] below is the real check.
  prev=$(ls -1t "$RELEASES" | grep -v "^${current_rel}$" | head -1 || true)
  [ -n "$prev" ] || die "no previous release to roll back to"
  log "rolling back $current_rel -> $prev"
  publish "$RELEASES/$prev"
  exit 0
  ;;
-h | --help)
  sed -n '3,18p' "$0" | sed 's/^# \{0,1\}//'
  exit 0
  ;;
-*)
  # Without this, an unrecognised flag falls through to the git commands below
  # and is parsed by git as an option, producing a baffling error.
  die "unknown option: $1 (try --help)"
  ;;
esac

REF="${1:-main}"

log "fetching $REF"
cd "$REPO"
git fetch --prune --quiet origin
# Prefer the remote branch; fall back to a raw sha or tag.
if git rev-parse --verify --quiet "origin/$REF" >/dev/null; then
  TARGET="origin/$REF"
else
  TARGET="$REF"
fi
git reset --hard --quiet "$TARGET"
git clean -fdq -e node_modules -e .env.production
SHA=$(git rev-parse --short HEAD)
log "building $REF @ $SHA — $(git log -1 --pretty=%s)"

# Tell the operator when the checked-out script has drifted from the installed
# one, rather than silently running a stale deploy process forever.
if [ -f "$SELF_IN_REPO" ] && [ -f "$INSTALLED" ] &&
  ! cmp -s "$SELF_IN_REPO" "$INSTALLED"; then
  warn "$INSTALLED differs from $SELF_IN_REPO — run 'deploy-frontend --install' to update it"
fi

# Build-time config lives outside the checkout so git clean/reset never eats it.
[ -f "$ENV_FILE" ] || die "missing $ENV_FILE"
cp "$ENV_FILE" "$REPO/.env.production"

npm ci --no-audit --no-fund
npm run build

[ -f "$REPO/dist/index.html" ] || die "build produced no dist/index.html"

STAMP="$(date -u +%Y%m%d-%H%M%S)-${SHA}"
REL="$RELEASES/$STAMP"
rm -rf "$REL"
cp -a "$REPO/dist" "$REL"
chmod -R a+rX "$REL"
log "staged $STAMP"

publish "$REL"

# Prune old releases, never touching the one that is live.
live=$(basename "$(readlink -f "$CURRENT")")
# `|| true`: with pipefail, grep matching nothing (the common case) would abort.
stale=$(ls -1t "$RELEASES" | grep -v "^${live}$" | tail -n +"$KEEP" || true)
for old in $stale; do
  log "pruning $old"
  rm -rf "${RELEASES:?}/${old:?}"
done

code=$(curl -s -o /dev/null -w '%{http_code}' --max-time 10 http://127.0.0.1/healthz || true)
log "healthz: $code"
[ "$code" = "200" ] || die "health check failed — consider: deploy-frontend --rollback"
log "deployed $REF @ $SHA"
