The initial public website adds the .self v2.1 design and a disabled PHP signup path. This revision preserves the existing section structure and implements the supplied PR #1 fixes: exact badge artwork, restored privacy wording, unclipped phone illustrations and a consistent footer.

Not published. Awaiting both founders’ approval. This remains a draft on `draft/self-website-v2-1`.

## Changes

- Exact supplied lowercase `.self` glyph paths in white/plum, straight and 3° clockwise slanted badges, 512px PNGs and matching favicon/touch assets. Header 44px, footer 36px and the plum roadmap tile uses a cream outlined badge; the forest tile is text only; running text remains `.self`. Clearspace and minimum-size rules are documented. Straight SVG 1,906 bytes; slanted SVG 1,947 bytes.
- Removed arrows and visible draft/preview status wording; retained noindex, illustration labels, planned date, legal placeholders and closed signup status.
- Hero note sits below the phone without covering Today text. Food and Movement screens show their full content; Stillness shows 10:00. Footer aligns consistently and reads `© 2026 findingtheself`.
- Restored the supplied on-device journal privacy wording, including phrase loss and unlocked-device limits. Founder confirmation against security-design.md remains required; the private app repo was not accessed and no independent crypto audit is claimed.
- Native signup and PHP route remain independently disabled. Signed time tokens, exact origin, consent/version, honeypot, replay protection, salted-hash rate limiting and private 600-permission persistence remain in place. No real addresses or secrets added.
- Privacy notice, security headers/CSP, local social assets, robots, 404 and signup response pages remain. One unset `CANONICAL_ORIGIN` constant controls future metadata/sitemap; no domain is guessed.
- Removed tracked `review/`. Screenshots are attached below; audit output and test dependencies stay outside the repository and FINAL release zip.

## Round 3 staging and checks

Hosting access checked. Details are kept in the private notes, not in this repo.

Web PHP 8.3.33 matches CLI PHP 8.3.33. The web mail function is available. One authorised test message returned: sent. The unguessable temporary PHP probe printed only version and mail availability, was immediately deleted, and returned HTTPS 404 on the removal check. No phpinfo or private configuration values were exposed.

A backup of the existing live site is stored in a restricted private backup area outside the public directory. The runtime-only FINAL zip and extracted release are in a separate restricted staging area outside the public directory. The zip checksum matches after upload. It contains 19 runtime files and excludes docs, tests, review output, screenshots, private configuration and secrets. Noindex and the disabled form are retained; the private configuration is unchanged with enabled=false.

Live file checksums match the pre-check snapshot. Nothing was switched live, merged, pushed to main, or enabled. No Pages, CNAME, DNS or email-routing change occurred. Staging does not itself publish anything. Switching live and enabling signup wait for a separate direct go from the owner; approval records are maintained outside this repo.

Rollback now: remove the isolated staged release; the live site needs no restoration because it was not replaced. If a later authorised release needs rollback, restore the saved pre-release backup under a separate authorised operation. Private notes record the locations and checksums.

Older commits still contain the earlier hosting wording. A normal commit removed it from the current files; no history rewrite or force-push occurred.

## Round 2 completion

- Lowercase `.self` throughout pages, metadata, accessibility names, PHP messages and notification content, docs and the local OG image. Stable code paths and environment names retained. Repository scan found no capitalised product-name occurrences.
- Recovery caption removed; in-screen safety wording retained. No illustration caption intersects a phone tab bar at 390/768/1280px.
- One large slanted, thin cream outlined badge on plum; forest tile text only. The badge can be restored using the documented markup location. Copy retained.
- Dark forest privacy band with exactly the existing wording in plain steps 1 to 4, honest limits and privacy-notice link. Pale text contrast is 8.33:1. No new claims added.
- Footer lockup gap reduced to 5px and alignment inspected at all three widths.
- All 30 PHP cases, static checks, reflow and automated accessibility checks re-run successfully. Lighthouse remains 100/100/100/66 on mobile and desktop; indexing is intentionally blocked.

The original v2 zip is unavailable, so exact restoration could not be verified. The user explicitly authorised recreation from the current page; founders have not approved its design or tile choice.

Earlier CLI checks confirmed PHP 8.3.33 and mail-function availability; the current web and mail results are recorded above. After explicit user authorisation, a private config was created outside the website’s public directory with the supplied recipient, enabled=false and permissions 600. Other necessary configuration values remain unset. Recipient details are absent from the repository, tests, documentation and PR. This config does not authorise collection or mailbox routing; board CHANGE 0.1.16 remains pending. Public server files and the live website are unchanged.

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
| CSS | 16,740 bytes |

