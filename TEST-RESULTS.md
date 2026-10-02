# Draft checks, 1 October 2026

Checks were run against the local design preview. These layout checks preceded the separately authorised non-live staging and single mail test described below.

| Check | Result |
| --- | --- |
| Lighthouse mobile | Performance 100, accessibility 100, best practices 100, SEO 66 |
| Lighthouse desktop | Performance 100, accessibility 100, best practices 100, SEO 66 |
| Axe | Zero automated violations at 320, 390, 640, 768 and 1280px; zero on privacy, thank-you, error and 404 pages at 390px |
| Reflow | No horizontal overflow or clipped content headings at 320, 390, 640, 768, 900 and 1280px |
| 200% zoom equivalent | Passed layout reflow at 640 CSS pixels for a 1280px viewport; native browser zoom and assistive-technology sign-off remain manual |
| Keyboard | Skip link receives first focus, visible 3px outline, Enter moves focus to main |
| Reduced motion | No SVG animation with reduced motion requested |
| Requests/storage | No external page resources or requests, empty cookies and local storage |
| PHP 8.3 | Reached the .self web-root via SSH; PHP 8.3.33 and mail() are available in CLI. Handler lint passed over stdin; no remote file write or mail send |
| Signup integration | 30 isolated PHP 8.3 WebAssembly cases passed; host mail unavailable in the test runtime |
| Static checks | Locale, one h1, landmarks, noindex, CSP, local resources, links, brand colours, decorative SVG, disabled frontend/config, OG dimensions and sitemap passed |
| Naming and copy scans | No prohibited naming terms or em dash in authored site/copy; no founder names in authored content |
| CSS | 16,740 bytes, about 15 KB; no fonts or scripts downloaded by the page |
| OG | Local plum PNG, 1200 × 630, .self and “A place to reflect”; local favicon and touch icon |

SEO is intentionally below 95 because `noindex`, nofollow and the robots block are required for the preview. The crawlability audit fails by design; all other applicable SEO audits pass. The single `CANONICAL_ORIGIN` constant is unset; absolute canonical/social URLs and sitemap entries are withheld until the domain decision. `tests/render-metadata.py` renders them once approved. No indexing restriction was removed to improve scores. Local HTTP cache/latency diagnostics are not production results.

Axe has incomplete contrast checks on transformed/cropped illustration text and some decorative overlaps. These were not treated as automatic passes. The authored palette pairs were calculated and the rendered screens inspected: muted/cream 5.73:1, muted/paper 6.06:1, cream/plum 9.01:1, cream/forest 8.33:1, forest/movement background 7.43:1, food tokens 4.84:1, stillness tokens 4.60:1. Movement text uses Forest for AA contrast rather than the app’s lighter green. The supplied badge uses white on plum; its exact glyph paths and original transform are checked across all SVG derivatives. Disabled controls are visibly marked unavailable. Full screen-reader, browser-zoom and WCAG conformance review remain required; an automated score is not certification.

The PHP cases cover missing/disabled/incomplete configuration, storage inside the web root, signed-token issuance, method/origin checks, too-young/expired/future/forged/missing tokens, input lengths, header newlines, honeypot, consent version, body cap, persistence when mail is unavailable, replay, optional name, native redirect, per-hash rate limit, file permissions, expiry and corruption handling. Runtime test files were temporary and removed. No real personal details or host emails were used.

Screenshots and full JSON/HTML reports are generated outside the repository at `SELF_AUDIT_OUTPUT`, or a temporary directory by default. The tracked `review/` folder is removed. Header, hero, tiles, footer and phone captures were made at 390, 768 and 1280px and inspected. Round 2 includes privacy-band captures at all three sizes. Key captures are attached to PR #1; no screenshots or audit reports belong in a FINAL zip.

## Reproduce

Serve locally on 127.0.0.1:8765. Install Playwright, axe-core, Lighthouse, @php-wasm/node and @php-wasm/universal outside the repository. Provide `SELF_TEST_MODULES` (that dependency directory), optional `SELF_BROWSER_MODULES` (if Playwright is elsewhere) and `SELF_CHROME_PATH` (an isolated headless Chrome executable).

Run `python3 tests/static-check.py`, `node tests/signup.mjs`, `node tests/browser-audit.cjs`, `node tests/browser-layout.cjs` and `node tests/screenshots.cjs`. Set `SELF_AUDIT_OUTPUT` to a location outside this repository. Browser tests bypass CSP only to inject axe; the actual website contains no scripts and retains its strict CSP. Lighthouse does not bypass the page policy.

## Remaining environment checks

Read-only SSH reached the .self web-root directory itself and PHP 8.3.33 confirmed that `mail()` is available in CLI. Actual .self web PHP version, mail delivery, deployed permissions, trusted client address, HTTPS handling and `.htaccess` headers still need approved isolated staging verification. No mail was sent to check availability. Test HMAC rate-data cleanup on the configured private schedule, confirm list/backups deletion and host logging, and review the enabled native form with assistive technology before collection. Nothing was deployed to perform these checks.

