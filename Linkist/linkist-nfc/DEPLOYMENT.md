# Deployment Guide 🚀

## Overview

This document outlines the deployment process for the Linkist NFC platform. It covers CI/CD pipelines, infrastructure deployment, and release management across different environments.

### Deployment Strategy
- **Blue-Green Deployment**: Zero-downtime deployments with instant rollback
- **Infrastructure as Code**: Terraform for infrastructure management
- **Automated Testing**: Comprehensive testing before deployment
- **Environment Parity**: Staging mirrors production configuration

---

## CI/CD Pipeline

### GitHub Actions Workflow

#### Main Workflow
```yaml
# .github/workflows/main.yml
name: Main CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # Quality Checks
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linting
        run: npm run lint
      
      - name: Run type checking
        run: npm run type-check
      
      - name: Run tests
        run: npm run test:ci
      
      - name: Run security scan
        run: npm run security:scan

  # Build and Test
  build:
    needs: quality
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build application
        run: npm run build
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Build Docker image
        run: |
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }} .
          docker build -t ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest .
      
      - name: Push Docker image
        if: github.ref == 'refs/heads/main'
        run: |
          echo ${{ secrets.GITHUB_TOKEN }} | docker login ${{ env.REGISTRY }} -u ${{ github.actor }} --password-stdin
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:${{ github.sha }}
          docker push ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}:latest

  # Deploy to Staging
  deploy-staging:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/develop'
    environment: staging
    steps:
      - name: Deploy to staging
        run: |
          echo "Deploying to staging..."
          # Deploy to staging environment
          npm run deploy:staging

  # Deploy to Production
  deploy-production:
    needs: build
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    environment: production
    steps:
      - name: Deploy to production
        run: |
          echo "Deploying to production..."
          # Deploy to production environment
          npm run deploy:production
```

#### Pull Request Workflow
```yaml
# .github/workflows/pr.yml
name: Pull Request Checks

on:
  pull_request:
    branches: [main, develop]

jobs:
  pr-checks:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run quality checks
        run: |
          npm run lint
          npm run type-check
          npm run test
          npm run security:scan
      
      - name: Build check
        run: npm run build
      
      - name: Comment PR
        uses: actions/github-script@v7
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '✅ All checks passed! This PR is ready for review.'
            })
```

### Deployment Scripts

#### Package.json Scripts
```json
{
  "scripts": {
    "deploy:staging": "npm run deploy -- --env=staging",
    "deploy:production": "npm run deploy -- --env=production",
    "deploy": "node scripts/deploy.js",
    "deploy:rollback": "node scripts/rollback.js",
    "deploy:status": "node scripts/status.js"
  }
}
```

#### Deployment Script
```javascript
// scripts/deploy.js
#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');

const args = process.argv.slice(2);
const env = args.find(arg => arg.startsWith('--env='))?.split('=')[1] || 'staging';

console.log(`🚀 Deploying to ${env} environment...`);

try {
  // Validate environment
  if (!['staging', 'production'].includes(env)) {
    throw new Error(`Invalid environment: ${env}`);
  }

  // Run pre-deployment checks
  console.log('📋 Running pre-deployment checks...');
  execSync('npm run test:ci', { stdio: 'inherit' });
  execSync('npm run build', { stdio: 'inherit' });

  // Deploy infrastructure
  console.log('🏗️  Deploying infrastructure...');
  execSync(`cd infrastructure && terraform workspace select ${env}`, { stdio: 'inherit' });
  execSync('cd infrastructure && terraform apply -auto-approve', { stdio: 'inherit' });

  // Deploy application
  console.log('📦 Deploying application...');
  if (env === 'production') {
    execSync('kubectl apply -f k8s/production/', { stdio: 'inherit' });
  } else {
    execSync('kubectl apply -f k8s/staging/', { stdio: 'inherit' });
  }

  // Run health checks
  console.log('🏥 Running health checks...');
  execSync('npm run health:check', { stdio: 'inherit' });

  console.log(`✅ Successfully deployed to ${env}!`);

} catch (error) {
  console.error(`❌ Deployment to ${env} failed:`, error.message);
  process.exit(1);
}
```

---

## Infrastructure as Code

### Terraform Configuration

