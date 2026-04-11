# Secret Rotation and History Cleanup

## What is already fixed in the repo

- `.env` is no longer tracked by Git in the current branch.
- The app now refuses to start without `JWT_SECRET`.

## Immediate rotation checklist

Rotate every secret that has ever been stored in the tracked `.env` file:

1. Generate a brand new `JWT_SECRET` and set it in all environments before the next restart.
2. Rotate `DB_PASSWORD` if the database is reachable outside a tightly controlled local-only boundary.
3. Rotate `CLOUDINARY_API_KEY` and `CLOUDINARY_API_SECRET`.
4. Review any other secrets that were ever added to `.env` in older commits, not just the current file contents.

Important:

- This repository currently requires `JWT_SECRET` at runtime.
- The local `.env` file on your machine must be updated manually because it is intentionally no longer tracked.

## Safe history cleanup plan

Use a fresh clone or a disposable mirror clone for the rewrite. Do not run the history rewrite in an actively edited working tree.

### 1. Create a backup first

```powershell
git clone --mirror https://github.com/ceceabdurahman-dot/mikroliving.id.git mikroliving.id-backup.git
```

### 2. Work from a fresh rewrite clone

```powershell
git clone https://github.com/ceceabdurahman-dot/mikroliving.id.git mikroliving.id-history-clean
cd mikroliving.id-history-clean
```

### 3. Install `git-filter-repo` if needed

Preferred tool:

```powershell
python -m pip install git-filter-repo
```

If Python is not available, install `git-filter-repo` by another supported method before continuing.

### 4. Remove `.env` from all history

```powershell
git filter-repo --path .env --invert-paths --force
```

If other sensitive files were ever committed, add them in the same rewrite rather than doing multiple separate history rewrites.

### 5. Verify the cleanup locally

These commands should return no tracked history for `.env`:

```powershell
git log --all -- .env
git rev-list --objects --all | Select-String "\.env$"
```

### 6. Force-push the rewritten history

Only do this after everyone who uses the repo is informed.

```powershell
git push --force --all origin
git push --force --tags origin
```

## Team coordination checklist

Before force-pushing rewritten history:

1. Pause merges into `main`.
2. Tell collaborators to stop pushing until the rewrite is complete.
3. Ask collaborators to re-clone the repo after the rewrite, or hard-reset to the new remote history if they understand the impact.
4. Reopen or recreate any PRs based on old history if needed.

## After the rewrite

1. Confirm `.env` is still ignored by Git.
2. Confirm deployments use the rotated secrets.
3. Invalidate old admin sessions if they may have been signed by the leaked or fallback JWT secret.
4. Review GitHub Actions, Vercel, Hostinger, local PM2 configs, and any copied deployment notes for duplicated secrets.

## Important limitation

History cleanup reduces future exposure in the repository, but it does not guarantee full erasure from:

- old clones
- cached CI artifacts
- local backups
- screenshots or pasted logs
- any third-party service that already ingested the secrets

Because this repo is public, assume the previously committed secrets may already be copied elsewhere and rotate them accordingly.
