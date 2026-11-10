# Denis Davydov — portfolio

Personal website of a freelance SDET in Berlin: services, project examples, pricing and a blog
about test automation. English and German.

## Stack

- Next.js 16 (App Router) with static export — the site is plain HTML served by nginx
- React 19, TypeScript, Tailwind CSS 4, IBM Plex fonts
- Markdown blog (`content/blog/<locale>/*.md`)
- Playwright end-to-end tests against the exported build
- GitHub Actions: lint → typecheck → build → e2e → deploy to the VPS

## Commands

```sh
npm ci
npm run dev          # http://localhost:3000/en/
npm run build        # static site in out/
npm run test:e2e     # Playwright tests against out/
npm run lint
npm run typecheck
```

## Where to change things

| What | File |
|---|---|
| Domain, links, email, prices, VAT mode | `src/config/site.ts` |
| All page texts | `src/i18n/en.ts`, `src/i18n/de.ts` (German must mirror the English keys) |
| Blog articles | `content/blog/en/<slug>.md` and `content/blog/de/<slug>.md` (same slug = translation) |
| Photos | `public/images/` — WebP, EXIF removed |

A blog article needs this front matter:

```md
---
title: "Article title"
description: "One or two sentences for the list and search engines."
date: 2026-11-10
tags: [test automation]
---
```

## Deployment

The site is deployed to `/var/www/<domain>` on the same VPS as usermanagementapp.com.

1. Point the domain's A record to the VPS.
2. Install `deploy/nginx.conf` (instructions inside the file) and run certbot.
3. In the GitHub repository set the variables `SITE_DOMAIN` (e.g. `example.com`) and `SITE_URL`
   (e.g. `https://example.com`) and the secrets `SSH_HOST`, `SSH_USER`, `SSH_KEY`.

Deployment is skipped until `SITE_DOMAIN` is set.

## Before going live

- [ ] Impressum and Datenschutzerklärung filled in (`src/components/LegalPage.tsx`) — required for a business in Germany
- [ ] Prices and VAT mode in `src/config/site.ts`
- [ ] Personal email in `src/config/site.ts`
- [ ] Domain variables in GitHub
