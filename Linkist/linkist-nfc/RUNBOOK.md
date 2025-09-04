# Operations Runbook 🚨

## Overview

This runbook provides operational procedures for the Linkist NFC platform. It covers common issues, emergency procedures, and day-to-day operations to ensure smooth platform operation.

### On-Call Information
- **Primary On-Call**: [Primary Engineer Name] - [Phone Number]
- **Secondary On-Call**: [Secondary Engineer Name] - [Phone Number]
- **Escalation Manager**: [Manager Name] - [Phone Number]
- **Emergency Contact**: [Emergency Contact] - [Phone Number]

### Alert Channels
- **PagerDuty**: [PagerDuty URL]
- **Slack**: #linkist-nfc-alerts
- **Email**: alerts@linkist.ai

---

## Incident Response

### Severity Levels

#### P0 - Critical
- **Description**: Complete service outage, data loss, security breach
- **Response Time**: Immediate (within 5 minutes)
- **Escalation**: Within 15 minutes
- **Examples**: 
  - Database unavailable
  - Payment processing down
  - Security breach detected

#### P1 - High
- **Description**: Major feature unavailable, significant performance degradation
- **Response Time**: Within 15 minutes
- **Escalation**: Within 1 hour
- **Examples**:
  - Order processing slow
  - File uploads failing
  - Email delivery issues

#### P2 - Medium
- **Description**: Minor feature issues, performance degradation
- **Response Time**: Within 1 hour
- **Escalation**: Within 4 hours
- **Examples**:
  - Admin dashboard slow
  - Non-critical API endpoints down
  - Minor UI issues

#### P3 - Low
- **Description**: Cosmetic issues, minor bugs
- **Response Time**: Within 4 hours
- **Escalation**: Within 24 hours
- **Examples**:
  - Typo in error messages
  - Minor styling issues
  - Non-critical feature bugs

### Incident Response Workflow

#### 1. Alert Received
```bash
# Check alert details
- Severity level
- Affected service
- Error message
- Timestamp
- Affected users/customers
```

#### 2. Initial Assessment
```bash
# Quick health check
curl -f https://linkist.ai/api/health

# Check monitoring dashboards
- Database status
- Application metrics
- Error rates
- Response times
```

#### 3. Immediate Actions
```bash
# For P0/P1 incidents
- Acknowledge alert
- Notify team lead
- Start incident call
- Update status page
- Begin investigation
```

#### 4. Investigation
```bash
# Check logs
npm run logs:check

# Check recent deployments
git log --oneline -10

# Check system resources
npm run system:status
```

#### 5. Resolution
```bash
# Apply fix
- Code fix
- Configuration change
- Restart service
- Rollback deployment

# Verify resolution
- Test affected functionality
- Monitor metrics
- Update incident status
```

#### 6. Post-Incident
```bash
# Document incident
- Root cause analysis
- Timeline of events
- Actions taken
- Lessons learned

# Update runbook
- Add new procedures
- Update troubleshooting steps
- Improve monitoring
```

---

## Common Issues & Solutions

### Database Issues

#### Connection Timeout
```bash
# Symptoms
- API requests timing out
- Database connection errors in logs
- High response times

# Investigation
# Check database status
npm run db:status

# Check connection pool
npm run db:pool:status

# Check network connectivity
telnet [db-host] 5432

# Solutions
# Restart application
npm run restart

# Check connection pool settings
# Increase max connections if needed
# Check for connection leaks
```

#### High Query Response Time
```bash
# Symptoms
- Slow page loads
- API timeouts
- Database CPU high

# Investigation
# Check slow query log
npm run db:slow:queries

# Check active queries
npm run db:active:queries

# Check table statistics
npm run db:stats

# Solutions
# Add database indexes
npm run db:index:create

# Optimize slow queries
# Check for N+1 queries
# Add query caching
```

### Payment Processing Issues

#### Stripe Webhook Failures
```bash
# Symptoms
- Orders stuck in "pending" status
- Payment confirmations not received
- Webhook errors in logs

# Investigation
# Check webhook logs
npm run stripe:webhooks:logs

# Check webhook endpoint
curl -X POST https://linkist.ai/api/webhooks/payments

# Verify webhook secret
echo $STRIPE_WEBHOOK_SECRET

# Solutions
# Retry failed webhooks
npm run stripe:webhooks:retry

# Manually process payments
npm run orders:process:payments

# Update webhook configuration if needed
```

#### Payment Declines
```bash
# Symptoms
- High payment failure rate
- Customer complaints about declined cards
- Stripe dashboard showing errors

# Investigation
# Check decline reasons
npm run stripe:declines:check

# Check recent payment attempts
npm run payments:recent

# Verify Stripe configuration
npm run stripe:config:verify

# Solutions
# Update error messages for customers
# Implement 3D Secure if needed
# Check Stripe account status
# Verify card validation rules
```

### File Upload Issues

