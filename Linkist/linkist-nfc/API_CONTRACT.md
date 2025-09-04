# API Contract 📋

## Overview

This document defines the API contract for the Linkist NFC e-commerce platform. All endpoints return JSON responses and use standard HTTP status codes.

### Base URL
- **Development**: `http://localhost:3000/api`
- **Production**: `https://linkist.ai/api`

### Authentication
- **Public endpoints**: No authentication required
- **Protected endpoints**: Require JWT token in `Authorization: Bearer <token>` header
- **Admin endpoints**: Require admin role in addition to authentication

### Response Format
```typescript
// Success response
{
  success: true,
  data: T,
  message?: string
}

// Error response
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: any
  }
}
```

### Common HTTP Status Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found
- `422` - Unprocessable Entity
- `429` - Too Many Requests (rate limited)
- `500` - Internal Server Error

---

## Authentication & Accounts

### Send Verification Code
**POST** `/api/auth/send-code`

Sends a one-time verification code to the specified email address.

**Request Body:**
```typescript
{
  email: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Verification code sent successfully"
  }
}
```

**Errors:**
- `400` - Invalid email format
- `429` - Too many requests (rate limited)

### Verify Code
**POST** `/api/auth/verify-code`

Verifies the one-time code and returns an authentication token.

**Request Body:**
```typescript
{
  email: string,
  code: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    token: string,
    user: {
      id: string,
      email: string,
      firstName?: string,
      lastName?: string,
      verified: boolean,
      founderMember: boolean
    }
  }
}
```

**Errors:**
- `400` - Invalid code format
- `401` - Invalid or expired code
- `429` - Too many attempts

---

## Configurator & Proof

### Generate Preview
**POST** `/api/configurator/preview`

Generates a live preview of the NFC card based on configuration.

**Request Body:**
```typescript
{
  firstName: string,
  lastName: string,
  title: string,
  company: string,
  mobile: string, // E.164 format
  whatsapp?: string, // E.164 format
  email: string,
  website?: string,
  socials?: {
    linkedin?: string,
    twitter?: string,
    instagram?: string
  },
  photo?: File,
  background?: File,
  founderBadge: boolean
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    previewId: string,
    previewUrl: string,
    expiresAt: string // ISO date string
  }
}
```

**Errors:**
- `400` - Validation error
- `413` - File too large
- `415` - Unsupported file type

---

## Cart & Checkout

### Get Cart
**GET** `/api/cart`

Retrieves the current user's shopping cart.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    items: Array<{
      id: string,
      productId: string,
      quantity: number,
      unitPriceUsd: number,
      cardConfig: {
        id: string,
        firstName: string,
        lastName: string,
        title: string,
        company: string,
        previewUrl: string
      }
    }>,
    summary: {
      subtotalUsd: number,
      shippingUsd: number,
      taxUsd: number,
      totalUsd: number
    }
  }
}
```

### Add to Cart
**POST** `/api/cart`

Adds an item to the shopping cart.

**Request Body:**
```typescript
{
  productId: string,
  quantity: number,
  cardConfigId: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    cartItemId: string,
    message: "Item added to cart successfully"
  }
}
```

### Update Cart Item
**PUT** `/api/cart/items/[id]`

Updates the quantity of a cart item.

**Request Body:**
```typescript
{
  quantity: number
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Cart item updated successfully"
  }
}
```

### Remove Cart Item
**DELETE** `/api/cart/items/[id]`

Removes an item from the cart.

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Item removed from cart successfully"
  }
}
```

### Checkout
**POST** `/api/checkout`

Initiates the checkout process and creates a payment intent.

**Request Body:**
```typescript
{
  cartId: string,
  address: {
    line1: string,
    line2?: string,
    city: string,
    region: string,
    country: string,
    postalCode: string,
    phone: string
  },
  email: string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    orderId: string,
    paymentIntent: {
      clientSecret: string,
      amount: number,
      currency: string
    },
    expectedDelivery: string // ISO date string
  }
}
```

**Errors:**
- `400` - Invalid address or cart
- `402` - Payment failed
- `422` - Insufficient inventory

---

## Webhooks

### Payment Webhook
**POST** `/api/webhooks/payments`

Handles webhooks from payment providers (Stripe).

**Headers:**
```
Stripe-Signature: <signature>
```

