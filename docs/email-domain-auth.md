# Email Domain Authentication Guide

For reliable delivery (>95% inbox rate) each sending domain must have SPF, DKIM, and DMARC records.
Resend generates these records automatically — you just need to add them to DNS.

## Per-domain setup (repeat for each client domain)

### Step 1 — Add domain in Resend

1. Log in to [resend.com](https://resend.com)
2. Go to **Domains → Add Domain**
3. Enter the domain (e.g. `example.com`)
4. Resend shows you 3–4 DNS records to add

### Step 2 — Add DNS records

Add all records provided by Resend in your DNS provider (Cloudflare, Route 53, GoDaddy, etc.).

Typical records:

| Type | Name | Value |
|------|------|-------|
| TXT | `resend._domainkey.example.com` | `p=...` (DKIM public key) |
| TXT | `example.com` | `v=spf1 include:amazonses.com ~all` |
| MX | `bounces.example.com` | `feedback-smtp.us-east-1.amazonses.com` |

### Step 3 — DMARC record (recommended)

Add this TXT record to each domain:

```
Name:  _dmarc.example.com
Value: v=DMARC1; p=quarantine; rua=mailto:dmarc@example.com; pct=100
```

Start with `p=none` for monitoring, then move to `p=quarantine` once delivery is confirmed.

### Step 4 — Verify in Resend

Resend checks DNS automatically every few minutes. The domain status turns green once verified.

### Step 5 — Update `RESEND_FROM_EMAIL`

Set the `from` address to match a verified domain:
```
RESEND_FROM_EMAIL=Client Name <hello@clientdomain.com>
```

For the agency's own outbound emails, set it to the agency domain.

## Multi-client sending

Pass a custom `from` address per API call to send from different client domains:

```typescript
await sendTransactional({
  to: recipient,
  subject: 'Hello from Client XYZ',
  html: ...,
  from: 'Client XYZ <noreply@clientxyz.com>',  // must be a verified Resend domain
})
```

## Checklist before first send

- [ ] Domain verified in Resend (green status)
- [ ] SPF record present
- [ ] DKIM record present  
- [ ] DMARC record present (start with `p=none`)
- [ ] `RESEND_API_KEY` set in Vercel env vars
- [ ] `RESEND_FROM_EMAIL` matches verified domain
- [ ] Smoke test passes (see `scripts/smoke-test-email.mjs`)