#### S3 Upload Failures
```bash
# Symptoms
- File uploads failing
- Image previews not loading
- Storage errors in logs

# Investigation
# Check S3 bucket status
npm run s3:status

# Check bucket permissions
npm run s3:permissions:check

# Verify credentials
echo $S3_ACCESS_KEY_ID

# Solutions
# Restart file upload service
npm run uploads:restart

# Check bucket policies
# Verify IAM permissions
# Check storage quota
```

#### File Processing Failures
```bash
# Symptoms
- Image optimization failing
- Proof generation errors
- File conversion issues

# Investigation
# Check processing logs
npm run files:processing:logs

# Check system resources
npm run system:resources

# Verify image processing tools
which convert
which pngquant

# Solutions
# Restart processing service
npm run processing:restart

# Check disk space
df -h

# Verify tool installations
# Check memory usage
```

### Email Delivery Issues

#### SES Delivery Failures
```bash
# Symptoms
- Emails not being sent
- High bounce rates
- Delivery delays

# Investigation
# Check SES status
npm run ses:status

# Check bounce/complaint rates
npm run ses:metrics

# Verify domain configuration
npm run ses:domain:verify

# Solutions
# Check sending limits
# Verify domain reputation
# Update SPF/DKIM records
# Check suppression list
```

#### Email Template Issues
```bash
# Symptoms
- Emails with broken formatting
- Missing content in emails
- Template rendering errors

# Investigation
# Check template logs
npm run email:templates:logs

# Test template rendering
npm run email:templates:test

# Verify template variables
npm run email:variables:check

# Solutions
# Fix template syntax
# Update template variables
# Test with sample data
# Verify email client compatibility
```

---

## System Maintenance

### Daily Operations

#### Health Checks
```bash
# Morning health check
npm run health:check:morning

# Check overnight metrics
npm run metrics:overnight

# Verify backup completion
npm run backup:verify

# Check error rates
npm run errors:check
```

#### Monitoring Review
```bash
# Review alert history
npm run alerts:history

# Check performance metrics
npm run performance:review

# Verify system resources
npm run resources:check

# Update status page
npm run status:update
```

### Weekly Operations

#### Performance Review
```bash
# Analyze response times
npm run performance:analyze

# Check database performance
npm run db:performance:review

# Review error patterns
npm run errors:patterns

# Update performance baselines
npm run performance:baseline:update
```

#### Security Review
```bash
# Check access logs
npm run security:access:review

# Review failed login attempts
npm run security:logins:failed

# Check for suspicious activity
npm run security:suspicious:check

# Update security policies if needed
npm run security:policies:update
```

### Monthly Operations

#### System Updates
```bash
# Update dependencies
npm run deps:update

# Check for security vulnerabilities
npm audit

# Update system packages
npm run system:update

# Review and update runbook
npm run runbook:review
```

#### Capacity Planning
```bash
# Analyze usage trends
npm run capacity:trends

# Check resource utilization
npm run capacity:utilization

# Plan for growth
npm run capacity:plan

# Update scaling policies
npm run scaling:policies:update
```

---

## Emergency Procedures

### Service Outage

#### Complete Platform Down
```bash
# Immediate Actions
1. Acknowledge incident (P0)
2. Start incident call
3. Notify management
4. Update status page
5. Begin investigation

# Investigation Steps
1. Check infrastructure status
2. Verify database connectivity
3. Check application logs
4. Verify deployment status
5. Check external dependencies

# Recovery Steps
1. Identify root cause
2. Apply immediate fix
3. Restart services if needed
4. Verify recovery
5. Monitor stability
```

#### Database Outage
```bash
# Immediate Actions
1. Check database status
2. Verify network connectivity
3. Check connection pool
4. Restart application if needed

# Recovery Steps
1. Restart database service
2. Check for data corruption
3. Verify data integrity
4. Restore from backup if needed
5. Monitor performance
```

#### Payment System Down
```bash
# Immediate Actions
1. Check Stripe status page
2. Verify webhook endpoints
3. Check payment logs
4. Notify operations team

# Recovery Steps
1. Restart payment service
2. Verify webhook configuration
3. Test payment flow
4. Process pending payments
5. Monitor success rates
```

### Security Incidents

#### Data Breach Suspected
```bash
# Immediate Actions
1. Isolate affected systems
2. Preserve evidence
3. Notify security team
4. Begin incident response
5. Document timeline

# Investigation Steps
1. Identify scope of breach
2. Determine data accessed
3. Check access logs
4. Verify system integrity
5. Assess impact

# Recovery Steps
1. Patch vulnerabilities
2. Reset compromised credentials
3. Restore from clean backup
4. Implement additional security
5. Monitor for recurrence
```

#### Unauthorized Access
```bash
# Immediate Actions
1. Block suspicious IPs
2. Revoke compromised tokens
3. Check access logs
4. Notify security team
5. Begin investigation

# Investigation Steps
1. Identify access method
2. Determine scope of access
3. Check for data exfiltration
4. Verify system integrity
5. Assess impact

# Recovery Steps
1. Patch access vectors
2. Implement additional controls
3. Reset affected accounts
4. Monitor for recurrence
5. Update security policies
```

---

## Troubleshooting Tools

### Log Analysis