**Request Body:** Raw webhook event from Stripe

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Webhook processed successfully"
  }
}
```

**Note:** This endpoint is called by Stripe, not by the frontend.

---

## Orders & Shipping

### Get Order
**GET** `/api/orders/[id]`

Retrieves order details by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```typescript
{
  success: true,
  data: {
    id: string,
    email: string,
    status: OrderStatus,
    subtotalUsd: number,
    shippingUsd: number,
    taxUsd: number,
    totalUsd: number,
    expectedDelivery: string,
    createdAt: string,
    updatedAt: string,
    items: Array<{
      id: string,
      productId: string,
      quantity: number,
      unitPriceUsd: number,
      cardConfig: {
        id: string,
        firstName: string,
        lastName: string,
        title: string,
        company: string,
        previewUrl: string
      }
    }>,
    shipments: Array<{
      id: string,
      carrier: string,
      service: string,
      trackingNumber: string,
      shippedAt: string,
      deliveredAt?: string
    }>
  }
}
```

**Errors:**
- `401` - Authentication required
- `403` - Order belongs to different user
- `404` - Order not found

### Add Shipment Tracking
**POST** `/api/orders/[id]/shipment`

Adds tracking information for an order (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Request Body:**
```typescript
{
  carrier: string,
  service: string,
  trackingNumber: string,
  shippedAt: string // ISO date string
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    shipmentId: string,
    message: "Shipment tracking added successfully"
  }
}
```

**Errors:**
- `401` - Authentication required
- `403` - Admin access required
- `404` - Order not found

---

## Admin Operations

### List Orders
**GET** `/api/admin/orders`

Retrieves a list of orders with filtering and pagination (admin only).

**Headers:**
```
Authorization: Bearer <admin-token>
```

**Query Parameters:**
- `status` - Filter by order status
- `dateFrom` - Filter orders from date (ISO string)
- `dateTo` - Filter orders to date (ISO string)
- `country` - Filter by shipping country
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 20)

**Response:**
```typescript
{
  success: true,
  data: {
    orders: Array<{
      id: string,
      email: string,
      status: OrderStatus,
      totalUsd: number,
      country: string,
      createdAt: string
    }>,
    pagination: {
      page: number,
      limit: number,
      total: number,
      totalPages: number
    }
  }
}
```

### Update Order Status
**PUT** `/api/admin/orders/[id]/status`

Updates the status of an order (admin only).

**Request Body:**
```typescript
{
  status: OrderStatus
}
```

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Order status updated successfully"
  }
}
```

### Resend Email
**POST** `/api/admin/orders/[id]/email/[type]/resend`

Resends a specific email type for an order (admin only).

**Path Parameters:**
- `type` - Email type (confirmation, shipped, delivered)

**Response:**
```typescript
{
  success: true,
  data: {
    message: "Email sent successfully"
  }
}
```

---

## File Uploads

### Upload Asset
**POST** `/api/assets/upload`

Uploads a file (photo or background) and returns a signed URL.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Form Data:**
- `file` - File to upload
- `type` - Asset type (`photo` or `background`)

**Response:**
```typescript
{
  success: true,
  data: {
    assetId: string,
    url: string,
    type: string,
    size: number,
    mimeType: string
  }
}
```

**Errors:**
- `400` - Invalid file type or size
- `413` - File too large
- `415` - Unsupported file type

---

## Health & Status

### Health Check
**GET** `/api/health`

Returns the health status of the application and its dependencies.

**Response:**
```typescript
{
  success: true,
  data: {
    status: "healthy" | "unhealthy",
    timestamp: string,
    checks: {
      database: boolean,
      redis: boolean,
      storage: boolean,
      email: boolean
    }
  }
}
```

---

## Rate Limiting

### Limits
- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **File uploads**: 10 requests per hour per user
- **API endpoints**: 100 requests per minute per user
- **Webhooks**: No rate limiting (external service calls)

### Rate Limit Headers
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1640995200
```

### Rate Limit Response
When rate limited, the API returns:
```typescript
{
  success: false,
  error: {
    code: "RATE_LIMIT_EXCEEDED",
    message: "Too many requests, please try again later",
    retryAfter: 60 // seconds
  }
}
```

---

## Error Codes

### Common Error Codes
- `VALIDATION_ERROR` - Request validation failed
- `AUTHENTICATION_REQUIRED` - Authentication token missing or invalid
- `INSUFFICIENT_PERMISSIONS` - User lacks required permissions
- `RESOURCE_NOT_FOUND` - Requested resource doesn't exist
- `RATE_LIMIT_EXCEEDED` - Too many requests
- `PAYMENT_FAILED` - Payment processing failed
- `INSUFFICIENT_INVENTORY` - Product out of stock
- `FILE_TOO_LARGE` - Uploaded file exceeds size limit
- `INVALID_FILE_TYPE` - Unsupported file format

### Error Response Format
```typescript
{
  success: false,
  error: {
    code: string,
    message: string,
    details?: {
      field?: string,
      value?: any,
      constraint?: string
    }[],
    traceId?: string // For debugging in development
  }
}
```

---

## WebSocket Events (Future)

### Real-time Updates
The API will support WebSocket connections for real-time updates:

- **Order status changes**
- **Payment confirmations**
- **Proof generation progress**
- **Shipping updates**

**Connection URL:** `wss://linkist.ai/api/ws`

**Authentication:** JWT token in connection query parameter

---

## Versioning

### API Versioning
- **Current version**: v1
- **Version header**: `Accept: application/vnd.linkist.v1+json`
- **Default**: If no version specified, v1 is used
- **Deprecation**: 6 months notice before removing deprecated endpoints

### Breaking Changes
Breaking changes will be introduced in new major versions:
- **v1** - Current stable API
- **v2** - Future version with breaking changes
- **Migration guides** will be provided for major version upgrades

---

**This API contract ensures consistent communication between frontend and backend!** 🎯 All endpoints follow RESTful principles and return standardized responses.