#### Main Configuration
```hcl
# infrastructure/main.tf
terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

provider "kubernetes" {
  config_path = "~/.kube/config"
}

# VPC and Networking
module "vpc" {
  source = "./modules/vpc"
  
  environment = var.environment
  vpc_cidr   = var.vpc_cidr
  azs        = var.availability_zones
}

# Database
module "database" {
  source = "./modules/database"
  
  environment     = var.environment
  vpc_id         = module.vpc.vpc_id
  subnet_ids     = module.vpc.private_subnet_ids
  instance_class = var.database_instance_class
}

# Application Load Balancer
module "alb" {
  source = "./modules/alb"
  
  environment = var.environment
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.public_subnet_ids
}

# EKS Cluster
module "eks" {
  source = "./modules/eks"
  
  environment = var.environment
  vpc_id     = module.vpc.vpc_id
  subnet_ids = module.vpc.private_subnet_ids
}
```

#### Environment Variables
```hcl
# infrastructure/variables.tf
variable "environment" {
  description = "Environment name"
  type        = string
  validation {
    condition     = contains(["staging", "production"], var.environment)
    error_message = "Environment must be either 'staging' or 'production'."
  }
}

variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "vpc_cidr" {
  description = "VPC CIDR block"
  type        = string
  default     = "10.0.0.0/16"
}

variable "availability_zones" {
  description = "Availability zones"
  type        = list(string)
  default     = ["us-east-1a", "us-east-1b", "us-east-1c"]
}

variable "database_instance_class" {
  description = "Database instance class"
  type        = string
  default     = "db.t3.micro"
}
```

#### Environment-Specific Configuration
```hcl
# infrastructure/environments/staging/main.tf
module "linkist_nfc" {
  source = "../../"
  
  environment              = "staging"
  aws_region             = "us-east-1"
  database_instance_class = "db.t3.small"
  vpc_cidr               = "10.1.0.0/16"
  
  # Staging-specific settings
  enable_monitoring      = true
  enable_logging         = true
  enable_backups         = true
  
  # Scaling
  min_capacity          = 1
  max_capacity          = 3
  desired_capacity      = 1
}

# infrastructure/environments/production/main.tf
module "linkist_nfc" {
  source = "../../"
  
  environment              = "production"
  aws_region             = "us-east-1"
  database_instance_class = "db.r6g.large"
  vpc_cidr               = "10.0.0.0/16"
  
  # Production-specific settings
  enable_monitoring      = true
  enable_logging         = true
  enable_backups         = true
  
  # Scaling
  min_capacity          = 2
  max_capacity          = 10
  desired_capacity      = 3
}
```

### Kubernetes Manifests

#### Production Deployment
```yaml
# k8s/production/deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: linkist-nfc
  namespace: production
  labels:
    app: linkist-nfc
    environment: production
spec:
  replicas: 3
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  selector:
    matchLabels:
      app: linkist-nfc
  template:
    metadata:
      labels:
        app: linkist-nfc
        environment: production
    spec:
      containers:
      - name: linkist-nfc
        image: ghcr.io/linkist/linkist-nfc:latest
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: linkist-nfc-secrets
              key: database-url
        - name: REDIS_URL
          valueFrom:
            secretKeyRef:
              name: linkist-nfc-secrets
              key: redis-url
        resources:
          requests:
            memory: "512Mi"
            cpu: "250m"
          limits:
            memory: "1Gi"
            cpu: "500m"
        livenessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /api/health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
```

#### Service Configuration
```yaml
# k8s/production/service.yaml
apiVersion: v1
kind: Service
metadata:
  name: linkist-nfc-service
  namespace: production
spec:
  selector:
    app: linkist-nfc
  ports:
  - protocol: TCP
    port: 80
    targetPort: 3000
  type: ClusterIP
```

#### Ingress Configuration
```yaml
# k8s/production/ingress.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: linkist-nfc-ingress
  namespace: production
  annotations:
    kubernetes.io/ingress.class: "alb"
    alb.ingress.kubernetes.io/scheme: "internet-facing"
    alb.ingress.kubernetes.io/target-type: "ip"
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
    alb.ingress.kubernetes.io/certificate-arn: "arn:aws:acm:us-east-1:123456789012:certificate/cert-id"
    alb.ingress.kubernetes.io/ssl-redirect: "443"
spec:
  rules:
  - host: linkist.ai
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: linkist-nfc-service
            port:
              number: 80
```

---

## Environment Management

### Environment Configuration