#### Application Logs
```bash
# View recent logs
npm run logs:recent

# Search logs by error type
npm run logs:search --type=error

# Filter logs by time
npm run logs:filter --start="2025-01-20T10:00:00Z" --end="2025-01-20T11:00:00Z"

# Check specific user activity
npm run logs:user --userId=123
```

#### Database Logs
```bash
# Check slow queries
npm run db:logs:slow

# Check connection logs
npm run db:logs:connections

# Check error logs
npm run db:logs:errors

# Check performance logs
npm run db:logs:performance
```

#### System Logs
```bash
# Check system resources
npm run system:logs:resources

# Check network activity
npm run system:logs:network

# Check security events
npm run system:logs:security

# Check application performance
npm run system:logs:performance
```

### Monitoring Tools

#### Application Metrics
```bash
# Check response times
npm run metrics:response:times

# Check error rates
npm run metrics:error:rates

# Check throughput
npm run metrics:throughput

# Check user activity
npm run metrics:user:activity
```

#### Infrastructure Metrics
```bash
# Check CPU usage
npm run metrics:cpu

# Check memory usage
npm run metrics:memory

# Check disk usage
npm run metrics:disk

# Check network usage
npm run metrics:network
```

#### Business Metrics
```bash
# Check order volume
npm run metrics:orders:volume

# Check conversion rates
npm run metrics:conversion:rates

# Check revenue metrics
npm run metrics:revenue

# Check customer satisfaction
npm run metrics:satisfaction
```

---

## Recovery Procedures

### Database Recovery

#### Point-in-Time Recovery
```bash
# Identify recovery point
npm run db:recovery:point --timestamp="2025-01-20T10:00:00Z"

# Create recovery plan
npm run db:recovery:plan --point="2025-01-20T10:00:00Z"

# Execute recovery
npm run db:recovery:execute --plan="recovery-plan-123"

# Verify recovery
npm run db:recovery:verify --plan="recovery-plan-123"
```

#### Backup Restoration
```bash
# List available backups
npm run backup:list

# Select backup to restore
npm run backup:select --id="backup-123"

# Create restoration plan
npm run backup:restore:plan --id="backup-123"

# Execute restoration
npm run backup:restore:execute --plan="restore-plan-123"

# Verify restoration
npm run backup:restore:verify --plan="restore-plan-123"
```

### Application Recovery

#### Service Restart
```bash
# Restart specific service
npm run service:restart --name="payment-service"

# Restart all services
npm run services:restart:all

# Restart with health check
npm run service:restart:healthy --name="payment-service"

# Restart with rollback
npm run service:restart:rollback --name="payment-service"
```

#### Deployment Rollback
```bash
# List recent deployments
npm run deployment:list

# Identify rollback target
npm run deployment:rollback:target --current="deploy-123"

# Create rollback plan
npm run deployment:rollback:plan --target="deploy-122"

# Execute rollback
npm run deployment:rollback:execute --plan="rollback-plan-123"

# Verify rollback
npm run deployment:rollback:verify --plan="rollback-plan-123"
```

---

## Communication Procedures

### Internal Communication

#### Incident Updates
```bash
# Update team chat
- Incident status
- Current actions
- Expected resolution time
- Next update time

# Update management
- Incident summary
- Business impact
- Technical details
- Recovery timeline
```

#### Status Page Updates
```bash
# Update status page
- Incident description
- Current status
- Expected resolution
- Next update time

# Customer communication
- Clear explanation
- Timeline expectations
- Alternative solutions
- Contact information
```

### External Communication

#### Customer Notifications
```bash
# Email notifications
- Incident description
- Current status
- Expected resolution
- Alternative solutions

# Social media updates
- Brief status updates
- Progress updates
- Resolution confirmation
```

#### Partner Communication
```bash
# Technical partners
- Incident details
- System status
- Expected impact
- Recovery timeline

# Business partners
- Business impact
- Mitigation steps
- Recovery timeline
- Contact information
```

---

## Post-Incident Procedures

### Incident Review

#### Root Cause Analysis
```bash
# Document incident
- Timeline of events
- Actions taken
- Root cause
- Contributing factors

# Update procedures
- Improve monitoring
- Update runbook
- Enhance procedures
- Prevent recurrence
```

#### Lessons Learned
```bash
# Team review
- What went well
- What could improve
- Process improvements
- Tool improvements

# Documentation updates
- Update runbook
- Improve procedures
- Enhance monitoring
- Update training
```

### Process Improvement

#### Monitoring Enhancements
```bash
# Add new alerts
- Early warning indicators
- Performance thresholds
- Business metrics
- User experience metrics

# Improve dashboards
- Better visualization
- More relevant metrics
- Faster access to data
- Mobile optimization
```

#### Procedure Updates
```bash
# Update runbook
- Add new procedures
- Improve existing steps
- Add troubleshooting
- Enhance documentation

# Training updates
- Update team training
- Add new scenarios
- Improve response times
- Enhance skills
```

---

**Remember**: Stay calm, follow procedures, and communicate clearly! 🎯 This runbook is a living document that should be updated based on lessons learned from incidents.

