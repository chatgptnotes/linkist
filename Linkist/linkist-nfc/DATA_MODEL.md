# Data Model 🗄️

## Overview

This document defines the database schema for the Linkist NFC e-commerce platform. The system uses PostgreSQL as the primary database with Redis for caching and sessions.

### Database Design Principles
- **Normalization**: Third normal form to minimize data redundancy
- **Referential Integrity**: Foreign key constraints for data consistency
- **Audit Trail**: Timestamps and soft deletes where appropriate
- **Scalability**: Indexes on frequently queried fields
- **Security**: Encrypted storage for sensitive data

---

## Core Entities

### Users
Stores customer account information and authentication details.

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  verified BOOLEAN DEFAULT FALSE,
  founder_member BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_verified ON users(verified);
CREATE INDEX idx_users_founder_member ON users(founder_member);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `email`: User's email address (unique)
- `first_name`: User's first name
- `last_name`: User's last name
- `verified`: Whether email has been verified
- `founder_member`: Whether user is a Founder Member
- `created_at`: Account creation timestamp
- `updated_at`: Last update timestamp

### Addresses
Stores delivery addresses for orders.

```sql
CREATE TABLE addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  line1 VARCHAR(255) NOT NULL,
  line2 VARCHAR(255),
  city VARCHAR(100) NOT NULL,
  region VARCHAR(100) NOT NULL,
  country VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
  postal_code VARCHAR(20) NOT NULL,
  phone VARCHAR(20) NOT NULL, -- E.164 format
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_addresses_user_id ON addresses(user_id);
CREATE INDEX idx_addresses_country ON addresses(country);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `user_id`: Reference to user (optional, for guest orders)
- `line1`: Primary address line
- `line2`: Secondary address line
- `city`: City name
- `region`: State/province/region
- `country`: Country code (ISO 3166-1 alpha-2)
- `postal_code`: Postal/ZIP code
- `phone`: Contact phone number
- `created_at`: Address creation timestamp
- `updated_at`: Last update timestamp

### Products
Stores product information and pricing.

```sql
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  sku VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  base_price_usd DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  options_schema JSONB, -- Product customization options
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_products_sku ON products(sku);
CREATE INDEX idx_products_active ON products(active);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `name`: Product name
- `sku`: Stock keeping unit (unique)
- `description`: Product description
- `base_price_usd`: Base price in USD
- `active`: Whether product is available for purchase
- `options_schema`: JSON schema for customization options
- `created_at`: Product creation timestamp
- `updated_at`: Last update timestamp

### Card Configs
Stores NFC card personalization settings.

```sql
CREATE TABLE card_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_item_id UUID REFERENCES order_items(id) ON DELETE CASCADE,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  title VARCHAR(255),
  company VARCHAR(255),
  mobile_e164 VARCHAR(20) NOT NULL, -- E.164 format
  whatsapp_e164 VARCHAR(20), -- E.164 format
  email VARCHAR(255) NOT NULL,
  website_url VARCHAR(500),
  socials JSONB, -- Social media links
  photo_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  bg_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  preview_asset_id UUID REFERENCES assets(id) ON DELETE SET NULL,
  approved BOOLEAN DEFAULT FALSE,
  approved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_card_configs_order_item_id ON card_configs(order_item_id);
CREATE INDEX idx_card_configs_approved ON card_configs(approved);
CREATE INDEX idx_card_configs_email ON card_configs(email);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `order_item_id`: Reference to order item
- `first_name`: Card holder's first name
- `last_name`: Card holder's last name
- `title`: Professional title
- `company`: Company name
- `mobile_e164`: Mobile phone (E.164 format)
- `whatsapp_e164`: WhatsApp number (E.164 format)
- `email`: Contact email
- `website_url`: Personal website
- `socials`: JSON object with social media links
- `photo_asset_id`: Reference to profile photo
- `bg_asset_id`: Reference to background image
- `preview_asset_id`: Reference to generated preview
- `approved`: Whether configuration has been approved
- `approved_at`: Approval timestamp
- `created_at`: Configuration creation timestamp
- `updated_at`: Last update timestamp

### Assets
Stores file uploads and generated images.

```sql
CREATE TABLE assets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(50) NOT NULL, -- 'photo', 'background', 'preview'
  storage_key VARCHAR(500) NOT NULL, -- S3 object key
  mime_type VARCHAR(100) NOT NULL,
  size_bytes BIGINT NOT NULL,
  checksum VARCHAR(64) NOT NULL, -- SHA-256 hash
  dimensions JSONB, -- {width: number, height: number}
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_assets_type ON assets(type);
CREATE INDEX idx_assets_created_by ON assets(created_by);
CREATE INDEX idx_assets_checksum ON assets(checksum);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `type`: Asset type (photo, background, preview)
- `storage_key`: S3 object storage key
- `mime_type`: MIME type of the file
- `size_bytes`: File size in bytes
- `checksum`: SHA-256 hash for integrity
- `dimensions`: Image dimensions (width, height)
- `created_by`: Reference to user who uploaded
- `created_at`: Upload timestamp

