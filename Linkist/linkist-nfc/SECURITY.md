# Security & Privacy 🛡️

## Overview

This document outlines the security measures and privacy practices implemented in the Linkist NFC platform. Security is built into every layer of the system to protect user data and maintain compliance with regulations.

### Security Principles
- **Defense in Depth**: Multiple layers of security controls
- **Least Privilege**: Minimal access required for functionality
- **Zero Trust**: Verify every request and connection
- **Privacy by Design**: Data protection built into architecture
- **Regular Audits**: Continuous security assessment and improvement

---

## Application Security

### Authentication & Authorization

#### JWT Token Security
```typescript
// JWT configuration
const jwtConfig = {
  secret: process.env.JWT_SECRET,
  expiresIn: '24h',
  algorithm: 'HS256',
  issuer: 'linkist.ai',
  audience: 'linkist-nfc-users',
};

// Token validation middleware
export function validateToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!, jwtConfig) as JwtPayload;
  } catch (error) {
    throw new AuthenticationError('Invalid or expired token');
  }
}
```

#### Role-Based Access Control (RBAC)
```typescript
// User roles and permissions
enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
  OPERATIONS = 'operations',
}

enum Permission {
  READ_ORDERS = 'read:orders',
  WRITE_ORDERS = 'write:orders',
  MANAGE_USERS = 'manage:users',
  VIEW_ANALYTICS = 'view:analytics',
}

// Permission checking middleware
export function requirePermission(permission: Permission) {
  return (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user.permissions.includes(permission)) {
      throw new AuthorizationError('Insufficient permissions');
    }
    next();
  };
}
```

#### Session Management
```typescript
// Session configuration
const sessionConfig = {
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: 'strict',
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
  },
  store: new RedisStore({
    client: redisClient,
    prefix: 'sess:',
    ttl: 24 * 60 * 60, // 24 hours
  }),
};
```

### Input Validation & Sanitization

#### Request Validation
```typescript
// Zod schemas for input validation
import { z } from 'zod';

const orderSchema = z.object({
  email: z.string().email('Invalid email format'),
  items: z.array(z.object({
    productId: z.string().uuid('Invalid product ID'),
    quantity: z.number().int().positive('Quantity must be positive'),
    cardConfigId: z.string().uuid('Invalid config ID'),
  })).min(1, 'At least one item required'),
  address: addressSchema,
});

// Validation middleware
export function validateRequest(schema: z.ZodSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const validatedData = schema.parse(req.body);
      req.validatedData = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError('Invalid request data', error.errors);
      }
      throw error;
    }
  };
}
```

#### SQL Injection Prevention
```typescript
// Use parameterized queries with Prisma
export async function getOrderById(orderId: string) {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      items: true,
      user: true,
    },
  });
}

// Never use string concatenation for SQL
// ❌ WRONG - Vulnerable to SQL injection
const query = `SELECT * FROM orders WHERE id = '${orderId}'`;

// ✅ CORRECT - Use parameterized queries
const query = 'SELECT * FROM orders WHERE id = $1';
```

#### XSS Prevention
```typescript
// Sanitize user input
import DOMPurify from 'dompurify';

export function sanitizeHtml(input: string): string {
  return DOMPurify.sanitize(input, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
}

// Content Security Policy headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
}));
```

### Rate Limiting & DDoS Protection

#### API Rate Limiting
```typescript
// Rate limiting configuration
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: 'Too many authentication attempts',
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req, res) => {
    res.status(429).json({
      error: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later',
      retryAfter: Math.ceil(req.rateLimit.resetTime / 1000),
    });
  },
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // 10 uploads per hour
  message: 'Too many file uploads',
});

// Apply rate limiters
app.use('/api/auth', authLimiter);
app.use('/api/assets/upload', uploadLimiter);
```

#### DDoS Protection
```typescript
// Basic DDoS protection
import slowDown from 'express-slow-down';

const speedLimiter = slowDown({
  windowMs: 15 * 60 * 1000, // 15 minutes
  delayAfter: 100, // Allow 100 requests per 15 minutes
  delayMs: 500, // Add 500ms delay per request after limit
});

app.use(speedLimiter);

// IP-based blocking for suspicious activity
const suspiciousIPs = new Set<string>();

app.use((req, res, next) => {
  const clientIP = req.ip;
  if (suspiciousIPs.has(clientIP)) {
    return res.status(403).json({
      error: 'ACCESS_DENIED',
      message: 'Access denied due to suspicious activity',
    });
  }
  next();
});
```

