# Backend Development Guide ⚙️

## Technology Stack

### Runtime & Framework
- **Node.js 18+**: LTS version with latest features
- **Next.js API Routes**: Server-side API endpoints
- **TypeScript**: Full type safety and IntelliSense
- **Express.js**: Optional middleware for complex routing

### Database & Storage
- **PostgreSQL 15+**: Primary relational database
- **Redis 7+**: Caching, sessions, and rate limiting
- **S3-compatible Storage**: File storage for assets and proofs
- **Prisma**: Type-safe database client and migrations

### External Services
- **Stripe**: Payment processing and webhooks
- **AWS SES**: Transactional email delivery
- **Lambda/Cloud Run**: Serverless proof rendering
- **CloudFront**: CDN for static assets

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Jest**: Unit and integration testing
- **Supertest**: API endpoint testing

## Project Structure

### API Routes Organization
```
app/api/
├── auth/                  # Authentication endpoints
│   ├── send-code/
│   │   └── route.ts      # POST /api/auth/send-code
│   └── verify-code/
│       └── route.ts      # POST /api/auth/verify-code
├── configurator/          # Card configuration
│   └── preview/
│       └── route.ts      # POST /api/configurator/preview
├── cart/                  # Shopping cart
│   └── route.ts          # GET/POST /api/cart
├── checkout/              # Checkout process
│   └── route.ts          # POST /api/checkout
├── webhooks/              # External service webhooks
│   └── payments/
│       └── route.ts      # POST /api/webhooks/payments
├── orders/                # Order management
│   ├── [id]/
│   │   └── route.ts      # GET /api/orders/:id
│   └── [id]/shipment/
│       └── route.ts      # POST /api/orders/:id/shipment
└── admin/                 # Admin operations
    └── orders/
        └── route.ts      # GET /api/admin/orders
```

### Domain Modules
```
src/
├── domains/               # Business logic by domain
│   ├── auth/             # Authentication and user management
│   ├── catalog/          # Product information
│   ├── configurator/     # Card personalization
│   ├── orders/           # Order management
│   ├── payments/         # Payment processing
│   ├── shipping/         # Shipping and tax calculations
│   ├── proof/            # Card proof generation
│   └── notifications/    # Email and notification system
├── shared/               # Common utilities and types
│   ├── types/            # TypeScript type definitions
│   ├── utils/            # Utility functions
│   ├── constants/        # Application constants
│   └── errors/           # Error handling utilities
├── infrastructure/       # External service integrations
│   ├── database/         # Database connections and models
│   ├── storage/          # File storage operations
│   ├── email/            # Email service integration
│   └── payments/         # Payment provider integration
└── middleware/           # Custom middleware functions
    ├── auth.ts           # Authentication middleware
    ├── validation.ts     # Request validation
    ├── rateLimit.ts      # Rate limiting
    └── errorHandler.ts   # Global error handling
```

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- Redis 7+
- Docker (optional, for local development)

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd linkist-nfc

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Set up database
npm run db:setup

# Run migrations
npm run db:migrate

# Start development server
npm run dev
```

### Environment Variables
```bash
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/linkist_nfc"
REDIS_URL="redis://localhost:6379"

# Storage
S3_BUCKET="linkist-nfc-assets"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"

# Payments
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SES_REGION="us-east-1"
SES_ACCESS_KEY_ID="your-access-key"
SES_SECRET_ACCESS_KEY="your-secret-key"

# Application
APP_BASE_URL="http://localhost:3000"
JWT_SECRET="your-jwt-secret"
```

## Development Workflow

### Code Quality
```bash
# Lint code
npm run lint

# Format code
npm run format

# Type check
npm run type-check

# Run all quality checks
npm run quality
```

### Testing
```bash
# Run unit tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

### Database Operations
```bash
# Generate migration
npm run db:migrate:generate

# Run migrations
npm run db:migrate

# Reset database
npm run db:reset

# Seed database
npm run db:seed
```

## API Development

### Creating New Endpoints
```typescript
// app/api/example/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { validateRequest } from '@/lib/middleware/validation'

const exampleSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email'),
})

export async function POST(request: NextRequest) {
  try {
    // Validate request body
    const body = await request.json()
    const validatedData = validateRequest(exampleSchema, body)
    
    // Process the request
    const result = await processExample(validatedData)
    
    // Return success response
    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    // Handle errors
    return handleApiError(error)
  }
}

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    
    // Fetch data
    const data = await fetchExamples({ page, limit })
    
    return NextResponse.json({
      success: true,
      data,
      pagination: {
        page,
        limit,
        total: data.length,
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
```

