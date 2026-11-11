# Backlog

Ideas and tasks for later. Ordered by impact on winning new clients.

> **Before running ads — ship everything as one package:** call booking (1), analytics that count
> bookings as conversions (2), service pages for the ad keywords (4) and at least 2–3 blog posts (3).
> Otherwise we pay for clicks without knowing what worked.
> Order: Search Console → analytics → call booking → service pages → posts → ads.

## 1. Call booking (Termin)

In Germany clients expect to pick a slot in a calendar themselves.

- Tool: **Cal.com** (open source, EU data residency via cal.eu — verify on sign-up).
  Dark theme, brand colour `#3dff9a`, German UI and emails, Europe/Berlin time zone,
  calendar sync, video link created automatically. Calendly as a fallback — weaker for GDPR.
- Event: "Kostenloses Erstgespräch" / "Free intro call", 30 minutes, video.
- Dedicated page `/de/termin/` and `/en/book/` in the terminal style:
  `$ book --type intro --duration 30m`, what the call covers, button `> Load calendar`.
- The calendar loads **only after a click** (two-click solution): no requests to Cal.com,
  no third-party cookies and no consent banner until then.
- Booking links: primary button in the hero (LinkedIn becomes secondary), first line in contacts
  (`termin: 30 min · free`), the free-call sentence in pricing, end of blog posts.
- Privacy policy: section on Cal.com (data, storage location, data processing agreement).
- Event URL — a single line in `src/config/site.ts`.
- **Needed from the owner:** Cal.com account, event link, available hours, English event yes/no.

## 2. Analytics

Goal: see how many people came, from where and what they read — GDPR-compliant.

- **Google Search Console** — impressions, clicks and positions in Google search, indexing errors.
  No cookies, no code on the site, ownership verified via a DNS record. Do this first.
- **Bing Webmaster Tools** — same for Bing (imports from Search Console in a few clicks).
- Site traffic — pick one:
  - **Umami** or **Plausible**, self-hosted: no cookies, no consent banner, data stays with us;
  - **Google Analytics 4**: more detail, but requires a consent banner and a privacy policy section,
    data goes to the US.
  Recommendation: Umami/Plausible.
- UTM tags on links from LinkedIn to see which posts bring visitors.

## 3. Publishing: blog + LinkedIn

- Full article on the site (canonical); on LinkedIn a short post with the key idea and a link
  (or a LinkedIn article marked "originally published on davydovdenis.de").
- Every article in EN and DE.
- Topics — hands-on experience, no client names:
  - starting test automation from scratch: where to begin, what not to automate;
  - Playwright + C#/NUnit: a framework structure that still holds up a year later;
  - flaky tests: causes and how to track them down;
  - test benches and hardware testing: firmware, kiosks, payment terminals;
  - testing speech recognition: test datasets and quality metrics;
  - quality gates in CI/CD: what to check before a release ships;
  - test automation audit checklist (ties in with the audit offer).
- Cadence: one article every 2–4 weeks, LinkedIn post on publication day.

## 4. Ads and SEO

- Keywords DE/EN: "Testautomatisierung Freelancer", "Softwaretests Berlin",
  "QA Automation Freelancer", "Playwright Experte", "test automation services".
- Separate service pages (web, API, mobile, desktop, framework from scratch, test maintenance,
  CI/CD, hardware) — each targeting its own queries.
- Profiles on freelance platforms (freelancermap, GULP, Malt) linking to the site.
- Ads — once analytics are in place: LinkedIn Ads by job title (CTO, Head of QA,
  Engineering Manager in DACH), Google Ads on queries found in Search Console.

## 5. Site — other

- Technology logo row (languages, frameworks, test libraries).
- morphinum.ru card in the portfolio (demo shop on Next.js).
- Move hosting to an EU server (the VPS is currently in Moscow — disclosed in the privacy policy
  as a third country).
- Update GitHub Actions to Node 24 versions.