---

## Data Protection

### Encryption

#### Data at Rest
```typescript
// Database encryption
const databaseConfig = {
  ssl: {
    rejectUnauthorized: false,
    ca: fs.readFileSync('/path/to/ca-certificate.crt'),
    key: fs.readFileSync('/path/to/client-key.pem'),
    cert: fs.readFileSync('/path/to/client-certificate.crt'),
  },
};

// File encryption for sensitive uploads
import crypto from 'crypto';

export function encryptFile(buffer: Buffer): { encrypted: Buffer; iv: Buffer } {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipher('aes-256-gcm', process.env.ENCRYPTION_KEY!);
  
  let encrypted = cipher.update(buffer);
  encrypted = Buffer.concat([encrypted, cipher.final()]);
  
  return { encrypted, iv };
}

export function decryptFile(encrypted: Buffer, iv: Buffer): Buffer {
  const decipher = crypto.createDecipher('aes-256-gcm', process.env.ENCRYPTION_KEY!);
  decipher.setAuthTag(iv);
  
  let decrypted = decipher.update(encrypted);
  decrypted = Buffer.concat([decrypted, decipher.final()]);
  
  return decrypted;
}
```

#### Data in Transit
```typescript
// HTTPS enforcement
app.use((req, res, next) => {
  if (process.env.NODE_ENV === 'production' && !req.secure) {
    return res.redirect(`https://${req.headers.host}${req.url}`);
  }
  next();
});

// Security headers
app.use(helmet({
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true,
  },
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      upgradeInsecureRequests: true,
    },
  },
}));
```

### Data Minimization

#### PII Handling
```typescript
// Only collect necessary data
interface UserRegistration {
  email: string; // Required for account
  firstName?: string; // Optional
  lastName?: string; // Optional
  phone?: string; // Optional for delivery
}

// Anonymize data for analytics
export function anonymizeUserData(userData: any) {
  return {
    id: hash(userData.id),
    region: userData.country,
    orderCount: userData.orderCount,
    totalSpent: userData.totalSpent,
    // No personal identifiers
  };
}
```

#### Data Retention
```typescript
// Data retention policies
const retentionPolicies = {
  userAccounts: '7 years', // Legal requirement
  orderData: '7 years', // Tax and legal
  paymentRecords: '7 years', // Financial compliance
  uploadedFiles: '90 days', // Temporary storage
  auditLogs: '2 years', // Security compliance
  emailLogs: '30 days', // Delivery tracking
};

// Automatic data cleanup
export async function cleanupExpiredData() {
  const now = new Date();
  
  // Clean up old assets
  await prisma.asset.deleteMany({
    where: {
      createdAt: {
        lt: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000),
      },
      // Only delete unused assets
      cardConfigs: {
        none: {},
      },
    },
  });
  
  // Clean up old audit logs
  await prisma.auditLog.deleteMany({
    where: {
      created_at: {
        lt: new Date(now.getTime() - 2 * 365 * 24 * 60 * 60 * 1000),
      },
    },
  });
}
```

---

## Privacy & Compliance

### GDPR Compliance

#### Data Subject Rights
```typescript
// Data export endpoint
app.get('/api/gdpr/export/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  
  // Verify user can only export their own data
  if (req.user.id !== userId && req.user.role !== UserRole.ADMIN) {
    throw new AuthorizationError('Can only export own data');
  }
  
  const userData = await exportUserData(userId);
  
  res.json({
    success: true,
    data: userData,
    exportedAt: new Date().toISOString(),
  });
});