### Middleware Usage
```typescript
// lib/middleware/auth.ts
import { NextRequest, NextResponse } from 'next/server'
import { verifyJWT } from '@/lib/auth/jwt'

export async function authMiddleware(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    
    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      )
    }
    
    const payload = await verifyJWT(token)
    request.headers.set('user-id', payload.userId)
    
    return NextResponse.next()
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    )
  }
}

// Usage in route
export async function GET(request: NextRequest) {
  // Apply middleware
  const authResult = await authMiddleware(request)
  if (authResult.status !== 200) {
    return authResult
  }
  
  // Continue with protected logic
  const userId = request.headers.get('user-id')
  // ... rest of the logic
}
```

## Database Operations

### Prisma Schema
```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  firstName String?
  lastName  String?
  verified  Boolean  @default(false)
  founderMember Boolean @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  orders    Order[]
  addresses Address[]
}

model Order {
  id                    String   @id @default(cuid())
  userId               String?
  email                String
  status               OrderStatus @default(PENDING)
  subtotalUsd          Decimal  @db.Decimal(10, 2)
  shippingUsd          Decimal  @db.Decimal(10, 2)
  taxUsd               Decimal  @db.Decimal(10, 2)
  totalUsd             Decimal  @db.Decimal(10, 2)
  expectedDeliveryDate DateTime
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt
  
  user      User?        @relation(fields: [userId], references: [id])
  items    OrderItem[]
  payments Payment[]
  shipments Shipment[]
}

enum OrderStatus {
  PENDING
  PAID
  IN_PRODUCTION
  PROGRAMMED
  SHIPPED
  DELIVERED
  CANCELLED
}
```

### Database Operations
```typescript
// src/domains/orders/orders.service.ts
import { PrismaClient } from '@prisma/client'
import { CreateOrderDto, OrderStatus } from './orders.types'

export class OrdersService {
  constructor(private prisma: PrismaClient) {}
  
  async createOrder(data: CreateOrderDto) {
    return this.prisma.order.create({
      data: {
        email: data.email,
        subtotalUsd: data.subtotalUsd,
        shippingUsd: data.shippingUsd,
        taxUsd: data.taxUsd,
        totalUsd: data.totalUsd,
        expectedDeliveryDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // +10 days
        items: {
          create: data.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPriceUsd: item.unitPriceUsd,
            cardConfigId: item.cardConfigId,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
            cardConfig: true,
          },
        },
      },
    })
  }
  
  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: true,
        shipments: true,
      },
    })
  }
  
  async getOrders(filters: OrderFilters) {
    const where: any = {}
    
    if (filters.status) {
      where.status = filters.status
    }
    
    if (filters.dateFrom) {
      where.createdAt = {
        gte: filters.dateFrom,
      }
    }
    
    if (filters.dateTo) {
      where.createdAt = {
        lte: filters.dateTo,
      }
    }
    
    return this.prisma.order.findMany({
      where,
      include: {
        items: true,
        shipments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      skip: (filters.page - 1) * filters.limit,
      take: filters.limit,
    })
  }
}
```

## External Service Integration

### Stripe Integration
```typescript
// src/infrastructure/payments/stripe.service.ts
import Stripe from 'stripe'
import { CreatePaymentIntentDto } from './payments.types'

export class StripeService {
  private stripe: Stripe
  
  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2023-10-16',
    })
  }
  
  async createPaymentIntent(data: CreatePaymentIntentDto) {
    return this.stripe.paymentIntents.create({
      amount: Math.round(data.amount * 100), // Convert to cents
      currency: 'usd',
      metadata: {
        orderId: data.orderId,
        customerEmail: data.customerEmail,
      },
    })
  }
  
  async handleWebhook(event: Stripe.Event) {
    switch (event.type) {
      case 'payment_intent.succeeded':
        return this.handlePaymentSuccess(event.data.object as Stripe.PaymentIntent)
      
      case 'payment_intent.payment_failed':
        return this.handlePaymentFailure(event.data.object as Stripe.PaymentIntent)
      
      default:
        console.log(`Unhandled event type: ${event.type}`)
    }
  }
  
  private async handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId
    // Update order status to PAID
    // Send confirmation email
    // Trigger proof generation
  }
  
  private async handlePaymentFailure(paymentIntent: Stripe.PaymentIntent) {
    const orderId = paymentIntent.metadata.orderId
    // Update order status
    // Send failure notification
  }
}
```

