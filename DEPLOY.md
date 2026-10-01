# .Self website: draft only

This public website branch is for review. No deployment, merge, Pages enablement, domain configuration, mailbox creation or routing changes are authorised. The current Hostinger site remains unchanged. Both founders must approve the design, copy, privacy and sign-up route on the board before a separate release decision. Sign-up remains off for board CHANGE 0.1.16.

## Reference and scope

The supplied PDF shows the top of the previous draft. The original archive was unavailable. The latest request explicitly permits redesign using the PDF as a layout reference. The visible headline, purpose and Today content informed this design; unseen sections are new draft copy and need review. The PDF is not included in this public repository.

The private app repository was not accessed. The requested on-device privacy wording was restored from the supplied fixes brief, which describes it as checked against the app. This task did not independently audit the crypto implementation. Founders must confirm privacy wording against security-design.md before launch. Screen content is illustrative, including the unsigned journal words. Recovery words are hidden dots.

## Read-only hosting observations, 1 October 2026

The existing bigredbox SSH account can list `domains/findingtheself.app/public_html`. It therefore covers the .Self domain directory; this does not establish permission to deploy. The bigredbox contact handler was read for its request validation and private-config pattern only. Its branding, recipient, relay and raw-address storage were not copied.

Read-only SSH access reached `domains/findingtheself.app/public_html` itself. Default host CLI PHP was 8.2.33. `/opt/alt/php83/usr/bin/php` reported PHP 8.3.33 from that directory, with `mail()` available; it also linted the handler and maintenance script over stdin. Availability is not a delivery test. The .Self web runtime was not probed or changed. Confirm PHP 8.3 for this domain before deployment. No files were uploaded or changed on Hostinger. No test messages were sent through its mail system.

## Sign-up implementation

`index.html` has a disabled native form and an explicit “not open yet” notice. `signup.php` independently fails closed without a complete private configuration with `enabled` exactly `true`. Do not enable it during design review.

After a separately approved FINAL release, `signup.php` GET serves a native, no-JS form with a new signed token and `Cache-Control: no-store`. POST checks the configured exact HTTPS origin and browser same-origin hint, a signed token aged 3 seconds to 24 hours, a honeypot, consent version, lengths, valid email and control-character rejection. Missing Origin is rejected; there is no unsafe Referer fallback. Token hashes prevent replay. Generic JSON responses are available to clients that ask for JSON; browsers use 303 redirects. No address is reflected in responses.

A private JSON Lines file records UTC timestamp, email, optional name and consent version under a file lock, before attempting host `mail()`. Data files are created with mode 600; directories should be mode 700. If mail fails, the interest stays recorded and a generic failure code is logged without submission fields. No external API, browser script, cookie or local storage is used.

Rate limits allow three accepted attempts per 24-hour window per salted HMAC of `REMOTE_ADDR`. Proxy request headers are ignored. Confirm the server supplies the real client address in `REMOTE_ADDR`; do not blindly trust forwarded headers. Rate and replay records older than a day are removed on requests. Schedule the private CLI cleanup at least hourly before enabling collection, so idle records are also removed. Maximum physical retention can include the cleanup interval; final privacy wording must reflect the chosen schedule. Rotate the independent IP salt according to the approved policy.

## A later approved deployment

1. Resolve every item in `PLACEHOLDERS.md`, legal review and the board decision. Confirm domain, web PHP 8.3, mail sender/recipient, storage region, processor terms, rights and unsubscribe process, retention and host access-log policy.
2. Take a full backup of the existing .Self web root and relevant configuration, record a checksum and confirm restore access. Protect backup files outside the web root. Do not touch other hosted sites, the private app, DNS, email routing or mailboxes.
3. Prepare a zip explicitly marked `FINAL` after approval. Include only public HTML, CSS, `signup.php`, `.htaccess`, `robots.txt`, `sitemap.xml` and `assets/` runtime images/SVGs. Exclude `assets/BADGE-README.md`, `config/`, `tests/`, docs, `.git`, audit output and any secrets. No FINAL zip has been prepared by this task.
4. Copy the example configuration and maintenance script to a private directory outside `public_html`; for the default path this is the sibling `self-private/`. Set the configuration and private files to mode 600, the private directory and its `data/` directory to 700. Supply `OWNER_EMAIL`, approved sender, exact HTTPS origin, private data path and two different secrets generated independently with `bin2hex(random_bytes(32))`. Do not commit credentials. `SELF_SIGNUP_CONFIG` may override the private config path if the host supports it.
5. Keep `enabled => false` while testing staging. Verify that public requests cannot access config, data, tests or review paths, including encoded URLs and direct file requests. Confirm `.htaccess` works under the domain’s Apache/LiteSpeed setup. Set `expose_php=Off` in the host PHP settings and verify X-Powered-By is absent. Validate actual CSP, frame denial, nosniff, referrer policy, HTTPS redirect, error handling and token `no-store` headers. A static local server cannot validate these headers.
6. Schedule private cleanup, retention deletion and access review. The supplied cleanup removes rate/replay data; it does not decide sign-up-list retention or backup deletion. Approve and implement those procedures before collecting data.
7. Test the host mail path with approved test addresses on isolated staging only. Verify that an interest remains stored if mail fails, permissions are 600, no raw client addresses appear in application files, and logs contain only generic failure codes. Review any host-level logs separately.
8. Only after explicit collection approval, update the homepage form card to link to `signup.php` (the signed form endpoint) rather than enabling a static form without a token. Then set the private `enabled` flag to true. This prevents cached static HTML from carrying expired tokens. Recheck consent and unsubscribe behaviour without JavaScript, and perform keyboard and screen-reader review of the enabled form.
9. Keep `noindex`, header X-Robots-Tag and robots block until launch publication is separately approved. The page status banner has been removed at the requested review stage; status remains in the PR and PLACEHOLDERS.md. After the domain decision, set the single `CANONICAL_ORIGIN` constant in `config/site.json` and run `python3 tests/render-metadata.py` to render canonical/social/sitemap URLs before creating a FINAL zip. Copy that approved origin into the private sign-up configuration when authorised. Unset means no guessed absolute URLs. At separately approved launch, remove indexing restrictions and rerun audits. Keep a reviewed rollback plan and backup. Deploy only the approved FINAL zip when explicitly authorised.

## Local preview and checks

Serve the repository locally, for example `python3 -m http.server 8765 --bind 127.0.0.1`. Do not use a static server to claim PHP or security-header behaviour. PHP WebAssembly tests run against temporary local files only. For `tests/signup.mjs`, install `@php-wasm/node` and `@php-wasm/universal` in a temporary dependency directory and run with `SELF_TEST_MODULES=/path/to/node_modules node tests/signup.mjs`.

Browser audit tooling uses Playwright, axe-core and Lighthouse installed outside this repository. Axe injection requires test-only CSP bypass; the website retains `script-src 'none'`. Lighthouse uses the actual page policy. Scores and limits are in `TEST-RESULTS.md`. Screenshots and full reports are generated outside the repo at `SELF_AUDIT_OUTPUT`, or the temporary `self-website-audits` directory by default. The `review/` folder is removed. Key results belong in the PR description; screenshot attachments require a signed-in GitHub browser session.