// Data deletion endpoint
app.delete('/api/gdpr/delete/:userId', requireAuth, async (req, res) => {
  const { userId } = req.params;
  
  // Verify user can only delete their own data
  if (req.user.id !== userId && req.user.role !== UserRole.ADMIN) {
    throw new AuthorizationError('Can only delete own data');
  }
  
  await deleteUserData(userId);
  
  res.json({
    success: true,
    message: 'Data deleted successfully',
    deletedAt: new Date().toISOString(),
  });
});
```

#### Consent Management
```typescript
// Consent tracking
interface ConsentRecord {
  userId: string;
  consentType: 'marketing' | 'analytics' | 'necessary';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  userAgent: string;
}

export async function recordConsent(consent: ConsentRecord) {
  return prisma.consent.create({
    data: consent,
  });
}

// Check consent before processing
export async function checkConsent(userId: string, consentType: string): Promise<boolean> {
  const consent = await prisma.consent.findFirst({
    where: {
      userId,
      consentType,
      granted: true,
    },
    orderBy: {
      timestamp: 'desc',
    },
  });
  
  return !!consent;
}
```

### Privacy Policy & Transparency

#### Cookie Management
```typescript
// Cookie consent banner
const cookieTypes = {
  necessary: ['session', 'csrf'],
  analytics: ['_ga', '_gid', '_gat'],
  marketing: ['_fbp', '_fbc'],
};

export function setCookieConsent(req: Request, res: Response) {
  const { necessary, analytics, marketing } = req.body;
  
  // Always set necessary cookies
  res.cookie('session', req.sessionID, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  });
  
  // Set optional cookies based on consent
  if (analytics) {
    res.cookie('analytics_consent', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000 });
  }
  
  if (marketing) {
    res.cookie('marketing_consent', 'true', { maxAge: 365 * 24 * 60 * 60 * 1000 });
  }
}
```

---

## Infrastructure Security

### Network Security

#### Firewall Configuration
```bash
# AWS Security Group rules
# Inbound rules
- HTTP (80): 0.0.0.0/0 (for redirect to HTTPS)
- HTTPS (443): 0.0.0.0/0
- SSH (22): Your IP only
- Database (5432): Private subnet only
- Redis (6379): Private subnet only

# Outbound rules
- All traffic: 0.0.0.0/0
```

#### VPC Configuration
```bash
# Network architecture
- Public subnets: Load balancers, bastion hosts
- Private subnets: Application servers, databases
- Database subnets: Isolated database instances
- NAT gateways: For private subnet internet access
```

### Container Security

#### Docker Security
```dockerfile
# Use non-root user
FROM node:18-alpine
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Copy application files
COPY --chown=nextjs:nodejs . .

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1
```

#### Kubernetes Security
```yaml
# Security context
securityContext:
  runAsNonRoot: true
  runAsUser: 1001
  runAsGroup: 1001
  fsGroup: 1001
  capabilities:
    drop:
      - ALL
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
```

---

## Security Monitoring

### Logging & Auditing

#### Security Event Logging
```typescript
// Security event logger
interface SecurityEvent {
  type: 'authentication' | 'authorization' | 'data_access' | 'system_change';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  ipAddress: string;
  userAgent: string;
  details: any;
  timestamp: Date;
}

