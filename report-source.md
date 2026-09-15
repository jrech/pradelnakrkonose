# SEO + GEO audit — Prádelna Krkonoše

Audit date: 2026-08-24

Scope: production alias `https://pradelnakrkonose.vercel.app/`, public host
`https://www.pradelnakrkonose.cz/`, and Astro source in this workspace. The
follow-up implementation pass normalized canonical URLs, enriched verified
LocalBusiness contact signals and made three conservative copy refinements.

## Executive answer

The largest issue is not an on-page tag: the public `www` host currently serves
a different Vite SPA than the deployed Astro site. It has a generic English
document shell (`lang="en"`, title `pradelna`) and its `/robots.txt`, `/sitemap.xml`
and `/llms.txt` paths return that HTML shell rather than their intended formats.
The Vercel alias serves the new site correctly, but its canonical URLs and
sitemap point to the broken/mismatched `www` host. This must be fixed before
any content or GEO tuning is expected to compound.

## Evidence and findings

### P0 — production host/canonical mismatch

- `pradelnakrkonose.vercel.app` serves the Astro site with Czech HTML, unique
  titles/descriptions, JSON-LD and the intended pages.
- `www.pradelnakrkonose.cz` serves a separate SPA shell with title `pradelna`.
- The Astro `SeoHead` canonical base, `robots.txt` Sitemap line, sitemap URLs and
  `llms.txt` links all claim `https://www.pradelnakrkonose.cz` as canonical.
- Result: crawlers can discover one host while canonical signals identify a
  different host, and the official host does not expose the intended content.

Recommended resolution: decide that `www.pradelnakrkonose.cz` is the primary
host, attach it to the Vercel project, verify that every route resolves to the
Astro build, then keep the current canonical/robots/sitemap host. If the
Vercel alias is intentionally primary, change every canonical, sitemap, robots
and llms link to that host instead and redirect `www`.

### P0 — crawl control files are invalid on the public host

On `www`, `/robots.txt`, `/sitemap.xml` and `/llms.txt` respond as HTML. On the
Vercel alias they correctly respond as `text/plain`, `application/xml` and
`text/plain`. Fixing the host mapping resolves this in one place.

### P1 — NAP and hours are inconsistent off-site

The current website and structured data use `+420 773 798 008`, Kpt. Jaroše 496,
543 01 Vrchlabí 1 and 07:30–14:00 weekdays. Search results still expose older
phone/hours on Cylex and older legal/contact variants on directory pages. Update
or claim those profiles, especially Google Business Profile, and use one exact
canonical NAP format everywhere.

### P1 — canonical slash policy is inconsistent

The sitemap lists trailing-slash URLs for page routes, while several generated
canonical tags use `/kontakt`, `/o-nas`, `/llm-info` and
`/ochrana-osobnich-udaju` without the slash. Pick one policy and make sitemap,
canonical, internal links and redirects agree. This is small but removes
duplicate-URL ambiguity.

### P1 — strengthen local entity identity

Current JSON-LD is valid JSON and contains one `LocalBusiness` node on every
page, with address, phone, email, hours, area served and Facebook `sameAs`.
Service pages add a `Service` node. This is a good baseline.

Recommended next pass: use the most specific suitable Schema.org subtype,
add a verified `legalName`/IČO only if it is intended as public business data,
add the verified Google Business Profile URL to `sameAs`, and keep the visible
NAP identical to the schema. Do not invent coordinates, ratings or
certifications.

### P2 — content and query coverage

The homepage and four service pages have one H1 each, distinct titles and
descriptions, and clear Czech service terms. Coverage is strongest for hotel,
penzion/apartment, chata/chalupa and gastro intent.

High-value additions are not more generic copy: create useful, genuinely local
sections or pages for service area/collection logistics (Vrchlabí,
Špindlerův Mlýn and confirmed surrounding resorts), textile types and seasonal
operation, only where the business can substantiate the claims. Link these from
the relevant service pages and the contact page.

### P2 — GEO/AI discoverability

`/llms.txt` is present and concise, which is useful as a supplemental reference,
but it must not substitute for crawlable HTML, consistent entity data and
first-party/off-site corroboration. Keep it synchronized with the canonical
host, services, location and contact details. Add explicit “B2B commercial
laundry in Vrchlabí” wording to the visible About/contact content if it remains
truthful, so an assistant can answer “what, for whom, where, how to contact”
without relying only on metadata.

### P3 — authority and trust

The site has Facebook in `sameAs`, but no visible Google Business Profile link,
LinkedIn or other verified first-party profile. Do not add social profiles until
they exist; prioritize a verified GBP, consistent directories, real customer
reviews and links from relevant Krkonoše hospitality partners.

## What is already good

- Czech `lang` attribute, one H1 per checked page, semantic section headings.
- Unique page titles (25–57 characters) and useful meta descriptions (82–142
  characters) across checked routes.
- Absolute sitemap URLs and an allow-all robots policy on the deployed alias.
- JSON-LD parses successfully; no invented ratings or coordinates.
- Image `alt` attributes are present; decorative hero/background assets are
  intentionally empty-alt and aria-hidden.
- Security headers are present on the Vercel alias (CSP, COOP, X-Frame-Options,
  nosniff, referrer and permissions policy).

## Recommended order of work

1. Fix domain/DNS/Vercel mapping and verify `www`, HTTPS, redirects and all
   crawl-control endpoints.
2. Normalize canonical slash policy and resubmit the sitemap in Search Console.
3. Correct NAP/hours on GBP and directories; add only verified `sameAs` links.
4. Add focused local/service-area content and internal links where factual.
5. Validate JSON-LD with Rich Results Test and run URL Inspection after deploy.
6. Establish baseline Search Console queries, indexed URLs and conversions before
   further copy experiments.

## Implemented in this follow-up pass

- Canonical URLs now normalize to the trailing-slash format used by the sitemap.
- LocalBusiness JSON-LD now includes the page description, verified map URL and a
  customer-service ContactPoint while retaining the existing verified NAP/hours.
- Segment-page hero phone links now use the clearer “Zavolejte nám” label.
- The hotel page copy was tightened from “Prádlo nesmí být věc, kterou musíte
  řešit.” to “Prádlo nesmí být starost.” and corrected “Připravení” to “Připraveni”.

The live `www` domain was intentionally not changed because it belongs to a
separate Vercel project, as confirmed by the site owner.

## Primary references

- Google Search Central — [Local Business structured data](https://developers.google.com/search/docs/appearance/structured-data/local-business)
- Google Search Central — [Build and submit a sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- Google Search Central — [Technical SEO fundamentals](https://developers.google.com/search/docs/fundamentals/get-started)
- Google Search Central — [Title links](https://developers.google.com/search/docs/advanced/appearance/good-titles-snippets)
- Current deployed alias: https://pradelnakrkonose.vercel.app/
- Public host under audit: https://www.pradelnakrkonose.cz/
- Directory corroboration: [Firmy.cz](https://www.firmy.cz/detail/13131338-pradelna-krkonose-s-r-o-vrchlabi.html), [Živéobce.cz](https://www.ziveobce.cz/pradelna-krkonose_f1610851?cz=14&loc=50411345), [Cylex](https://www.cylex.cz/vrchlabi/pr%C3%A1delna%2Bkrkono%C5%A1e-277534.html)
