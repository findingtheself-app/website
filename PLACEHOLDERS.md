# Remaining verification and operational decisions

Published on 2 October 2026 after the owner’s direct go and confirmed SMTP readiness delivery. Signup is enabled; noindex remains. PR #1 stays draft and unmerged.

- [PLACEHOLDER] Before app launch, confirm the supplied on-device journal wording against security-design.md. No private app access or independent crypto audit occurred.
- [PLACEHOLDER] Confirm the hosting provider’s access-log processing and retention; application-level hashed rate data does not imply no host logging.
- [PLACEHOLDER] Confirm hosting/mailbox regions, international transfers and safeguards, and maintain the list of authorised readers.
- [PLACEHOLDER] Obtain received authentication results to verify SPF, DKIM and DMARC pass status. SPF/DMARC records exist; standard DKIM selectors were not found.
- [PLACEHOLDER] Complete manual assistive-technology sign-off beyond automated audits.

The owner approved publication, the current layout, controller/public contact, retention and withdrawal wording, and signup operation. The original v2 zip remains unavailable; the recreated privacy-band layout is not claimed as an exact reproduction. Roadmap dates and future features remain qualified in the published copy.

The private SMTP and signup configuration is complete on the server. The public example intentionally remains disabled and contains only empty configuration placeholders. No private credentials, recipient configuration or infrastructure identifiers are committed. The owner expressly approved the public contact in the privacy notice as the sole address exception.

Operational duties: remove withdrawals from future mailings on receipt, delete list records and related notifications within the approved 30-day period, and delete the list within 30 days after launch emails finish. Rate/replay expiry is request-driven; no hourly scheduler is configured through SSH. A private maintenance script is available for owner-managed cleanup.

Hosting access checked. Details are kept in the private notes, not in this repo. Older commits retain earlier hosting wording; history was not rewritten.