export async function logSecurityEvent(event: SecurityEvent) {
  // Log to database
  await prisma.securityEvent.create({
    data: event,
  });
  
  // Log to external security system
  if (event.severity === 'high' || event.severity === 'critical') {
    await notifySecurityTeam(event);
  }
  
  // Log to SIEM system
  await sendToSIEM(event);
}
```

#### Audit Trail
```typescript
// Database change auditing
export async function auditDatabaseChange(change: {
  table: string;
  operation: 'INSERT' | 'UPDATE' | 'DELETE';
  recordId: string;
  oldValues?: any;
  newValues?: any;
  userId: string;
}) {
  await prisma.auditLog.create({
    data: {
      action: change.operation,
      resourceType: change.table,
      resourceId: change.recordId,
      oldValues: change.oldValues,
      newValues: change.newValues,
      userId: change.userId,
      ipAddress: getClientIP(),
      userAgent: getUserAgent(),
    },
  });
}
```

### Threat Detection

#### Anomaly Detection
```typescript
// Login anomaly detection
export async function detectLoginAnomaly(userId: string, loginData: any) {
  const recentLogins = await getRecentLogins(userId, 24); // Last 24 hours
  const userProfile = await getUserProfile(userId);
  
  // Check for unusual patterns
  const anomalies = [];
  
  // Geographic anomaly
  if (loginData.country !== userProfile.lastKnownCountry) {
    anomalies.push('geographic_anomaly');
  }
  
  // Time anomaly
  if (isUnusualLoginTime(loginData.timestamp, userProfile.loginPattern)) {
    anomalies.push('time_anomaly');
  }
  
  // Device anomaly
  if (loginData.deviceFingerprint !== userProfile.lastKnownDevice) {
    anomalies.push('device_anomaly');
  }
  
  if (anomalies.length > 0) {
    await logSecurityEvent({
      type: 'authentication',
      severity: 'medium',
      userId,
      ipAddress: loginData.ipAddress,
      userAgent: loginData.userAgent,
      details: { anomalies, loginData },
      timestamp: new Date(),
    });
    
    // Require additional verification
    return { requireVerification: true, anomalies };
  }
  
  return { requireVerification: false, anomalies: [] };
}
```

#### Intrusion Detection
```typescript
// Basic intrusion detection
export function detectIntrusion(req: Request): boolean {
  const suspiciousPatterns = [
    /<script/i, // XSS attempts
    /union.*select/i, // SQL injection
    /\.\.\//, // Path traversal
    /eval\(/i, // Code injection
  ];
  
  const requestString = JSON.stringify({
    url: req.url,
    body: req.body,
    headers: req.headers,
  });
  
  return suspiciousPatterns.some(pattern => pattern.test(requestString));
}

// Apply intrusion detection middleware
app.use((req, res, next) => {
  if (detectIntrusion(req)) {
    await logSecurityEvent({
      type: 'system_change',
      severity: 'high',
      ipAddress: req.ip,
      userAgent: req.get('User-Agent') || '',
      details: { request: req.url, pattern: 'suspicious_request' },
      timestamp: new Date(),
    });
    
    return res.status(403).json({
      error: 'ACCESS_DENIED',
      message: 'Request blocked for security reasons',
    });
  }
  next();
});
```

---

## Incident Response

### Security Incident Procedures

#### Incident Classification
```typescript
enum IncidentSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

enum IncidentType {
  DATA_BREACH = 'data_breach',
  UNAUTHORIZED_ACCESS = 'unauthorized_access',
  MALWARE = 'malware',
  DOS_ATTACK = 'dos_attack',
  PHISHING = 'phishing',
}
```

#### Response Playbook
```typescript
// Incident response workflow
export async function handleSecurityIncident(incident: SecurityIncident) {
  // 1. Immediate containment
  await containIncident(incident);
  
  // 2. Assessment and classification
  const severity = assessIncidentSeverity(incident);
  
  // 3. Notification
  if (severity === IncidentSeverity.HIGH || severity === IncidentSeverity.CRITICAL) {
    await notifySecurityTeam(incident);
    await notifyManagement(incident);
    
    if (incident.type === IncidentType.DATA_BREACH) {
      await notifyDataProtectionOfficer(incident);
    }
  }
  
  // 4. Investigation
  const investigation = await investigateIncident(incident);
  
  // 5. Remediation
  await remediateIncident(incident, investigation);
  
  // 6. Documentation and lessons learned
  await documentIncident(incident, investigation);
}
```

### Data Breach Response

#### Breach Notification
```typescript
// GDPR breach notification (within 72 hours)
export async function notifyDataBreach(breach: DataBreach) {
  // Notify supervisory authority
  await notifySupervisoryAuthority({
    nature: breach.nature,
    categories: breach.dataCategories,
    approximateNumber: breach.affectedRecords,
    consequences: breach.consequences,
    measures: breach.remedialMeasures,
    contactDetails: breach.contactDetails,
  });
  
  // Notify affected users if high risk
  if (breach.riskToRights === 'high') {
    await notifyAffectedUsers(breach);
  }
  
  // Update breach log
  await updateBreachLog(breach);
}
```

---

## Security Testing

### Automated Security Testing

#### SAST (Static Application Security Testing)
```bash
# Run security scans
npm run security:scan

# Check for vulnerabilities in dependencies
npm audit

# Run OWASP ZAP security tests
npm run security:zap

# Run SonarQube security analysis
npm run security:sonar
```

#### DAST (Dynamic Application Security Testing)
```typescript
// Security test configuration
const securityTests = {
  sqlInjection: {
    payloads: ["' OR 1=1--", "'; DROP TABLE users--"],
    endpoints: ['/api/orders', '/api/users'],
  },
  xss: {
    payloads: ['<script>alert("XSS")</script>', 'javascript:alert("XSS")'],
    endpoints: ['/api/feedback', '/api/comments'],
  },
  csrf: {
    endpoints: ['/api/orders', '/api/profile'],
    methods: ['POST', 'PUT', 'DELETE'],
  },
};

// Run security tests
export async function runSecurityTests() {
  const results = [];
  
  for (const [testType, config] of Object.entries(securityTests)) {
    const result = await runSecurityTest(testType, config);
    results.push(result);
  }
  
  return results;
}
```

### Penetration Testing

#### Penetration Test Schedule
```bash
# Annual penetration testing schedule
- Q1: External network penetration test
- Q2: Web application penetration test
- Q3: Social engineering assessment
- Q4: Red team exercise
```

#### Bug Bounty Program
```typescript
// Bug bounty configuration
const bugBountyProgram = {
  scope: ['*.linkist.ai'],
  exclusions: ['staging.*', 'dev.*'],
  rewards: {
    critical: '$1000-$5000',
    high: '$500-$1000',
    medium: '$100-$500',
    low: '$25-$100',
  },
  responsibleDisclosure: {
    timeline: '90 days',
    contact: 'security@linkist.ai',
    encryption: 'PGP key available',
  },
};
```

---

## Compliance & Certifications

### Security Standards

#### ISO 27001 Compliance
```typescript
// Information Security Management System
const ismsControls = {
  accessControl: {
    userAccessManagement: true,
    accessRights: true,
    passwordManagement: true,
  },
  cryptography: {
    encryptionPolicies: true,
    keyManagement: true,
  },
  operations: {
    operationalProcedures: true,
    malwareProtection: true,
    backup: true,
  },
  communications: {
    networkSecurity: true,
    informationTransfer: true,
  },
};
```

#### SOC 2 Type II
```typescript
// SOC 2 control framework
const soc2Controls = {
  CC1: 'Control Environment',
  CC2: 'Communication and Information',
  CC3: 'Risk Assessment',
  CC4: 'Monitoring Activities',
  CC5: 'Control Activities',
  CC6: 'Logical and Physical Access Controls',
  CC7: 'System Operations',
  CC8: 'Change Management',
  CC9: 'Risk Mitigation',
};
```

### Regular Assessments

#### Security Assessment Schedule
```bash
# Monthly security reviews
- Week 1: Vulnerability assessment
- Week 2: Access review
- Week 3: Security metrics review
- Week 4: Incident response review

# Quarterly assessments
- Q1: Penetration testing
- Q2: Security architecture review
- Q3: Compliance audit
- Q4: Risk assessment
```

---

## Security Training

### Team Security Awareness

#### Security Training Program
```typescript
// Security training requirements
const securityTraining = {
  newHire: {
    duration: '2 hours',
    topics: ['Security policies', 'Data handling', 'Incident reporting'],
    completionRequired: true,
  },
  annual: {
    duration: '4 hours',
    topics: ['Threat landscape', 'Social engineering', 'Secure coding'],
    completionRequired: true,
  },
  roleBased: {
    developers: ['Secure coding practices', 'Code review', 'Dependency management'],
    operations: ['Infrastructure security', 'Access management', 'Monitoring'],
    management: ['Risk management', 'Compliance', 'Incident response'],
  },
};
```

#### Phishing Awareness
```typescript
// Phishing simulation program
const phishingSimulation = {
  frequency: 'monthly',
  targets: 'all employees',
  scenarios: [
    'Urgent password reset',
    'Invoice payment request',
    'CEO email request',
    'Package delivery notification',
  ],
  metrics: [
    'Click rate',
    'Report rate',
    'Training completion',
    'Improvement over time',
  ],
};
```

---

**Security is everyone's responsibility!** 🎯 Regular training, testing, and monitoring ensure the Linkist NFC platform remains secure and compliant with industry standards.

