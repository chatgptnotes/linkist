# Environment Configuration 🌍

## Overview

This document explains how to configure different environments for the Linkist NFC platform. Each environment has specific settings for development, testing, and production.

### Environment Types
- **Development**: Local development with emulators and test data
- **Staging**: Pre-production environment for testing
- **Production**: Live environment with real services

---

## Development Environment

### Local Setup
The development environment runs entirely on your local machine with minimal external dependencies.

#### Prerequisites
```bash
# Required software
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional)
- Git
```

#### Environment Variables
```bash
# .env.local
NODE_ENV=development

# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/linkist_nfc_dev"
REDIS_URL="redis://localhost:6379"

# Storage (Local S3 emulator)
S3_BUCKET="linkist-nfc-dev"
S3_REGION="us-east-1"
S3_ENDPOINT="http://localhost:9000"
S3_ACCESS_KEY_ID="minioadmin"
S3_SECRET_ACCESS_KEY="minioadmin"

# Payments (Stripe test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Local SMTP or test service)
SES_REGION="us-east-1"
SES_ACCESS_KEY_ID="test"
SES_SECRET_ACCESS_KEY="test"
SES_FROM_EMAIL="noreply@localhost"

# Application
APP_BASE_URL="http://localhost:3000"
JWT_SECRET="dev-secret-key-change-in-production"
ENCRYPTION_KEY="dev-encryption-key-32-chars"

# Feature Flags
ENABLE_ANALYTICS=false
ENABLE_EMAIL_SENDING=false
ENABLE_PAYMENT_PROCESSING=true
ENABLE_FILE_UPLOADS=true
```

#### Local Services Setup
```bash
# PostgreSQL (using Docker)
docker run --name linkist-postgres \
  -e POSTGRES_DB=linkist_nfc_dev \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=password \
  -p 5432:5432 \
  -d postgres:15

# Redis (using Docker)
docker run --name linkist-redis \
  -p 6379:6379 \
  -d redis:7-alpine

# MinIO (S3 emulator)
docker run --name linkist-minio \
  -e MINIO_ROOT_USER=minioadmin \
  -e MINIO_ROOT_PASSWORD=minioadmin \
  -p 9000:9000 \
  -p 9001:9001 \
  -d minio/minio server /data --console-address ":9001"
```

#### Development Commands
```bash
# Install dependencies
npm install

# Set up database
npm run db:setup
npm run db:migrate
npm run db:seed

# Start development server
npm run dev

# Run tests
npm run test
npm run test:watch

# Lint and format code
npm run lint
npm run format

# Type checking
npm run type-check
```

---

## Staging Environment

### Purpose
The staging environment mirrors production as closely as possible while allowing safe testing of new features and configurations.

#### Environment Variables
```bash
# .env.staging
NODE_ENV=staging

# Database (Staging instance)
DATABASE_URL="postgresql://user:password@staging-db.linkist.ai:5432/linkist_nfc_staging"
REDIS_URL="redis://staging-redis.linkist.ai:6379"

# Storage (Staging S3 bucket)
S3_BUCKET="linkist-nfc-staging"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="staging-access-key"
S3_SECRET_ACCESS_KEY="staging-secret-key"

# Payments (Stripe test mode)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Staging SES configuration)
SES_REGION="us-east-1"
SES_ACCESS_KEY_ID="staging-access-key"
SES_SECRET_ACCESS_KEY="staging-secret-key"
SES_FROM_EMAIL="noreply@staging.linkist.ai"

# Application
APP_BASE_URL="https://staging.linkist.ai"
JWT_SECRET="staging-jwt-secret-very-long-and-secure"
ENCRYPTION_KEY="staging-encryption-key-32-characters"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_EMAIL_SENDING=true
ENABLE_PAYMENT_PROCESSING=true
ENABLE_FILE_UPLOADS=true

# Monitoring
SENTRY_DSN="https://staging-sentry-dsn@sentry.io/project-id"
LOG_LEVEL="info"
```