#### Environment Variables
```bash
# .env.staging
NODE_ENV=staging
DATABASE_URL=postgresql://user:password@staging-db.linkist.ai:5432/linkist_nfc_staging
REDIS_URL=redis://staging-redis.linkist.ai:6379
S3_BUCKET=linkist-nfc-staging
STRIPE_SECRET_KEY=sk_test_...
SES_REGION=us-east-1
APP_BASE_URL=https://staging.linkist.ai

# .env.production
NODE_ENV=production
DATABASE_URL=postgresql://user:password@prod-db.linkist.ai:5432/linkist_nfc_prod
REDIS_URL=redis://prod-redis.linkist.ai:6379
S3_BUCKET=linkist-nfc-prod
STRIPE_SECRET_KEY=sk_live_...
SES_REGION=us-east-1
APP_BASE_URL=https://linkist.ai
```

#### Feature Flags
```typescript
// config/features.ts
export const featureFlags = {
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

### Database Migrations

#### Migration Management
```bash
# Create migration
npm run db:migrate:create --name="add_user_consent_table"

# Run migrations
npm run db:migrate:staging
npm run db:migrate:production

# Rollback migration
npm run db:migrate:rollback --version="20250120000000"

# Check migration status
npm run db:migrate:status
```

#### Migration Scripts
```json
{
  "scripts": {
    "db:migrate:staging": "NODE_ENV=staging npm run db:migrate",
    "db:migrate:production": "NODE_ENV=production npm run db:migrate",
    "db:migrate:create": "prisma migrate dev --create-only",
    "db:migrate:status": "prisma migrate status",
    "db:migrate:rollback": "prisma migrate reset"
  }
}
```

---

## Release Management

### Release Process

#### Release Checklist
```bash
# Pre-release
- [ ] All tests passing
- [ ] Security scan clean
- [ ] Performance benchmarks met
- [ ] Documentation updated
- [ ] Stakeholder approval

# Release
- [ ] Create release tag
- [ ] Deploy to staging
- [ ] Run smoke tests
- [ ] Deploy to production
- [ ] Verify deployment
- [ ] Monitor metrics

# Post-release
- [ ] Update release notes
- [ ] Notify stakeholders
- [ ] Monitor for issues
- [ ] Gather feedback
```

#### Release Scripts
```bash
#!/bin/bash
# scripts/release.sh

set -e

VERSION=$1
ENVIRONMENT=$2

if [ -z "$VERSION" ] || [ -z "$ENVIRONMENT" ]; then
  echo "Usage: ./release.sh <version> <staging|production>"
  exit 1
fi

echo "🚀 Releasing version $VERSION to $ENVIRONMENT..."

# Create release tag
git tag -a "v$VERSION" -m "Release version $VERSION"
git push origin "v$VERSION"

# Deploy to environment
if [ "$ENVIRONMENT" = "staging" ]; then
  npm run deploy:staging
elif [ "$ENVIRONMENT" = "production" ]; then
  npm run deploy:production
else
  echo "Invalid environment: $ENVIRONMENT"
  exit 1
fi

echo "✅ Successfully released version $VERSION to $ENVIRONMENT!"
```

### Rollback Procedures

#### Automatic Rollback
```yaml
# k8s/production/deployment.yaml
spec:
  strategy:
    type: RollingUpdate
    rollingUpdate:
      maxSurge: 1
      maxUnavailable: 0
  minReadySeconds: 30
  progressDeadlineSeconds: 600
  revisionHistoryLimit: 10
```

#### Manual Rollback
```bash
# Check deployment history
kubectl rollout history deployment/linkist-nfc -n production

# Rollback to previous version
kubectl rollout undo deployment/linkist-nfc -n production

# Rollback to specific version
kubectl rollout undo deployment/linkist-nfc -n production --to-revision=2

# Check rollback status
kubectl rollout status deployment/linkist-nfc -n production
```

---

## Monitoring & Observability

### Health Checks

#### Application Health
```typescript
// app/api/health/route.ts
import { NextResponse } from 'next/server';
import { checkDatabaseConnection } from '@/lib/health/database';
import { checkRedisConnection } from '@/lib/health/redis';
import { checkStorageConnection } from '@/lib/health/storage';

export async function GET() {
  try {
    const checks = await Promise.allSettled([
      checkDatabaseConnection(),
      checkRedisConnection(),
      checkStorageConnection(),
    ]);
    
    const isHealthy = checks.every(check => 
      check.status === 'fulfilled' && check.value
    );
    
    const status = isHealthy ? 200 : 503;
    
    return NextResponse.json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: {
        database: checks[0].status === 'fulfilled' ? checks[0].value : false,
        redis: checks[1].status === 'fulfilled' ? checks[1].value : false,
        storage: checks[2].status === 'fulfilled' ? checks[2].value : false,
      },
    }, { status });
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
}
```

#### Kubernetes Health
```yaml
# k8s/production/deployment.yaml
livenessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 30
  periodSeconds: 10
  timeoutSeconds: 5
  failureThreshold: 3