### Orders
Stores order information and status.

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  email VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL DEFAULT 'pending',
  subtotal_usd DECIMAL(10,2) NOT NULL,
  shipping_usd DECIMAL(10,2) NOT NULL,
  tax_usd DECIMAL(10,2) NOT NULL,
  total_usd DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  expected_delivery_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_email ON orders(email);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);
CREATE INDEX idx_orders_expected_delivery ON orders(expected_delivery_date);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `user_id`: Reference to user (optional, for guest orders)
- `email`: Customer email address
- `status`: Order status (pending, paid, in_production, programmed, shipped, delivered, cancelled)
- `subtotal_usd`: Subtotal in USD
- `shipping_usd`: Shipping cost in USD
- `tax_usd`: Tax amount in USD
- `total_usd`: Total amount in USD
- `currency`: Currency code (default: USD)
- `expected_delivery_date`: Expected delivery date
- `notes`: Order notes
- `created_at`: Order creation timestamp
- `updated_at`: Last update timestamp

### Order Items
Stores individual items within orders.

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE RESTRICT,
  quantity INTEGER NOT NULL CHECK (quantity > 0),
  unit_price_usd DECIMAL(10,2) NOT NULL,
  total_price_usd DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_order_items_order_id ON order_items(order_id);
CREATE INDEX idx_order_items_product_id ON order_items(product_id);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `order_id`: Reference to order
- `product_id`: Reference to product
- `quantity`: Item quantity
- `unit_price_usd`: Unit price in USD
- `total_price_usd`: Total price for this item
- `created_at`: Item creation timestamp

### Payments
Stores payment information and receipts.

```sql
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  provider VARCHAR(50) NOT NULL, -- 'stripe', 'checkout.com'
  provider_charge_id VARCHAR(255) NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  status VARCHAR(50) NOT NULL, -- 'pending', 'succeeded', 'failed'
  receipt_url VARCHAR(500),
  metadata JSONB, -- Provider-specific metadata
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_payments_order_id ON payments(order_id);
CREATE INDEX idx_payments_provider ON payments(provider);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_payments_provider_charge_id ON payments(provider_charge_id);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `order_id`: Reference to order
- `provider`: Payment provider name
- `provider_charge_id`: Provider's charge ID
- `amount_usd`: Payment amount in USD
- `currency`: Payment currency
- `status`: Payment status
- `receipt_url`: URL to payment receipt
- `metadata`: JSON object with provider metadata
- `created_at`: Payment creation timestamp
- `updated_at`: Last update timestamp

### Shipments
Stores shipping and tracking information.

```sql
CREATE TABLE shipments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  carrier VARCHAR(100) NOT NULL, -- 'FedEx', 'DHL', 'UPS'
  service VARCHAR(100) NOT NULL, -- 'Express', 'Ground', 'Priority'
  tracking_number VARCHAR(255) NOT NULL,
  shipped_at TIMESTAMP WITH TIME ZONE,
  delivered_at TIMESTAMP WITH TIME ZONE,
  estimated_delivery DATE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shipments_order_id ON shipments(order_id);
