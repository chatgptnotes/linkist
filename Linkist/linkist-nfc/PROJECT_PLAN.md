# Project Plan 📋

## Scope

### MVP (Minimum Viable Product)
- **Single NFC card product** with personalization, preview, checkout, emails, and basic admin
- **Multi‑region shipping**; USD only

### Must‑have Features
- `/nfc` landing + FAQ + Founder banner
- **Configurator** (mandatory fields; optional socials/photo/bg)
- **Live proof**; approval required to purchase
- **Cart & Checkout** with address, VAT 5%, shipping surcharge
- **Stripe payments**; email OTP account creation
- **Emails**: confirmation, receipt, in‑production, shipped (tracking), delivered
- **Admin dashboard**: orders, statuses, proof viewer, tracking, resend emails
- **GDPR & deliverability** (SPF/DKIM/DMARC)

### Nice‑to‑have Features
- Coupons & referral codes (post‑launch activation)
- Apple Pay/Google Pay (via Stripe)
- Artwork versioning; self‑service reorders
- Multi‑product catalog

### Out of Scope (MVP)
- Native mobile apps
- Multi‑currency pricing (display only later)
- Complex tax automation per jurisdiction

## Milestones

### 🚀 P0 Foundations (Week 1–2)
- Repository setup, CI/CD, environments
- Design tokens and basic styling
- Database (Postgres), S3 bucket, Redis cache
- Domain scaffolding + health checks

### 🛍️ P1 Storefront & Configurator (Week 3–5)
- `/nfc` landing, FAQ, Founder banner
- Config form + uploads + validation
- Client preview + basic proof state

### 💳 P2 Cart/Payments/Logistics (Week 6–8)
- Cart, tax (5%), shipping surcharge logic
- Stripe integration + Payment Intents + webhooks
- Expected delivery computation

### 📧 P3 Proof Render & Emails (Week 9–10)
- Server proof render PNG/PDF + store to S3
- SES templates + domain auth (SPF/DKIM/DMARC)
- Email log table + resend endpoints

### ⚙️ P4 Admin & Fulfillment (Week 11–12)
- Orders list/detail + status transitions
- Tracking entry + shipped/delivered emails
- CSV export

### 🎯 P5 Launch (Week 13)
- SEO, accessibility, performance pass
- Runbook and training materials

### 🚀 Post‑launch
- Referrals/coupons activation
- Add digital wallets
- More product options

## Risks & Mitigations

### Payment Declines
- **Risk**: International payment failures
- **Mitigation**: Enable 3DS; retry logic; later add Checkout.com

### Email Spam
- **Risk**: Poor deliverability
- **Mitigation**: SPF/DKIM/DMARC; warmed IPs; suppression list

### Shipping Variability
- **Risk**: Delays and customer complaints
- **Mitigation**: Conservative ETA; proactive shipped emails

## Success Metrics
- **Conversion rate**: Target >5% from landing to purchase
- **Time to checkout**: <3 minutes from config start
- **Email deliverability**: >95% inbox placement
- **Customer satisfaction**: >4.5/5 rating

---

**Next step**: Review the `TASK_LIST.md` to see what needs to be done first! 🎯