readinessProbe:
  httpGet:
    path: /api/health
    port: 3000
  initialDelaySeconds: 5
  periodSeconds: 5
  timeoutSeconds: 3
  failureThreshold: 3
```

### Metrics & Logging

#### Prometheus Metrics
```typescript
// lib/metrics.ts
import { register, Counter, Histogram, Gauge } from 'prom-client';

// Request counter
export const httpRequestsTotal = new Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status'],
});

// Request duration
export const httpRequestDuration = new Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration in seconds',
  labelNames: ['method', 'route'],
});

// Active connections
export const activeConnections = new Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
});

// Register metrics
register.registerMetric(httpRequestsTotal);
register.registerMetric(httpRequestDuration);
register.registerMetric(activeConnections);
```

#### Logging Configuration
```typescript
// lib/logger.ts
import winston from 'winston';

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),
  defaultMeta: { service: 'linkist-nfc' },
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

export default logger;
```

---

## Security & Compliance

### Security Scanning

#### Container Security
```yaml
# .github/workflows/security.yml
name: Security Scan

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  security-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Run Trivy vulnerability scanner
        uses: aquasecurity/trivy-action@master
        with:
          image-ref: 'ghcr.io/linkist/linkist-nfc:latest'
          format: 'sarif'
          output: 'trivy-results.sarif'
      
      - name: Upload Trivy scan results
        uses: github/codeql-action/upload-sarif@v2
        with:
          sarif_file: 'trivy-results.sarif'
```

#### Dependency Scanning
```bash
# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# Check for outdated packages
npm outdated

# Update packages
npm update
```

### Compliance Checks

#### Infrastructure Compliance
```hcl
# infrastructure/compliance.tf
# Enable CloudTrail for audit logging
resource "aws_cloudtrail" "main" {
  name                          = "linkist-nfc-trail"
  s3_bucket_name               = aws_s3_bucket.cloudtrail.id
  include_global_service_events = true
  is_multi_region_trail        = true
  
  event_selector {
    read_write_type                 = "All"
    include_management_events       = true
    data_resource {
      type   = "AWS::S3::Object"
      values = ["${aws_s3_bucket.main.arn}/*"]
    }
  }
}

# Enable VPC Flow Logs
resource "aws_flow_log" "main" {
  iam_role_arn    = aws_iam_role.flow_log.arn
  log_destination = aws_cloudwatch_log_group.flow_log.arn
  traffic_type    = "ALL"
  vpc_id          = module.vpc.vpc_id
}
```

---

## Troubleshooting

### Common Deployment Issues

#### Image Pull Errors
```bash
# Check image availability
docker pull ghcr.io/linkist/linkist-nfc:latest

# Verify image exists
docker images | grep linkist-nfc

# Check registry permissions
echo $GITHUB_TOKEN | docker login ghcr.io -u $GITHUB_USERNAME --password-stdin
```

#### Pod Startup Issues
```bash
# Check pod status
kubectl get pods -n production

# Check pod logs
kubectl logs -f deployment/linkist-nfc -n production

# Check pod events
kubectl describe pod <pod-name> -n production

# Check resource limits
kubectl top pods -n production
```

#### Database Connection Issues
```bash
# Check database connectivity
kubectl exec -it <pod-name> -n production -- nc -zv <db-host> 5432

# Check database logs
kubectl logs -f <db-pod-name> -n production

# Verify connection string
kubectl get secret linkist-nfc-secrets -n production -o yaml
```

### Performance Issues

#### High Response Times
```bash
# Check application metrics
kubectl exec -it <pod-name> -n production -- curl localhost:3000/api/health

# Check resource usage
kubectl top pods -n production

# Check database performance
kubectl exec -it <db-pod-name> -n production -- psql -c "SELECT * FROM pg_stat_activity;"
```

#### Memory Issues
```bash
# Check memory usage
kubectl top pods -n production

# Check memory limits
kubectl describe pod <pod-name> -n production

# Check for memory leaks
kubectl exec -it <pod-name> -n production -- free -h
```

---

**Successful deployment requires careful planning and thorough testing!** 🎯 Always test in staging first and have a rollback plan ready for production deployments.