#### Staging Infrastructure
```bash
# Database
- PostgreSQL 15+ on managed service
- Automated backups every 6 hours
- Point-in-time recovery enabled
- Connection pooling configured

# Storage
- S3-compatible storage (AWS S3 or MinIO)
- Lifecycle policies for cost optimization
- Versioning enabled for data protection
- Cross-region replication (optional)

# Cache
- Redis 7+ on managed service
- Persistence enabled
- Backup and failover configured
- Monitoring and alerting set up

# Email
- AWS SES in sandbox mode
- Verified domain for testing
- Bounce and complaint handling
- Delivery tracking enabled
```

#### Staging Deployment
```bash
# Deploy to staging
npm run deploy:staging

# Run staging tests
npm run test:staging

# Database migrations
npm run db:migrate:staging

# Seed test data
npm run db:seed:staging
```

---

## Production Environment

### Purpose
The production environment serves real customers with live data and requires the highest level of security and reliability.

#### Environment Variables
```bash
# .env.production
NODE_ENV=production

# Database (Production instance)
DATABASE_URL="postgresql://user:password@prod-db.linkist.ai:5432/linkist_nfc_prod"
REDIS_URL="redis://prod-redis.linkist.ai:6379"

# Storage (Production S3 bucket)
S3_BUCKET="linkist-nfc-prod"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="prod-access-key"
S3_SECRET_ACCESS_KEY="prod-secret-key"

# Payments (Stripe live mode)
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (Production SES configuration)
SES_REGION="us-east-1"
SES_ACCESS_KEY_ID="prod-access-key"
SES_SECRET_ACCESS_KEY="prod-secret-key"
SES_FROM_EMAIL="noreply@linkist.ai"

# Application
APP_BASE_URL="https://linkist.ai"
JWT_SECRET="production-jwt-secret-very-long-and-secure-random"
ENCRYPTION_KEY="production-encryption-key-32-characters"

# Feature Flags
ENABLE_ANALYTICS=true
ENABLE_EMAIL_SENDING=true
ENABLE_PAYMENT_PROCESSING=true
ENABLE_FILE_UPLOADS=true

# Security
CORS_ORIGIN="https://linkist.ai"
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Monitoring
SENTRY_DSN="https://production-sentry-dsn@sentry.io/project-id"
LOG_LEVEL="warn"
NEW_RELIC_LICENSE_KEY="your-new-relic-key"
```

#### Production Infrastructure
```bash
# Database
- PostgreSQL 15+ on managed service
- Multi-AZ deployment for high availability
- Automated backups every 1 hour
- Point-in-time recovery enabled
- Read replicas for scaling
- Connection pooling optimized

# Storage
- AWS S3 with intelligent tiering
- Lifecycle policies for cost optimization
- Versioning and replication enabled
- CloudFront CDN for global delivery
- WAF protection enabled

# Cache
- Redis 7+ on managed service
- Multi-AZ deployment
- Persistence and backup enabled
- Auto-scaling based on usage
- Monitoring and alerting

# Email
- AWS SES in production mode
- Verified domain with SPF/DKIM/DMARC
- Bounce and complaint handling
- Delivery tracking and analytics
- Suppression list management
```

#### Production Deployment
```bash
# Deploy to production
npm run deploy:production

# Run production health checks
npm run health:check

# Database migrations (with rollback plan)
npm run db:migrate:production

# Monitor deployment
npm run monitor:deployment
```

---

## Environment-Specific Configurations

### Feature Flags
```typescript
// config/features.ts
export const featureFlags = {
  development: {
    enableAnalytics: false,
    enableEmailSending: false,
    enablePaymentProcessing: true,
    enableFileUploads: true,
    enableDebugMode: true,
    enableTestData: true,
  },
  staging: {
    enableAnalytics: true,
    enableEmailSending: true,
    enablePaymentProcessing: true,
    enableFileUploads: true,
    enableDebugMode: false,
    enableTestData: true,
  },
  production: {
    enableAnalytics: true,
    enableEmailSending: true,
    enablePaymentProcessing: true,
    enableFileUploads: true,
    enableDebugMode: false,
    enableTestData: false,
  },
};
```

### Database Configurations
```typescript
// config/database.ts
export const databaseConfig = {
  development: {
    pool: {
      min: 2,
      max: 10,
      idleTimeoutMillis: 30000,
    },
    logging: true,
    ssl: false,
  },
  staging: {
    pool: {
      min: 5,
      max: 20,
      idleTimeoutMillis: 30000,
    },
    logging: false,
    ssl: true,
  },
  production: {
    pool: {
      min: 10,
      max: 50,
      idleTimeoutMillis: 30000,
    },
    logging: false,
    ssl: true,
  },
};
```