### AWS SES Integration
```typescript
// src/infrastructure/email/ses.service.ts
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses'
import { EmailTemplate, SendEmailDto } from './email.types'

export class SESService {
  private ses: SESClient
  
  constructor() {
    this.ses = new SESClient({
      region: process.env.SES_REGION!,
      credentials: {
        accessKeyId: process.env.SES_ACCESS_KEY_ID!,
        secretAccessKey: process.env.SES_SECRET_ACCESS_KEY!,
      },
    })
  }
  
  async sendEmail(data: SendEmailDto) {
    const command = new SendEmailCommand({
      Source: process.env.SES_FROM_EMAIL!,
      Destination: {
        ToAddresses: [data.to],
      },
      Message: {
        Subject: {
          Data: data.subject,
          Charset: 'UTF-8',
        },
        Body: {
          Html: {
            Data: data.htmlBody,
            Charset: 'UTF-8',
          },
          Text: {
            Data: data.textBody,
            Charset: 'UTF-8',
          },
        },
      },
    })
    
    try {
      const result = await this.ses.send(command)
      
      // Log email sent
      await this.logEmailSent({
        to: data.to,
        subject: data.subject,
        messageId: result.MessageId!,
        template: data.template,
      })
      
      return result
    } catch (error) {
      // Log email failure
      await this.logEmailFailure({
        to: data.to,
        subject: data.subject,
        error: error instanceof Error ? error.message : 'Unknown error',
        template: data.template,
      })
      
      throw error
    }
  }
  
  private async logEmailSent(data: any) {
    // Store in database for tracking
  }
  
  private async logEmailFailure(data: any) {
    // Store failure for retry logic
  }
}
```

## Background Jobs

### Proof Generation Job
```typescript
// src/domains/proof/proof.job.ts
import { Queue } from 'bull'
import { ProofService } from './proof.service'

export class ProofGenerationJob {
  private queue: Queue
  
  constructor(private proofService: ProofService) {
    this.queue = new Queue('proof-generation', {
      redis: process.env.REDIS_URL!,
    })
    
    this.setupProcessors()
  }
  
  private setupProcessors() {
    this.queue.process('generate-proof', async (job) => {
      const { cardConfigId, orderId } = job.data
      
      try {
        // Generate proof
        const proof = await this.proofService.generateProof(cardConfigId)
        
        // Store proof
        await this.proofService.storeProof(proof, orderId)
        
        // Send confirmation email
        await this.proofService.sendProofEmail(orderId, proof)
        
        return { success: true, proofId: proof.id }
      } catch (error) {
        // Log error and retry
        console.error('Proof generation failed:', error)
        throw error
      }
    })
    
    // Handle failed jobs
    this.queue.on('failed', (job, err) => {
      console.error(`Job ${job.id} failed:`, err)
      
      // Retry logic
      if (job.attemptsMade < 3) {
        job.retry()
      } else {
        // Mark as permanently failed
        console.error(`Job ${job.id} permanently failed after 3 attempts`)
      }
    })
  }
  
  async addToQueue(cardConfigId: string, orderId: string) {
    return this.queue.add('generate-proof', {
      cardConfigId,
      orderId,
    }, {
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 2000,
      },
    })
  }
}
```

## Error Handling

### Global Error Handler
```typescript
// lib/middleware/errorHandler.ts
import { NextRequest, NextResponse } from 'next/server'

export function handleApiError(error: unknown) {
  console.error('API Error:', error)
  
  if (error instanceof ValidationError) {
    return NextResponse.json({
      error: 'Validation failed',
      details: error.details,
    }, { status: 400 })
  }
  
  if (error instanceof AuthenticationError) {
    return NextResponse.json({
      error: 'Authentication failed',
    }, { status: 401 })
  }
  
  if (error instanceof AuthorizationError) {
    return NextResponse.json({
      error: 'Access denied',
    }, { status: 403 })
  }
  
  if (error instanceof NotFoundError) {
    return NextResponse.json({
      error: 'Resource not found',
    }, { status: 404 })
  }
  
  // Default error response
  return NextResponse.json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' 
      ? error instanceof Error ? error.message : 'Unknown error'
      : 'Something went wrong',
  }, { status: 500 })
}
```

### Custom Error Classes
```typescript
// src/shared/errors/index.ts
export class ValidationError extends Error {
  constructor(
    message: string,
    public details: Record<string, string[]>
  ) {
    super(message)
    this.name = 'ValidationError'
  }
}

export class AuthenticationError extends Error {
  constructor(message: string = 'Authentication required') {
    super(message)
    this.name = 'AuthenticationError'
  }
}

export class AuthorizationError extends Error {
  constructor(message: string = 'Access denied') {
    super(message)
    this.name = 'AuthorizationError'
  }
}

export class NotFoundError extends Error {
  constructor(message: string = 'Resource not found') {
    super(message)
    this.name = 'NotFoundError'
  }
}
```

## Testing

