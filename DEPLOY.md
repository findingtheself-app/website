# .self website: draft only

This public website branch is for review. An isolated staged release is prepared. Live publication, merge, Pages enablement, domain configuration, mailbox creation and routing changes are not authorised. The current Hostinger site remains unchanged. Approval records are maintained privately; a separate direct live-switch and collection decision is still required. Sign-up remains off for board CHANGE 0.1.16.

## Reference and scope

The supplied PDF shows the top of the previous draft. The original archive was unavailable. The latest request explicitly permits redesign using the PDF as a layout reference. The visible headline, purpose and Today content informed this design; unseen sections are new draft copy and need review. The PDF is not included in this public repository.

The private app repository was not accessed. The requested on-device privacy wording was restored from the supplied fixes brief, which describes it as checked against the app. This task did not independently audit the crypto implementation. Founders must confirm privacy wording against security-design.md before launch. Screen content is illustrative, including the unsigned journal words. Recovery words are hidden dots.

## Hosting observations, 1 October 2026

Hosting access checked. Details are kept in the private notes, not in this repo.

Web PHP 8.3.33 matches CLI PHP 8.3.33. The web mail function is available. One authorised test message returned: sent. The unguessable temporary PHP probe printed only version and mail availability, was immediately deleted, and returned HTTPS 404 on the removal check. No phpinfo or private configuration values were exposed.

A backup of the existing live site is stored in a restricted private backup area outside the public directory. The runtime-only FINAL zip and extracted release are in a separate restricted staging area outside the public directory. The zip checksum matches after upload. It contains 19 runtime files and excludes docs, tests, review output, screenshots, private configuration and secrets. Noindex and the disabled form are retained; the private configuration is unchanged with enabled=false.

Live file checksums match the pre-check snapshot. Nothing was switched live, merged, pushed to main, or enabled. No Pages, CNAME, DNS or email-routing change occurred. Staging does not itself publish anything. Switching live and enabling signup wait for a separate direct go from the owner; approval records are maintained outside this repo.

Rollback now: remove the isolated staged release; the live site needs no restoration because it was not replaced. If a later authorised release needs rollback, restore the saved pre-release backup under a separate authorised operation. Private notes record the locations and checksums.

Older commits still contain the earlier hosting wording. A normal commit removed it from the current files; no history rewrite or force-push occurred.

## Sign-up implementation

`index.html` has a disabled native form and an explicit “not open yet” notice. `signup.php` independently fails closed without a complete private configuration with `enabled` exactly `true`. Do not enable it during design review.

After a separately approved FINAL release, `signup.php` GET serves a native, no-JS form with a new signed token and `Cache-Control: no-store`. POST checks the configured exact HTTPS origin and browser same-origin hint, a signed token aged 3 seconds to 24 hours, a honeypot, consent version, lengths, valid email and control-character rejection. Missing Origin is rejected; there is no unsafe Referer fallback. Token hashes prevent replay. Generic JSON responses are available to clients that ask for JSON; browsers use 303 redirects. No address is reflected in responses.

A private JSON Lines file records UTC timestamp, email, optional name and consent version under a file lock, before attempting host `mail()`. Data files are created with mode 600; directories should be mode 700. If mail fails, the interest stays recorded and a generic failure code is logged without submission fields. No external API, browser script, cookie or local storage is used.

Rate limits allow three accepted attempts per 24-hour window per salted HMAC of `REMOTE_ADDR`. Proxy request headers are ignored. Confirm the server supplies the real client address in `REMOTE_ADDR`; do not blindly trust forwarded headers. Rate and replay records older than a day are removed on requests. Schedule the private CLI cleanup at least hourly before enabling collection, so idle records are also removed. Maximum physical retention can include the cleanup interval; final privacy wording must reflect the chosen schedule. Rotate the independent IP salt according to the approved policy.

## A later approved deployment

