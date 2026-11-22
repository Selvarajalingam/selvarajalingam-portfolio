# Phase 8 — Services and contact

Implement three supplied service groups with native keyboard/no-JavaScript accordions, no pricing, and enquiry links. Build the exact contact fields/subjects and privacy acknowledgement, with accessible validation, pending, accepted and error states. Keep established ink/paper/silver/violet tokens, sans-serif typography, wide opening and a practical two-column contact composition that stacks on mobile. No new illustrations or brand claims.

Server flow: same-origin JSON POST; bounded streaming body; strict schema; honeypot rejection; configuration gate; official Vercel Firewall rate-limit check; risk-triggered Turnstile with server-side hostname/action validation; Resend owner notification then visitor acknowledgement with separate idempotency keys. No contact database, no personal-data logging, no client secrets. Both providers have bounded timeouts. Never equate provider acceptance with inbox delivery. Acknowledgement failure after owner acceptance must not encourage resending the original enquiry.

Rulings: use Vercel Firewall counters rather than process-local memory, which would reset across serverless instances. The external rule must be configured before activation. Risk signals are very fast submissions or link-heavy messages; CAPTCHA is optional until configured, but flagged submissions fail closed if unavailable. No CAPTCHA script loads on ordinary visits. Do not send real emails during automated tests. Credentials are absent; live provider/domain/firewall verification is a deployment follow-up, not grounds to invent a passing delivery result.

Tasks: add canonical services and contact contract; implement/test server adapters and handler; build services/form/challenge/privacy pages; exercise abuse, provider failures, partial/ambiguous sends, idempotency, accessible forms and accordions; run full phase gate, browser suite, audit, bundle review and screenshot inspection; document configuration and actual limitations.

Official references checked 19 November 2026:
- https://vercel.com/docs/vercel-firewall/vercel-waf/rate-limiting-sdk
- https://resend.com/docs/api-reference/emails/send-email
- https://resend.com/docs/dashboard/emails/idempotency-keys
- https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
- https://developers.cloudflare.com/turnstile/get-started/client-side-rendering/
