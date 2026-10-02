# .self website release

The owner directly authorised publication after confirming SMTP readiness-test delivery and approving the signup privacy wording. The website and signed native signup are live as of 2 October 2026. Noindex remains. PR #1 is draft and unmerged; main, Pages, CNAME, DNS and mail routing are unchanged.

Hosting access checked. Details are kept in the private notes, not in this repo. Older commits retain earlier hosting wording; no history rewrite or force-push occurred.

## Runtime and packaging

The FINAL zip contains public HTML, CSS, signup.php, mail-transport.php, .htaccess, robots.txt, sitemap.xml and runtime image/SVG assets. It has 20 runtime files. Exclude config templates, tests, docs, review output, screenshots, .git and all private settings. The mail module is denied direct web access but remains available to the signup script through a filesystem include.

The homepage opens signup.php. GET renders the native form with a fresh signed time token and no-store caching. POST validates exact HTTPS origin, token signature/age, consent, fields, honeypot, replay and rate limits. It stores interest in restricted private files before SMTP. Notification errors use generic failure codes without personal data. SMTP uses authenticated TLS with certificate verification, explicit From and matching envelope sender; it has no relay fallback.

The private configuration, independently generated token secret and IP salt, SMTP credentials and signup files stay outside the public directory and repo. Config/list files use mode 600; the data directory uses 700. The public config example remains disabled. Public canonical/social metadata is generated from the approved origin constant. No indexing restrictions were removed.

## Privacy and maintenance

The owner approved the public contact solely for the privacy notice; no private mail configuration values are published in these notes. Process withdrawals on receipt so no further emails are sent, and delete list records and notification copies within the approved 30 days. After launch emails finish, delete the list within 30 days. Do not include list data in release backups.

Rate/replay records expire on requests. An hourly scheduler is unavailable through this SSH environment, so the published notice accurately describes possible idle overhang. A private maintenance script is available for owner-managed cleanup. Verify a hosting-dashboard cleanup schedule before promising a fixed automated interval.

## Rollback

Restore the private pre-release site backup and disabled signup configuration. Private notes record the verified backup, release checksum and operational locations. Preserve any collected signup data privately if rolling back; do not expose or discard it as part of a site-file restore.

## Verification

See TEST-RESULTS.md for 32 signup cases, 7 SMTP cases, PHP lint, live HTTPS/browser checks at 390/1280px, security headers and mail confirmation. Screenshots and reports are generated outside this repo. Run tests/live-browser.cjs with external Playwright/axe dependencies and an output directory outside the repo; it performs read-only checks and sends no mail.

Review PLACEHOLDERS.md for remaining provider/authentication and assistive-technology verification. The private app repo was not accessed; supplied on-device journal wording was not independently audited.
