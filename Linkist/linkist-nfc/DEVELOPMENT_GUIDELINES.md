# Development Guidelines 🛠️

## Architecture & Patterns

### Backend for Frontend (BFF)
- **Domain modules**: Catalog, Configurator, Orders, Payments, Tax/Shipping, Proof, Accounts, Notifications, Admin
- **Clean separation** between API and business logic
- **Single responsibility** for each module

### Payment Service Provider (PSP) Adapter
- **Stripe as primary** provider
- **Adapter pattern** to easily swap/add providers later
- **Webhook handling** for real-time updates

### Serverless Jobs
- **Proof rendering** (Lambda/Cloud Run)
- **Email sending** (background processing)
- **File processing** (image optimization)

## Coding Standards

### Git & Commits
- **Conventional Commits**: `feat:`, `fix:`, `chore:`, `docs:`, `style:`, `refactor:`, `test:`
- **Branch naming**: `feat/feature-name`, `fix/bug-description`, `chore/task-description`
- **PR requirements**: Description + screenshot for UI changes

### Code Quality
- **Lint/format**: ESLint + Prettier
- **Import sorting**: Consistent import order
- **Type safety**: TypeScript everywhere possible
- **Error handling**: Return `problem+json` with trace IDs

### Folder Structure
```
src/
├── domains/           # Business logic by domain
├── shared/           # Common utilities and types
├── infrastructure/   # Database, external services
└── presentation/     # API routes and controllers
```

## Quality Assurance

### Testing Strategy
- **Unit tests**: Business rules and utilities
- **Integration tests**: API endpoints and database
- **E2E tests**: Critical user journeys
- **Accessibility**: pa11y for automated checks

### Error Handling
- **Structured logging**: Include context and trace IDs
- **Graceful degradation**: App continues working when possible
- **User-friendly messages**: Don't expose technical details
- **Monitoring**: Sentry for error tracking

### Performance
- **Database queries**: Optimize and index properly
- **Image optimization**: Compress and resize appropriately
- **Caching**: Redis for sessions and frequently accessed data
- **CDN**: Use for static assets and images

## Security & Privacy

### Authentication & Authorization
- **JWT tokens**: Secure session management
- **Rate limiting**: Prevent abuse on sensitive endpoints
- **CSRF protection**: Cross-site request forgery prevention
- **Input validation**: Sanitize all user inputs

### Data Protection
- **PII minimization**: Only collect what's necessary
- **Encryption**: At rest (database) and in transit (TLS)
- **Access control**: Least privilege principle
- **Audit logging**: Track all data access

### GDPR Compliance
- **Data Subject Rights**: Export and deletion endpoints
- **Consent management**: Clear opt-in/opt-out
- **Retention policies**: Automatic data cleanup
- **Privacy by design**: Built into the architecture

## Observability

### Logging
- **Structured logs**: JSON format with consistent fields
- **Log levels**: ERROR, WARN, INFO, DEBUG
- **Context**: Include user ID, request ID, timestamp
- **Centralized**: Send to log aggregation service

### Monitoring
- **Health checks**: Database, external services
- **Metrics**: Response times, error rates, throughput
- **Alerts**: Set up for critical failures
- **Dashboards**: Real-time system status

### Tracing
- **Request tracing**: Follow requests through the system
- **Performance profiling**: Identify bottlenecks
- **Dependency mapping**: Understand service relationships

## Deployment & DevOps

### Environment Management
- **Multiple environments**: Dev, staging, production
- **Configuration**: Environment-specific settings
- **Secrets**: Use secret manager, never commit to code
- **Feature flags**: Gradual rollout of new features

### CI/CD Pipeline
- **Automated testing**: Run on every commit
- **Code quality**: Lint, format, security scans
- **Deployment**: Automated to staging, manual to production
- **Rollback**: Quick revert capability

### Infrastructure as Code
- **Terraform**: Define all cloud resources
- **Version control**: Track infrastructure changes
- **Documentation**: Keep IaC code self-documenting
- **Testing**: Validate infrastructure changes

---

**Remember**: Good code is readable, maintainable, and secure! 🎯 Write code that your future self (and teammates) will thank you for.