1. Resolve every item in `PLACEHOLDERS.md`, legal review and the board decision. Confirm domain, web PHP 8.3, mail sender/recipient, storage region, processor terms, rights and unsubscribe process, retention and host access-log policy.
2. Take a full backup of the existing .self web root and relevant configuration, record a checksum and confirm restore access. Protect backup files outside the web root. Do not touch other hosted sites, the private app, DNS, email routing or mailboxes.
3. Prepare a zip explicitly marked `FINAL` after approval. Include only public HTML, CSS, `signup.php`, `.htaccess`, `robots.txt`, `sitemap.xml` and `assets/` runtime images/SVGs. Exclude `assets/BADGE-README.md`, `config/`, `tests/`, docs, `.git`, audit output and any secrets. A runtime-only FINAL zip is prepared for non-live staging; its label does not imply founder approval.
4. Copy the example configuration and maintenance script to a private directory outside the website’s public directory. Set the configuration and private files to mode 600, the private directory and its `data/` directory to 700. Supply `OWNER_EMAIL`, approved sender, exact HTTPS origin, private data path and two different secrets generated independently with `bin2hex(random_bytes(32))`. Do not commit credentials. `SELF_SIGNUP_CONFIG` may override the private config path if the host supports it.
5. Keep `enabled => false` while testing staging. Verify that public requests cannot access config, data, tests or review paths, including encoded URLs and direct file requests. Confirm `.htaccess` works under the domain’s Apache/LiteSpeed setup. Set `expose_php=Off` in the host PHP settings and verify X-Powered-By is absent. Validate actual CSP, frame denial, nosniff, referrer policy, HTTPS redirect, error handling and token `no-store` headers. A static local server cannot validate these headers.
6. Schedule private cleanup, retention deletion and access review. The supplied cleanup removes rate/replay data; it does not decide sign-up-list retention or backup deletion. Approve and implement those procedures before collecting data.
7. Test the host mail path with approved test addresses on isolated staging only. Verify that an interest remains stored if mail fails, permissions are 600, no raw client addresses appear in application files, and logs contain only generic failure codes. Review any host-level logs separately.
8. Only after explicit collection approval, update the homepage form card to link to `signup.php` (the signed form endpoint) rather than enabling a static form without a token. Then set the private `enabled` flag to true. This prevents cached static HTML from carrying expired tokens. Recheck consent and unsubscribe behaviour without JavaScript, and perform keyboard and screen-reader review of the enabled form.
9. Keep `noindex`, header X-Robots-Tag and robots block until launch publication is separately approved. The page status banner has been removed at the requested review stage; status remains in the PR and PLACEHOLDERS.md. After the domain decision, set the single `CANONICAL_ORIGIN` constant in `config/site.json` and run `python3 tests/render-metadata.py` to render canonical/social/sitemap URLs before creating a FINAL zip. Copy that approved origin into the private sign-up configuration when authorised. Unset means no guessed absolute URLs. At separately approved launch, remove indexing restrictions and rerun audits. Keep a reviewed rollback plan and backup. Deploy only the approved FINAL zip when explicitly authorised.

## Local preview and checks

Serve the repository locally, for example `python3 -m http.server 8765 --bind 127.0.0.1`. Do not use a static server to claim PHP or security-header behaviour. PHP WebAssembly tests run against temporary local files only. For `tests/signup.mjs`, install `@php-wasm/node` and `@php-wasm/universal` in a temporary dependency directory and run with `SELF_TEST_MODULES=/path/to/node_modules node tests/signup.mjs`.

Browser audit tooling uses Playwright, axe-core and Lighthouse installed outside this repository. Axe injection requires test-only CSP bypass; the website retains `script-src 'none'`. Lighthouse uses the actual page policy. Scores and limits are in `TEST-RESULTS.md`. Screenshots and full reports are generated outside the repo at `SELF_AUDIT_OUTPUT`, or the temporary `self-website-audits` directory by default. The `review/` folder is removed. Key results belong in the PR description; screenshot attachments require a signed-in GitHub browser session.
