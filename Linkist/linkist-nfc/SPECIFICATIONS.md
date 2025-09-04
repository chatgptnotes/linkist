# Technical Specifications 🔧

## Frontend

### Technology Stack
- **Framework**: Next.js App Router with SSR/ISR pages
- **Styling**: Tailwind CSS for utility-first styling
- **Validation**: Zod schemas for form validation
- **File Uploads**: Signed URL uploads to S3

### Page Structure
```
/nfc                    # Landing page with product details
/nfc/configure         # Card configuration form
/nfc/cart             # Shopping cart
/nfc/checkout         # Checkout process
/nfc/success          # Order confirmation
/account/verify       # Email verification
```

### Key Components
- **ConfigForm**: Card personalization form with validation
- **ProofPreview**: Live preview showing front/back of card
- **CartSummary**: Cart contents and pricing breakdown
- **AddressForm**: Delivery address collection
- **PaymentWidget**: Stripe payment integration
- **StatusBadge**: Order status indicators

### User Experience
- **Responsive design**: Works on all device sizes
- **Real-time updates**: Preview changes instantly
- **Form validation**: Clear error messages
- **Loading states**: Skeleton screens during processing
- **Accessibility**: WCAG AA compliance

## Backend

### Technology Stack
- **Runtime**: Node.js with Next API routes (or NestJS service)
- **Database**: PostgreSQL for structured data
- **Cache**: Redis for sessions, carts, and rate limits
- **Storage**: S3-compatible object storage for assets

### API Architecture
- **REST endpoints**: See `API_CONTRACT.md` for details
- **Background jobs**: Proof rendering and email sending
- **Webhooks**: Payment status updates from Stripe
- **Rate limiting**: Prevent abuse on sensitive endpoints

### Domain Modules
- **Catalog**: Product information and pricing
- **Configurator**: Card personalization logic
- **Orders**: Order management and fulfillment
- **Payments**: Payment processing and webhooks
- **Tax/Shipping**: Rules and calculations
- **Proof**: Image generation and storage
- **Accounts**: User management and verification
- **Notifications**: Email templates and delivery
- **Admin**: Operations dashboard and tools

### Background Jobs
- **Proof Render**: Convert card config to PNG/PDF
- **Email Send**: Deliver status updates and confirmations
- **File Processing**: Optimize uploaded images
- **Data Cleanup**: Remove expired sessions and old files

## Integrations

### Stripe Payments
- **Payment Intents**: Secure payment processing
- **Webhooks**: Real-time status updates
- **3D Secure**: Enhanced security for international payments
- **Apple Pay/Google Pay**: Mobile payment options

### AWS Services
- **SES**: Transactional email delivery
- **S3**: File storage and asset management
- **Lambda/Cloud Run**: Serverless proof rendering
- **CloudFront**: CDN for static assets

### External Services
- **Geolocation**: Determine shipping and tax rules
- **Email validation**: Verify email addresses
- **Phone validation**: E.164 format validation
- **Analytics**: Track user behavior and conversions

## Data Management

### Database Schema
- **Users**: Customer accounts and preferences
- **Orders**: Order details and status tracking
- **CardConfigs**: Personalization settings
- **Assets**: Uploaded files and generated proofs
- **Payments**: Payment records and receipts
- **Shipments**: Delivery tracking information

### File Storage
- **Upload limits**: Photos ≤10MB, backgrounds ≤20MB
- **Supported formats**: JPG, PNG for images
- **Security**: Signed URLs with expiration
- **Optimization**: Automatic compression and resizing

### Caching Strategy
- **Sessions**: User authentication state
- **Carts**: Shopping cart contents
- **Rate limits**: API usage tracking
- **Proofs**: Generated card images

## Performance Requirements

### Response Times
- **Page load**: <3 seconds on 4G connection
- **API calls**: <500ms for most operations
- **File uploads**: <10 seconds for maximum file sizes
- **Proof generation**: <5 seconds for card rendering

### Scalability
- **Concurrent users**: Support 100+ simultaneous users
- **File storage**: Handle 1000+ uploads per day
- **Email delivery**: Process 500+ emails per hour
- **Database**: Support 10,000+ orders

### Monitoring
- **Uptime**: 99.9% availability target
- **Error rates**: <1% for critical operations
- **Performance**: Track Core Web Vitals
- **Business metrics**: Conversion rates and order volumes

## Security & Compliance

### Data Protection
- **Encryption**: TLS 1.2+ for data in transit
- **Storage**: Encrypted at rest in database and S3
- **Access control**: Role-based permissions
- **Audit logging**: Track all data access and changes

### Privacy Compliance
- **GDPR**: Data subject rights and consent management
- **Data retention**: Automatic cleanup of old files
- **User control**: Export and deletion capabilities
- **Transparency**: Clear privacy policy and data usage

### Application Security
- **Input validation**: Sanitize all user inputs
- **CSRF protection**: Prevent cross-site request forgery
- **Rate limiting**: Prevent abuse and attacks
- **Secure headers**: HSTS, CSP, and other security headers

---

**These specifications ensure we build a robust, scalable, and secure system!** 🎯 Each component is designed to work together seamlessly.