Privacy drafting references: [ICO consent guidance](https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/lawful-basis/consent/how-should-we-obtain-record-and-manage-consent/) and [ICO data rights](https://ico.org.uk/global/privacy-notice/your-data-protection-rights/). The notice remains a legal-review draft with undecided facts marked explicitly.

## PR #1 fixes

Exact supplied lowercase badge paths are retained; SVGs contain only filled paths and a rotation group, with no fonts, scripts, filters or external references. Straight SVG: 1906 bytes. Slanted SVG: 1947 bytes. PNGs and small icons derive from that artwork. Inspected at 24, 44, 180 and 512px. The lowercase `.self` name now applies to all running text and metadata.

Arrows and page draft/preview status were removed while noindex, disabled sign-up and legal placeholders remain. The hero note has no geometric overlap with screen text, phones are unclipped and footer text left edges align at 390/768/1280px. The Stillness illustration now has 10:00. Restored privacy copy is supplied on-device wording, not a new independent crypto audit; founder security-design confirmation remains a recorded decision.

## Round 2 checks

All 30 PHP cases and browser audits were re-run. Axe reports zero violations, Lighthouse mobile/desktop remains 100/100/100/66. Caption/tab-bar intersection checks pass at 390/768/1280px. Privacy-band cream/forest contrast is 8.33:1. Repository scan finds no capitalised product name; stable environment names are unchanged. Original zip unavailable; user authorised recreating the band. Fifteen current screenshots are attached to PR #1.

Read-only host verification again reached the actual domain web-root and confirmed CLI PHP 8.3.33 and mail-function availability. No email was sent; delivery and web PHP remain unverified. Separately, the user authorised creating only the private server config outside the website’s public directory: recipient set privately, enabled=false, mode 600, all other required values unset. No public server file, DNS, routing or deployment changed. Founder approval remains pending.

Hosting access checked. Details are kept in the private notes, not in this repo. Older commits still contain the previous hosting wording; this normal commit does not rewrite history.

## Round 3 hosting checks and staging

Hosting access checked. Details are kept in the private notes, not in this repo.

Web PHP 8.3.33 matches CLI PHP 8.3.33. The web mail function is available. One authorised test message returned: sent. The unguessable temporary PHP probe printed only version and mail availability, was immediately deleted, and returned HTTPS 404 on the removal check. No phpinfo or private configuration values were exposed.

A backup of the existing live site is stored in a restricted private backup area outside the public directory. The runtime-only FINAL zip and extracted release are in a separate restricted staging area outside the public directory. The zip checksum matches after upload. It contains 19 runtime files and excludes docs, tests, review output, screenshots, private configuration and secrets. Noindex and the disabled form are retained; the private configuration is unchanged with enabled=false.

Live file checksums match the pre-check snapshot. Nothing was switched live, merged, pushed to main, or enabled. No Pages, CNAME, DNS or email-routing change occurred. Staging does not itself publish anything. Switching live and enabling signup wait for a separate direct go from the owner; approval records are maintained outside this repo.

Rollback now: remove the isolated staged release; the live site needs no restoration because it was not replaced. If a later authorised release needs rollback, restore the saved pre-release backup under a separate authorised operation. Private notes record the locations and checksums.

Older commits still contain the earlier hosting wording. A normal commit removed it from the current files; no history rewrite or force-push occurred.

## Round 4 mail fix

The previous plain-mail test did not use the working authenticated SMTP method. Exact rejection/loss cause cannot be established because readable mail-server logs were unavailable. SMTP now uses TLS with certificate verification, authentication, explicit From and a matching envelope sender. Submission fields appear only in the message body, except validated Reply-To. Errors contain generic codes; no SMTP credentials or raw replies are logged by signup.

One SMTP readiness test returned `250 2.0.0 Ok: queued as EA94E18001C0`; the owner confirmed arrival. SPF and DMARC records exist for the private sender domain. DKIM was not found at the provider’s standard selectors; actual DKIM and received SPF/DMARC pass status remain unverified without received authentication headers. No DNS or mail-routing changes were made.

32 isolated signup cases and 7 SMTP response/configuration cases pass. Both PHP modules lint successfully on PHP 8.3. The homepage opens the signed native form. Public canonical/social metadata is rendered from the supplied public origin while noindex remains. Approved public contact and 30-day retention/withdrawal wording are included in the privacy notice.

## Live verification, 2 October 2026

Owner-confirmed SMTP readiness delivery preceded the direct go-live instruction. The runtime-only FINAL zip was published after a fresh backup. Signup is enabled; noindex remains. Home, privacy, thank-you and the signed native form return HTTPS 200. CSP, frame denial, nosniff, referrer and indexing headers are present; X-Powered-By is absent. Direct mail-module requests are denied. Canonical and social metadata uses the supplied public origin, with no dummy domain.

A real test signup returned 200, saved one private record with mode 600 and completed SMTP without a failure entry. A forged request returned 403 with a generic response and no reflection of submitted email. Two messages total were tested in this round: the first was confirmed received; the live signup message awaits separate arrival confirmation. No more messages were sent.

Chrome verification at 390 and 1280px passes for home, privacy, thank-you and the signed form: zero automated axe violations, no mixed content, horizontal overflow, cookies or local storage, and no page errors. Empty form fields and headers were checked. Screenshots remain outside the repo. Local Lighthouse is 100 performance / 100 accessibility / 100 best practices / 69 SEO on both profiles; SEO remains limited by required noindex. Browser screen-reader sign-off and received authentication headers are not claimed.

Hourly cleanup could not be configured through the host’s SSH environment. The published notice therefore accurately describes request-driven expiry and possible idle overhang, rather than promising a scheduler. The private maintenance script is available. The owner’s approved list and withdrawal periods are preserved; deleting list entries and notification copies remains an owner-managed operational duty.