CREATE INDEX idx_shipments_carrier ON shipments(carrier);
CREATE INDEX idx_shipments_tracking_number ON shipments(tracking_number);
CREATE INDEX idx_shipments_shipped_at ON shipments(shipped_at);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `order_id`: Reference to order
- `carrier`: Shipping carrier name
- `service`: Shipping service type
- `tracking_number`: Tracking number
- `shipped_at`: Shipment timestamp
- `delivered_at`: Delivery timestamp
- `estimated_delivery`: Estimated delivery date
- `notes`: Shipping notes
- `created_at`: Shipment creation timestamp
- `updated_at`: Last update timestamp

---

## Configuration Tables

### Tax Rules
Stores tax rates for different regions.

```sql
CREATE TABLE tax_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  country_code VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
  region_code VARCHAR(10), -- State/province code
  rate_percent DECIMAL(5,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tax_rules_country_region ON tax_rules(country_code, region_code);
CREATE INDEX idx_tax_rules_active ON tax_rules(active);

-- Default tax rule (5% for all regions)
INSERT INTO tax_rules (country_code, region_code, rate_percent) 
VALUES ('*', '*', 5.00);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `country_code`: Country code (ISO 3166-1 alpha-2)
- `region_code`: Region code (optional, for state/province specific rates)
- `rate_percent`: Tax rate percentage
- `active`: Whether rule is active
- `created_at`: Rule creation timestamp
- `updated_at`: Last update timestamp

### Shipping Rules
Stores shipping costs and surcharges.

```sql
CREATE TABLE shipping_rules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  base_region VARCHAR(2) DEFAULT 'AE', -- UAE as base region
  destination_region VARCHAR(2) NOT NULL, -- ISO 3166-1 alpha-2
  surcharge_usd DECIMAL(10,2) NOT NULL,
  active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_shipping_rules_destination ON shipping_rules(destination_region);
CREATE INDEX idx_shipping_rules_active ON shipping_rules(active);

-- Default shipping rules
INSERT INTO shipping_rules (destination_region, surcharge_usd) VALUES
('SA', 15.00), -- Saudi Arabia
('EG', 15.00), -- Egypt
('GB', 20.00), -- United Kingdom
('DE', 20.00), -- Germany
('US', 25.00), -- United States
('CA', 25.00), -- Canada
('AU', 22.00), -- Australia
('JP', 22.00); -- Japan
```

**Fields:**
- `id`: Unique identifier (UUID)
- `base_region`: Base region for shipping (default: UAE)
- `destination_region`: Destination region
- `surcharge_usd`: Additional shipping cost in USD
- `active`: Whether rule is active
- `created_at`: Rule creation timestamp
- `updated_at`: Last update timestamp

---

## Audit & Logging Tables

### Email Logs
Stores email delivery tracking and logs.

```sql
CREATE TABLE email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  type VARCHAR(50) NOT NULL, -- 'confirmation', 'receipt', 'shipped', 'delivered'
  recipient VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  provider VARCHAR(50) NOT NULL, -- 'ses', 'sendgrid'
  provider_message_id VARCHAR(255),
  status VARCHAR(50) NOT NULL, -- 'sent', 'delivered', 'bounced', 'failed'
  delivered_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_email_logs_order_id ON email_logs(order_id);
CREATE INDEX idx_email_logs_user_id ON email_logs(user_id);
CREATE INDEX idx_email_logs_type ON email_logs(type);
CREATE INDEX idx_email_logs_status ON email_logs(status);
CREATE INDEX idx_email_logs_created_at ON email_logs(created_at);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `order_id`: Reference to order (optional)
- `user_id`: Reference to user (optional)
- `type`: Email type
- `recipient`: Recipient email address
- `subject`: Email subject
- `provider`: Email service provider
- `provider_message_id`: Provider's message ID
- `status`: Delivery status
- `delivered_at`: Delivery timestamp
- `error_message`: Error message if delivery failed
- `created_at`: Log creation timestamp

### Audit Logs
Stores system audit trail for compliance.

```sql
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50) NOT NULL,
  resource_id UUID,
  old_values JSONB,
  new_values JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource_type, resource_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);
```

**Fields:**
- `id`: Unique identifier (UUID)
- `user_id`: Reference to user who performed action
- `action`: Action performed (create, update, delete)
- `resource_type`: Type of resource affected
- `resource_id`: ID of resource affected
- `old_values`: Previous values (JSON)
- `new_values`: New values (JSON)
- `ip_address`: IP address of request
- `user_agent`: User agent string
- `created_at`: Log creation timestamp

