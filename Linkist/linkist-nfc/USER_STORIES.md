# User Stories 👥

## Customer Stories

### 🛍️ US‑01: Product Discovery
**As a visitor**, I can view `/nfc` to understand the product, pricing (USD), and delivery (≤10 days).

**Acceptance Criteria:**
- Landing page shows product benefits clearly
- Pricing is displayed in USD
- Delivery time shows "≤10 days"
- FAQ section answers common questions

### ⚙️ US‑02: Card Configuration
**As a customer**, I can configure my card with required fields and optional photo/background/socials.

**Acceptance Criteria:**
- E.164 phone validation works
- Email/URL patterns are validated
- File size limits are enforced (photo ≤10MB, background ≤20MB)
- Optional fields are clearly marked

### 👀 US‑03: Live Preview
**As a customer**, I can see a live proof and must approve it before adding to cart.

**Acceptance Criteria:**
- Preview shows front and back of card
- Changes update in real-time
- Approval is required before purchase
- Proof is stored for later reference

### 💳 US‑04: Checkout Process
**As a customer**, I can checkout as a guest, provide a delivery address, and pay in USD.

**Acceptance Criteria:**
- Guest checkout works without account creation
- Address form collects all required fields
- Payment is processed in USD
- Tax and shipping are calculated correctly

### 🔐 US‑05: Account Creation
**As a customer**, after payment, an account is auto‑created and I verify via email code.

**Acceptance Criteria:**
- Account is created automatically after successful payment
- Verification email is sent immediately
- Email code verification works
- No password required

### 📧 US‑06: Order Updates
**As a customer**, I receive emails: confirmation (with proof), receipt, in‑production, shipped (tracking), delivered.

**Acceptance Criteria:**
- All status emails are sent automatically
- Proof is included in confirmation email
- Tracking info is included in shipped email
- Emails are delivered reliably

### 📅 US‑07: Delivery Expectations
**As a customer**, I see an Expected delivery date (order date + 10 days) on checkout and confirmation.

**Acceptance Criteria:**
- ETA is displayed during checkout
- ETA is shown on confirmation page
- ETA is included in confirmation email

## Operations/Admin Stories

### 📋 AD‑01: Order Management
**As operations staff**, I can list orders with filters.

**Acceptance Criteria:**
- Orders are displayed in a table format
- Filters work by status, date range, country
- Pagination handles large numbers of orders
- Search functionality works

### 🔍 AD‑02: Order Details
**As operations staff**, I can view order details, locked proof, and assets.

**Acceptance Criteria:**
- All order information is visible
- Proof images can be viewed
- Customer details are accessible
- Asset files can be downloaded

### 📊 AD‑03: Status Updates
**As operations staff**, I can update statuses (paid → in_production → programmed → shipped → delivered).

**Acceptance Criteria:**
- Status transitions follow the correct flow
- Status changes are logged
- Appropriate emails are triggered
- Status updates are immediate

### 📦 AD‑04: Shipping Management
**As operations staff**, I can add carrier + tracking, which triggers shipped email.

**Acceptance Criteria:**
- Carrier and tracking can be entered
- Shipped email is sent automatically
- Tracking info is included in email
- Status is updated to "shipped"

### 📤 AD‑05: Communication Tools
**As operations staff**, I can resend any email and export CSV.

**Acceptance Criteria:**
- Any email type can be resent
- CSV export includes all order data
- Export format is customizable
- Email logs are maintained

## System Stories

### 🔄 SY‑01: Payment Webhooks
**As a system**, webhooks update payment status automatically.

**Acceptance Criteria:**
- Stripe webhooks are processed reliably
- Payment statuses are updated in real-time
- Failed webhooks are retried
- Webhook security is maintained

### 💾 SY‑02: File Storage
**As a system**, files are stored in object storage with signed URLs.

**Acceptance Criteria:**
- Files are uploaded to S3-compatible storage
- Signed URLs are generated for access
- File security is maintained
- Storage costs are optimized

### 🛡️ SY‑03: GDPR Compliance
**As a system**, GDPR DSR endpoints (export/delete) are available.

**Acceptance Criteria:**
- Data export endpoint works
- Data deletion endpoint works
- Audit logs are maintained
- Retention policies are enforced

### 📝 SY‑04: Email Logging
**As a system**, email logs are maintained with provider message IDs.

**Acceptance Criteria:**
- All emails are logged
- Provider message IDs are captured
- Delivery status is tracked
- Bounce handling works

---

**These stories help us understand exactly what we're building!** 🎯 Each one has clear acceptance criteria so we know when it's done.