### Security Configurations
```typescript
// config/security.ts
export const securityConfig = {
  development: {
    corsOrigin: ['http://localhost:3000'],
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 1000,
    jwtExpiresIn: '7d',
    encryptionEnabled: false,
  },
  staging: {
    corsOrigin: ['https://staging.linkist.ai'],
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 500,
    jwtExpiresIn: '24h',
    encryptionEnabled: true,
  },
  production: {
    corsOrigin: ['https://linkist.ai'],
    rateLimitWindowMs: 900000,
    rateLimitMaxRequests: 100,
    jwtExpiresIn: '24h',
    encryptionEnabled: true,
  },
};
```

---

## Environment Management

### Configuration Files
```bash
# Environment file structure
linkist-nfc/
├── .env.example          # Template with all required variables
├── .env.local           # Local development (git ignored)
├── .env.staging         # Staging environment (git ignored)
├── .env.production      # Production environment (git ignored)
└── config/
    ├── environments/
    │   ├── development.ts
    │   ├── staging.ts
    │   └── production.ts
    └── index.ts
```

### Environment Validation
```typescript
// config/validation.ts
import { z } from 'zod';

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'staging', 'production']),
  DATABASE_URL: z.string().url(),
  REDIS_URL: z.string().url(),
  S3_BUCKET: z.string(),
  S3_REGION: z.string(),
  STRIPE_SECRET_KEY: z.string().startsWith('sk_'),
  JWT_SECRET: z.string().min(32),
  // ... other validations
});

export function validateEnvironment() {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    console.error('Environment validation failed:', error);
    process.exit(1);
  }
}
```

### Environment Switching
```bash
# Switch between environments
export NODE_ENV=development
export NODE_ENV=staging
export NODE_ENV=production

# Or use environment-specific files
source .env.local
source .env.staging
source .env.production
```

---

## Secrets Management

### Local Development
```bash
# Store secrets in .env.local (git ignored)
echo "STRIPE_SECRET_KEY=sk_test_..." >> .env.local
echo "JWT_SECRET=your-secret-key" >> .env.local
```

### Staging/Production
```bash
# Use secret management service
# AWS Secrets Manager
aws secretsmanager get-secret-value --secret-id linkist-nfc-staging

# HashiCorp Vault
vault read secret/linkist-nfc-staging

# Environment variables in deployment platform
# Vercel, Netlify, etc.
```

### Secret Rotation
```bash
# Regular secret rotation schedule
- JWT secrets: Every 90 days
- API keys: Every 180 days
- Database passwords: Every 365 days
- Encryption keys: Every 365 days
```

---

## Monitoring & Observability

### Development
```typescript
// Basic logging
console.log('Development mode - verbose logging enabled');
console.error('Error occurred:', error);
```

### Staging
```typescript
// Structured logging with Sentry
import * as Sentry from '@sentry/node';

Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'staging',
  tracesSampleRate: 1.0,
});

logger.info('Staging environment - monitoring enabled');
```

### Production
```typescript
// Full observability stack
import * as Sentry from '@sentry/node';
import * as NewRelic from 'newrelic';

// Sentry for error tracking
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  environment: 'production',
  tracesSampleRate: 0.1,
});

// New Relic for performance monitoring
NewRelic.start();

// Structured logging
logger.info('Production environment - full monitoring enabled');
```

---

## Troubleshooting

### Common Issues
```bash
# Database connection issues
- Check DATABASE_URL format
- Verify network connectivity
- Check firewall rules
- Verify credentials

# Redis connection issues
- Check REDIS_URL format
- Verify Redis service is running
- Check port accessibility

# S3 access issues
- Verify AWS credentials
- Check bucket permissions
- Verify region configuration
- Check IAM policies

# Email delivery issues
- Check SES configuration
- Verify domain verification
- Check bounce/complaint rates
- Review sending limits
```

### Environment-Specific Debugging
```bash
# Development
npm run debug:dev

# Staging
npm run debug:staging

# Production
npm run debug:production
```

---

**Proper environment configuration ensures secure, reliable, and scalable deployment!** 🎯 Each environment is optimized for its specific purpose while maintaining consistency across the platform.

