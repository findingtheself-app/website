The initial public website adds the .Self v2.1 design and a disabled PHP signup path. This revision preserves the existing section structure and implements the supplied PR #1 fixes: exact badge artwork, restored privacy wording, unclipped phone illustrations and a consistent footer.

Not published. Awaiting both founders’ approval. This remains a draft on `draft/self-website-v2-1`.

## Changes

- Exact supplied lowercase `.self` glyph paths in white/plum, straight and 3° clockwise slanted badges, 512px PNGs and matching favicon/touch assets. Header 44px, footer 36px and both roadmap tiles use the badge; running text remains `.Self`. Clearspace and minimum-size rules are documented. Straight SVG 1,906 bytes; slanted SVG 1,947 bytes.
- Removed arrows and visible draft/preview status wording; retained noindex, illustration labels, planned date, legal placeholders and closed signup status.
- Hero note sits below the phone without covering Today text. Food and Movement screens show their full content; Stillness shows 10:00. Footer aligns consistently and reads `© 2026 findingtheself`.
- Restored the supplied on-device journal privacy wording, including phrase loss and unlocked-device limits. Founder confirmation against security-design.md remains required; the private app repo was not accessed and no independent crypto audit is claimed.
- Native signup and PHP route remain independently disabled. Signed time tokens, exact origin, consent/version, honeypot, replay protection, salted-hash rate limiting and private 600-permission persistence remain in place. No real addresses or secrets added.
- Privacy notice, security headers/CSP, local social assets, robots, 404 and signup response pages remain. One unset `CANONICAL_ORIGIN` constant controls future metadata/sitemap; no domain is guessed.
- Removed tracked `review/`. Screenshots are attached below; audit output and test dependencies stay outside the repository and FINAL release zip.

## Validation

| Check | Result |
| --- | --- |
| Lighthouse mobile and desktop | Performance 100 / Accessibility 100 / Best practices 100 / SEO 66 |
| SEO limitation | Required noindex/robots block fails crawlability; all other applicable SEO checks pass |
| Axe | Zero automated violations on home at 320/390/640/768/1280px and supporting pages at 390px |
| Layout | No overflow/clipped headings at 320/390/640/768/900/1280px; hero text overlap, phone completeness and footer alignment checks pass at 390/768/1280px |
| Keyboard/motion/storage | Skip link and visible focus pass; reduced motion disables animation; no external page requests, cookies or local storage |
| Signup | 30 isolated PHP 8.3 cases pass, including disabled guard, tokens, origin, consent, replay, rate limits and persistence with mail unavailable |
| Static/brand | Exact glyph paths, path-only SVGs, icon dimensions, names/copy, arrows, local links/assets, noindex/CSP and disabled configuration pass |
| PHP lint | PHP 8.3 host lint passes through stdin without remote file writes |
| CSS | 15,564 bytes |

Axe incomplete contrast checks were manually inspected with calculated palette contrast; they are not automated passes or WCAG certification. 640 CSS pixel reflow was checked as a 200% equivalent. Native browser zoom and screen-reader sign-off remain manual. See TEST-RESULTS.md for reproduction and limitations.

Read-only SSH reached the actual .Self web-root. PHP 8.3.33 and the mail function are available in CLI; web PHP, actual mail delivery, deployed headers/permissions and trusted client-address handling remain unverified. No email was sent or server file written for these checks.

## Screenshots

Captures use 390px and 1280px viewports; section crops retain the visible content. 768px and full phone captures were also inspected locally.

<details><summary>390px: header, hero, tiles and footer</summary>

![Header at 390px](https://github.com/user-attachments/assets/35771ca8-c75d-4c16-956e-dc0a009d46b2)

![Hero at 390px](https://github.com/user-attachments/assets/3797b367-5502-4df1-9403-87488044b2db)

![Tiles at 390px](https://github.com/user-attachments/assets/c5c86a8a-94b5-4e96-ab77-9d23026e9fd4)

![Footer at 390px](https://github.com/user-attachments/assets/dcde1377-5e94-4e61-8355-9c037c7ae404)

</details>

<details><summary>1280px: header, hero, tiles and footer</summary>

![Header at 1280px](https://github.com/user-attachments/assets/b2d80d82-6857-48c2-acec-48eceaf2ccec)

![Hero at 1280px](https://github.com/user-attachments/assets/56fd2fb7-cd64-4899-8b5b-358a75349905)

![Tiles at 1280px](https://github.com/user-attachments/assets/8fda85dd-d3b3-4615-9cd3-782a4f488ded)

![Footer at 1280px](https://github.com/user-attachments/assets/e30eb1ec-a139-4b06-b384-b60bf142af90)

</details>

## Release boundary

The live Hostinger site is unchanged. No merge, deployment, Pages, CNAME, DNS/email routing or mailbox changes occurred. Signup remains off for board CHANGE 0.1.16. Both founders’ approval and a separate explicit deployment decision are required. No FINAL release zip was produced.

## Every remaining [PLACEHOLDER]

- [PLACEHOLDER] Domain decision: set `CANONICAL_ORIGIN` in `config/site.json` only after approval, then render metadata/sitemap with `tests/render-metadata.py`. It is currently null; no domain is guessed. Keep indexing blocked until approved launch.
- [PLACEHOLDER] Both founders to confirm “Now and next” wording, including the planned date, sign-in/sync and later Gather scope.
- [PLACEHOLDER] founders to confirm privacy wording against security-design.md before launch. Supplied on-device wording is restored; no private app access or independent crypto audit occurred.
- [PLACEHOLDER] Founders to confirm the lowercase `.self` badge with `.Self` as the name in running text.
- [PLACEHOLDER] Confirm `findingtheself` as the future company name; footer copyright does not resolve the legal-controller placeholder.
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