---

## Redis Data Structures

### Sessions
Stores user session information.

```redis
# Key format: session:{sessionId}
# TTL: 24 hours
{
  "userId": "uuid",
  "email": "user@example.com",
  "expiresAt": "2025-01-21T12:00:00Z"
}
```

### Shopping Carts
Stores temporary shopping cart data.

```redis
# Key format: cart:{userId}
# TTL: 7 days
{
  "items": [
    {
      "productId": "uuid",
      "quantity": 1,
      "cardConfigId": "uuid"
    }
  ],
  "createdAt": "2025-01-20T12:00:00Z",
  "updatedAt": "2025-01-20T12:00:00Z"
}
```

### Rate Limiting
Stores API rate limit counters.

```redis
# Key format: rate_limit:{endpoint}:{identifier}
# TTL: Based on rate limit window
{
  "count": 5,
  "resetAt": "2025-01-20T12:15:00Z"
}
```

---

## Database Constraints

### Foreign Key Constraints
```sql
-- Ensure referential integrity
ALTER TABLE addresses ADD CONSTRAINT fk_addresses_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE card_configs ADD CONSTRAINT fk_card_configs_order_item_id 
  FOREIGN KEY (order_item_id) REFERENCES order_items(id) ON DELETE CASCADE;

ALTER TABLE orders ADD CONSTRAINT fk_orders_user_id 
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;

ALTER TABLE order_items ADD CONSTRAINT fk_order_items_order_id 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE payments ADD CONSTRAINT fk_payments_order_id 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE shipments ADD CONSTRAINT fk_shipments_order_id 
  FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;
```

### Check Constraints
```sql
-- Ensure valid data
ALTER TABLE order_items ADD CONSTRAINT chk_quantity_positive 
  CHECK (quantity > 0);

ALTER TABLE orders ADD CONSTRAINT chk_total_calculation 
  CHECK (total_usd = subtotal_usd + shipping_usd + tax_usd);

ALTER TABLE tax_rules ADD CONSTRAINT chk_tax_rate_range 
  CHECK (rate_percent >= 0 AND rate_percent <= 100);

ALTER TABLE shipping_rules ADD CONSTRAINT chk_surcharge_positive 
  CHECK (surcharge_usd >= 0);
```

---

## Indexes for Performance

### Composite Indexes
```sql
-- Optimize common query patterns
CREATE INDEX idx_orders_user_status ON orders(user_id, status);
CREATE INDEX idx_orders_email_status ON orders(email, status);
CREATE INDEX idx_card_configs_email_approved ON card_configs(email, approved);
CREATE INDEX idx_payments_order_status ON payments(order_id, status);
```

### Partial Indexes
```sql
-- Index only active records
CREATE INDEX idx_products_active_price ON products(base_price_usd) 
  WHERE active = TRUE;

CREATE INDEX idx_tax_rules_active_country ON tax_rules(country_code, region_code) 
  WHERE active = TRUE;
```

---

## Data Retention & Cleanup

### Retention Policies
```sql
-- Clean up old audit logs (keep 2 years)
DELETE FROM audit_logs WHERE created_at < NOW() - INTERVAL '2 years';

-- Clean up failed email logs (keep 30 days)
DELETE FROM email_logs WHERE status = 'failed' AND created_at < NOW() - INTERVAL '30 days';

-- Clean up unused assets (keep 90 days)
DELETE FROM assets WHERE created_at < NOW() - INTERVAL '90 days' 
  AND id NOT IN (SELECT photo_asset_id FROM card_configs WHERE photo_asset_id IS NOT NULL)
  AND id NOT IN (SELECT bg_asset_id FROM card_configs WHERE bg_asset_id IS NOT NULL)
  AND id NOT IN (SELECT preview_asset_id FROM card_configs WHERE preview_asset_id IS NOT NULL);
```

---

**This data model provides a solid foundation for the Linkist NFC platform!** 🎯 The schema is designed for scalability, performance, and data integrity while maintaining flexibility for future enhancements.