### Unit Tests
```typescript
// __tests__/domains/orders/orders.service.test.ts
import { OrdersService } from '@/domains/orders/orders.service'
import { PrismaClient } from '@prisma/client'

describe('OrdersService', () => {
  let ordersService: OrdersService
  let mockPrisma: jest.Mocked<PrismaClient>
  
  beforeEach(() => {
    mockPrisma = {
      order: {
        create: jest.fn(),
        update: jest.fn(),
        findMany: jest.fn(),
      },
    } as any
    
    ordersService = new OrdersService(mockPrisma as any)
  })
  
  describe('createOrder', () => {
    it('should create an order with correct data', async () => {
      const orderData = {
        email: 'test@example.com',
        subtotalUsd: 49.00,
        shippingUsd: 0,
        taxUsd: 2.45,
        totalUsd: 51.45,
        items: [{
          productId: 'prod_123',
          quantity: 1,
          unitPriceUsd: 49.00,
          cardConfigId: 'config_123',
        }],
      }
      
      const expectedOrder = {
        id: 'order_123',
        ...orderData,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      mockPrisma.order.create.mockResolvedValue(expectedOrder as any)
      
      const result = await ordersService.createOrder(orderData)
      
      expect(mockPrisma.order.create).toHaveBeenCalledWith({
        data: {
          email: orderData.email,
          subtotalUsd: orderData.subtotalUsd,
          shippingUsd: orderData.shippingUsd,
          taxUsd: orderData.taxUsd,
          totalUsd: orderData.totalUsd,
          expectedDeliveryDate: expect.any(Date),
          items: {
            create: orderData.items,
          },
        },
        include: {
          items: {
            include: {
              product: true,
              cardConfig: true,
            },
          },
        },
      })
      
      expect(result).toEqual(expectedOrder)
    })
  })
})
```

### Integration Tests
```typescript
// __tests__/api/orders.test.ts
import { createMocks } from 'node-mocks-http'
import { GET, POST } from '@/app/api/orders/route'
import { OrdersService } from '@/domains/orders/orders.service'

jest.mock('@/domains/orders/orders.service')

describe('/api/orders', () => {
  describe('GET', () => {
    it('should return orders with pagination', async () => {
      const { req } = createMocks({
        method: 'GET',
        url: '/api/orders?page=1&limit=10',
      })
      
      const mockOrders = [
        {
          id: 'order_1',
          email: 'test@example.com',
          status: 'PAID',
          totalUsd: 51.45,
        },
      ]
      
      jest.spyOn(OrdersService.prototype, 'getOrders')
        .mockResolvedValue(mockOrders)
      
      const response = await GET(req)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrders)
    })
  })
  
  describe('POST', () => {
    it('should create a new order', async () => {
      const orderData = {
        email: 'test@example.com',
        subtotalUsd: 49.00,
        shippingUsd: 0,
        taxUsd: 2.45,
        totalUsd: 51.45,
        items: [{
          productId: 'prod_123',
          quantity: 1,
          unitPriceUsd: 49.00,
          cardConfigId: 'config_123',
        }],
      }
      
      const { req } = createMocks({
        method: 'POST',
        body: orderData,
      })
      
      const mockOrder = {
        id: 'order_123',
        ...orderData,
        status: 'PENDING',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      
      jest.spyOn(OrdersService.prototype, 'createOrder')
        .mockResolvedValue(mockOrder as any)
      
      const response = await POST(req)
      const data = await response.json()
      
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.data).toEqual(mockOrder)
    })
  })
})
```

## Deployment

### Production Build
```bash
# Build the application
npm run build

# Start production server
npm start

# Or use PM2 for process management
pm2 start npm --name "linkist-nfc" -- start
```

### Environment Configuration
```bash
# Production environment variables
NODE_ENV=production
DATABASE_URL="postgresql://user:password@prod-db:5432/linkist_nfc"
REDIS_URL="redis://prod-redis:6379"
S3_BUCKET="linkist-nfc-prod-assets"
STRIPE_SECRET_KEY="sk_live_..."
SES_REGION="us-east-1"
```

### Health Checks
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server'
import { checkDatabaseConnection } from '@/lib/health/database'
import { checkRedisConnection } from '@/lib/health/redis'
import { checkStorageConnection } from '@/lib/health/storage'

export async function GET() {
  try {
    const checks = await Promise.allSettled([
      checkDatabaseConnection(),
      checkRedisConnection(),
      checkStorageConnection(),
    ])
    
    const isHealthy = checks.every(check => 
      check.status === 'fulfilled' && check.value
    )
    
    const status = isHealthy ? 200 : 503
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: checks[0].status === 'fulfilled' ? checks[0].value : false,
        redis: checks[1].status === 'fulfilled' ? checks[1].value : false,
        storage: checks[2].status === 'fulfilled' ? checks[2].value : false,
      },
    }, { status })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 })
  }
}
```

---

**Ready to build robust, scalable backend services!** 🎯 Remember to handle errors gracefully, test thoroughly, and monitor performance in production.
