The public website repository previously contained only a README. This adds a reviewable .Self website using the supplied v2 PDF as visual reference and the later instruction permitting redesign. The original draft zip was not available, so unseen sections are new draft copy rather than a claim of an exact reproduction.

## Changes

- Calm paper/plum/forest design, Arial and Georgia italic, flowing inline SVG, tiny 8–10 second breathing motion with reduced-motion support.
- Six HTML/CSS app illustrations, hidden recovery words, no feature numerals, large .Self “Now and next” tiles and clearly qualified roadmap wording.
- Disabled native signup frontend; independently disabled PHP 8.3 route, signed time tokens, exact-origin validation, honeypot, consent/version checks, replay protection and salted-hash rate limiting.
- Private 600-permission interest storage before host mail, generic responses and failure codes, private configuration example and expiry maintenance.
- Draft UK sign-up privacy notice, real-header .htaccess rules, matching meta CSP, local icons/1200×630 OG PNG, robots, placeholder sitemap, 404 and success/error pages.
- Deployment notes, approval gates, reproducible checks and full audit reports. No detailed app security claims were changed; the private app repository was not accessed.

## Review screenshots

[Full page, 390px](https://github.com/findingtheself-app/website/blob/draft/self-website-v2-1/review/home-390.png) · [Full page, 1280px](https://github.com/findingtheself-app/website/blob/draft/self-website-v2-1/review/home-1280.png)

![Desktop first screen](https://raw.githubusercontent.com/findingtheself-app/website/draft/self-website-v2-1/review/hero-1280.png)

<details><summary>390px first screen</summary>

![Mobile first screen](https://raw.githubusercontent.com/findingtheself-app/website/draft/self-website-v2-1/review/hero-390.png)

</details>

## Validation

| Check | Result |
| --- | --- |
| Lighthouse mobile and desktop | Performance 100 / Accessibility 100 / Best practices 100 / SEO 66 |
| SEO limitation | Preview deliberately retains noindex/nofollow and robots block; crawlability fails by design |
| Axe | Zero automated violations on home at 320/390/640/1280, and supporting pages at 390 |
| Reflow and keyboard | No overflow/clipped content headings at 320/390/640/768/900/1280; skip link and visible focus work |
| 200% reflow | 640 CSS pixel equivalent checked; native zoom and assistive-technology sign-off remain manual |
| Motion and requests | Reduced motion disables animations; no external page requests, cookies or local storage |
| Signup | 30 isolated PHP 8.3 WebAssembly cases passed, including mail-unavailable persistence; no real emails sent |
| PHP lint | Host PHP 8.3 lint passed over stdin with no remote files created |
| Static/brand checks | Naming/copy scans, local assets, links, one h1, locale, CSP, noindex, disabled configuration and OG dimensions passed |
| CSS | 15,380 bytes, about 15 KB |

Axe incomplete contrast checks on transformed/cropped illustration content were manually reviewed with calculated palette contrasts; these are not claimed as automated passes or WCAG certification. Actual host headers, domain web PHP, mail delivery and deployment permissions remain unverified. See TEST-RESULTS.md and review/ for evidence.

## Hosting and release boundary

Read-only SSH checks confirmed the existing hosting account includes the .Self domain web-root directory. Default CLI PHP is 8.2.33, with a separate PHP 8.3 binary available. The .Self web PHP setting still needs confirmation. The existing bigredbox handler was read for the pattern only; no branding, recipient or relay was copied.

The existing Hostinger site is unchanged. No merge, deployment, Pages, CNAME, DNS/email routing or mailbox changes occurred. Signup remains off for board CHANGE 0.1.16. Both founders’ board approval and a separate explicit deployment decision are required. No FINAL release zip was produced.

## Every remaining [PLACEHOLDER]

- [PLACEHOLDER] Canonical domain and absolute social-image URLs on all five HTML pages; replace `example.invalid` in metadata and sitemap. Confirm the robots policy at approved launch.
- [PLACEHOLDER] Both founders to confirm “Now and next” wording, including the planned date, sign-in/sync and later Gather scope.
- [PLACEHOLDER] Detailed app privacy wording against the current security design. No private app access occurred; no detailed encryption claims were changed or invented.
- [PLACEHOLDER] Legal entity/controller and contact address.
- [PLACEHOLDER] Hostinger’s own access logs, processing and retention; do not equate application-level hashed rate data with no host-level logging.
- [PLACEHOLDER] Hostinger processor approval for hosting and mail delivery, and processor terms.
- [PLACEHOLDER] Hosting region, mailbox storage region, international transfers/safeguards and authorised readers of the list and mailbox.
- [PLACEHOLDER] Cleanup schedule and maximum physical retention of expired rate records.
- [PLACEHOLDER] Retention period after launch.
- [PLACEHOLDER] Deletion timing, backups and the minimal withdrawal record, if required.
- [PLACEHOLDER] Unsubscribe contact address and tested withdrawal process before first collection or email.
- [PLACEHOLDER] Rights-request contact address and procedure.
- [PLACEHOLDER] Private configuration values: `OWNER_EMAIL`, `FROM_EMAIL`, approved HTTPS origin, private data path, independently generated token secret and IP salt. The enabled flag remains false.

Additional approval/validation gates without invented values: unsigned team copy, visual design, .Self web PHP 8.3, host mail behaviour, live security headers, cleanup schedule, rate-data physical retention, list deletion procedure, trusted client-address setup, and final manual assistive-technology review. Both founders’ board approval and explicit deployment authorisation remain required.
