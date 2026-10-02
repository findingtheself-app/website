The .self website is live after the owner’s direct instruction, confirmed SMTP readiness delivery and approved privacy wording. Signup is enabled through the signed native PHP route. PR #1 remains draft and unmerged; main, Pages, DNS and email routing are unchanged. Noindex remains.

## Current changes and results

- Authenticated TLS SMTP from private config, with explicit From and matching envelope sender. The readiness test returned `250 2.0.0 Ok: queued as EA94E18001C0`; the owner confirmed arrival. No new password request was needed.
- The earlier plain-mail path differed from the working SMTP method. Exact missing-mail cause is not proven because readable mail-server logs were unavailable. SPF/DMARC records exist; DKIM and received authentication pass results remain unverified. No DNS or routing changes were made.
- Approved controller/public-contact and 30-day retention/withdrawal wording in the privacy notice, lowercase .self throughout. The approved public contact is the sole exception to the earlier address restriction. Recipient configuration, SMTP credentials and infrastructure details remain private.
- Public canonical/social metadata uses the supplied public origin; noindex retained. Homepage opens the signed native form. No submitted details are reflected in responses.
- 32 signup tests and 7 SMTP protocol/config tests pass. Both PHP modules lint on PHP 8.3. Live Chrome checks at 390/1280px pass for home, privacy, thank-you and signup: no mixed content, overflow, page errors, cookies or local storage; zero automated axe violations. Local Lighthouse: 100/100/100/69, with crawlability intentionally blocked.
- Real live test: HTTPS 200, one record saved privately with mode 600, no mail failure entry; separate arrival confirmation pending. Forged submit: clean 403, no reflection. Exactly two test messages this round; no further messages sent.
- Fresh private backup taken before publication. Runtime-only FINAL zip contains 20 files; docs, tests, screenshots, review output, secrets and private config excluded. HTTPS pages, CSP, frame denial, nosniff, noindex, hidden PHP version header and denied direct mail-module access verified.

Rollback: restore the private pre-release site backup and disabled signup config.

Hosting access checked. Details are kept in the private notes, not in this repo. Older commits still hold earlier hosting wording; normal commits were added without rewriting history or force-pushing. Live runtime changes are in commits `db58f5e` and `e7e9904`.

Remaining limits: full assistive-technology sign-off, received authentication results and provider processing/location details remain review items. Rate expiry is request-driven because the hourly scheduler is unavailable through SSH; the notice accurately states idle records can remain until the next request. Owner-managed withdrawal, list retention and notification deletion duties remain.

## Live HTTPS screenshots

Captured in Chrome after publication. Empty fields are shown; no personal submission data is pictured.

<details><summary>Live 390px: hero, signup card and signed form</summary>

![Hero at 390px](https://github.com/user-attachments/assets/80943a7f-34eb-4945-9f9d-8621aa19bb77)

![Signup card at 390px](https://github.com/user-attachments/assets/f4a78a43-4670-4c27-bf27-7c2355f0e5c8)

![Signed form at 390px](https://github.com/user-attachments/assets/734cb75b-ea2b-42e9-aec2-357f81ff1003)

</details>

<details><summary>Live 1280px: hero, signup card and signed form</summary>

![Hero at 1280px](https://github.com/user-attachments/assets/6da2267d-1483-4dd3-94f5-23b7f5652420)

![Signup card at 1280px](https://github.com/user-attachments/assets/3d37cfb2-f8e0-4baa-bbdb-53584fe7b14f)

![Signed form at 1280px](https://github.com/user-attachments/assets/e2c0272a-3942-43de-85ac-0a6ef08cc4cd)

</details>

## Earlier design screenshots

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


## Every remaining [PLACEHOLDER]

- [PLACEHOLDER] Before app launch, confirm the supplied on-device journal wording against security-design.md. No private app access or independent crypto audit occurred.
- [PLACEHOLDER] Confirm the hosting provider’s access-log processing and retention; application-level hashed rate data does not imply no host logging.
- [PLACEHOLDER] Confirm hosting/mailbox regions, international transfers and safeguards, and maintain the list of authorised readers.
- [PLACEHOLDER] Obtain received authentication results to verify SPF, DKIM and DMARC pass status. SPF/DMARC records exist; standard DKIM selectors were not found.
- [PLACEHOLDER] Complete manual assistive-technology sign-off beyond automated audits.