Axe incomplete contrast checks were manually inspected with calculated palette contrast; they are not automated passes or WCAG certification. 640 CSS pixel reflow was checked as a 200% equivalent. Native browser zoom and screen-reader sign-off remain manual. See TEST-RESULTS.md for reproduction and limitations.

Read-only SSH reached the actual .self web-root. PHP 8.3.33 and the mail function are available in CLI; receipt of the test message, staged web headers and trusted client-address handling remain unverified. The earlier read-only CLI checks wrote no server files. Round 3 performed the separately authorised probe and isolated staging described above.

## Screenshots

Round 2 captures: header, hero, tiles, privacy band and footer at each requested viewport.

<details><summary>390px: header, hero, tiles, privacy band and footer</summary>

![Header at 390px](https://github.com/user-attachments/assets/4aff0893-e95d-447e-9091-b01b8742535f)

![Hero at 390px](https://github.com/user-attachments/assets/32bcd3ea-71c9-4eea-9cdf-ae7224be22c3)

![Tiles at 390px](https://github.com/user-attachments/assets/a56cf3af-4166-4b58-9cf2-72908b1c871d)

![Privacy band at 390px](https://github.com/user-attachments/assets/5b86f9d3-153a-4f3a-895d-511f72e1f244)

![Footer at 390px](https://github.com/user-attachments/assets/4054afb7-5d10-4a0e-ae9c-6560e9a3e7f9)

</details>

<details><summary>768px: header, hero, tiles, privacy band and footer</summary>

![Header at 768px](https://github.com/user-attachments/assets/5d7f1a94-0f91-49d4-9d32-78a9d0029688)

![Hero at 768px](https://github.com/user-attachments/assets/fbce78e7-fdfa-4946-ad2f-789a3bf1d979)

![Tiles at 768px](https://github.com/user-attachments/assets/f2af71af-a7a8-4abd-a5c2-cc04326dc515)

![Privacy band at 768px](https://github.com/user-attachments/assets/434994c7-9e7b-430f-a307-d2be79e55077)

![Footer at 768px](https://github.com/user-attachments/assets/b15e9889-d817-43f7-9512-948b79facc99)

</details>

<details><summary>1280px: header, hero, tiles, privacy band and footer</summary>

![Header at 1280px](https://github.com/user-attachments/assets/55bdce75-87c3-4eba-ab21-24dbf54270ca)

![Hero at 1280px](https://github.com/user-attachments/assets/6ed171ac-e785-416f-8637-a5a42eac1fa9)

![Tiles at 1280px](https://github.com/user-attachments/assets/e86c0391-7bcc-4458-b40a-950e48d29fd0)

![Privacy band at 1280px](https://github.com/user-attachments/assets/3a6b97b0-6f67-4f55-bc77-19abc689faf2)

![Footer at 1280px](https://github.com/user-attachments/assets/51306e6d-497d-4496-8faf-13552a0767dc)

</details>

## Release boundary

The live Hostinger site is unchanged. No merge, live deployment, Pages, CNAME, DNS/email routing or mailbox changes occurred. Signup remains off for board CHANGE 0.1.16. A separate direct live-switch and collection decision is required. A runtime-only FINAL zip is prepared for non-live staging; founder approval is still pending.

## Every remaining [PLACEHOLDER]

- [PLACEHOLDER] Domain decision: set `CANONICAL_ORIGIN` in `config/site.json` only after approval, then render metadata/sitemap with `tests/render-metadata.py`. It is currently null; no domain is guessed. Keep indexing blocked until approved launch.
- [PLACEHOLDER] Both founders to confirm “Now and next” wording, including the planned date, sign-in/sync and later Gather scope.
- [PLACEHOLDER] founders to confirm privacy wording against security-design.md before launch. Supplied on-device wording is restored; no private app access or independent crypto audit occurred.
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
- [PLACEHOLDER] Founder confirmation of one outlined badge on the plum tile and a text-only forest tile.
- [PLACEHOLDER] Original v2 draft zip is unavailable; user authorised recreation from the current page. Founders still need to approve the visual layout.
- [PLACEHOLDER] Board approval of temporary signup-mail routing; recipient remains a private configuration decision and signup stays disabled.

Additional approval/validation gates without invented values: unsigned team copy, visual design, .self web PHP 8.3, host mail behaviour, live security headers, cleanup schedule, rate-data physical retention, list deletion procedure, trusted client-address setup, and final manual assistive-technology review. Both founders’ board approval and explicit deployment authorisation remain required.

Hosting access checked. Details are kept in the private notes, not in this repo. Older commits still contain the previous hosting wording; this normal commit does not rewrite history.
