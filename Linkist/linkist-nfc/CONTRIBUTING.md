# Contributing to Linkist NFC 🚀

Thank you for your interest in contributing to the Linkist NFC project! This document provides guidelines and information for contributors.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Code Standards](#code-standards)
- [Git Workflow](#git-workflow)
- [Pull Request Process](#pull-request-process)
- [Code Review Guidelines](#code-review-guidelines)
- [Testing Requirements](#testing-requirements)
- [Documentation](#documentation)
- [Reporting Issues](#reporting-issues)
- [Feature Requests](#feature-requests)
- [Community Guidelines](#community-guidelines)

---

## Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js** 18.x or higher
- **npm** 9.x or higher
- **Git** 2.30 or higher
- **Docker** (for local development)
- **PostgreSQL** 14 or higher
- **Redis** 6 or higher

### Quick Start

1. **Fork the repository**
   ```bash
   # Fork on GitHub, then clone your fork
   git clone https://github.com/YOUR_USERNAME/linkist-nfc.git
   cd linkist-nfc
   ```

2. **Set up the development environment**
   ```bash
   # Install dependencies
   npm install
   
   # Set up environment variables
   cp .env.example .env.local
   
   # Start development services
   npm run dev:services
   
   # Run the application
   npm run dev
   ```

3. **Verify your setup**
   ```bash
   # Run tests
   npm test
   
   # Run linting
   npm run lint
   
   # Run type checking
   npm run type-check
   ```

---

## Development Setup

### Environment Configuration

Create a `.env.local` file with the following variables:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/linkist_nfc_dev"
REDIS_URL="redis://localhost:6379"

# Storage
S3_BUCKET="linkist-nfc-dev"
S3_REGION="us-east-1"
S3_ACCESS_KEY_ID="your-access-key"
S3_SECRET_ACCESS_KEY="your-secret-key"

# Stripe (Test keys)
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email
SES_REGION="us-east-1"
SES_ACCESS_KEY_ID="your-access-key"
SES_SECRET_ACCESS_KEY="your-secret-key"

# Application
APP_BASE_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### Local Services Setup

#### Using Docker Compose (Recommended)

```bash
# Start all services
npm run dev:services

# Start specific services
npm run dev:db      # PostgreSQL only
npm run dev:redis   # Redis only
npm run dev:storage # MinIO only
```

#### Manual Setup

```bash
# PostgreSQL
brew install postgresql
brew services start postgresql
createdb linkist_nfc_dev

# Redis
brew install redis
brew services start redis

# MinIO (S3-compatible storage)
brew install minio/stable/minio
minio server ~/minio --console-address :9001
```

### Development Commands

```bash
# Development server
npm run dev              # Start Next.js dev server
npm run dev:services     # Start all services
npm run dev:db           # Start database only

# Testing
npm test                 # Run all tests
npm run test:watch       # Run tests in watch mode
npm run test:coverage    # Run tests with coverage
npm run test:e2e         # Run end-to-end tests

# Code Quality
npm run lint             # Run ESLint
npm run lint:fix         # Fix linting issues
npm run type-check       # Run TypeScript checks
npm run format           # Format code with Prettier

# Database
npm run db:migrate       # Run database migrations
npm run db:seed          # Seed database with test data
npm run db:reset         # Reset database

# Building
npm run build            # Build for production
npm run build:analyze    # Analyze bundle size
```

---

## Code Standards

### General Principles

- **Readability**: Write code that's easy to understand and maintain
- **Consistency**: Follow established patterns and conventions
- **Simplicity**: Prefer simple solutions over complex ones
- **Documentation**: Document complex logic and public APIs
- **Testing**: Write tests for new functionality

### Code Style

#### TypeScript/JavaScript

```typescript
// ✅ Good
interface User {
  id: string;
  email: string;
  createdAt: Date;
}

const createUser = async (userData: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const user: User = {
    id: generateId(),
    ...userData,
    createdAt: new Date(),
  };
  
  return await saveUser(user);
};

// ❌ Avoid
const createUser = async (userData: any) => {
  const user = {
    id: generateId(),
    ...userData,
    createdAt: new Date(),
  };
  
  return await saveUser(user);
};
```

#### React Components

```typescript
// ✅ Good
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  onClick?: () => void;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  children,
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md';
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
  };
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]}`}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

// ❌ Avoid
export const Button = (props: any) => {
  return <button {...props} />;
};
```

#### API Routes

```typescript
// ✅ Good
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createOrder } from '@/lib/orders';
import { validateRequest } from '@/lib/validation';

const createOrderSchema = z.object({
  items: z.array(z.object({
    productId: z.string().uuid(),
    quantity: z.number().positive().int(),
  })),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    country: z.string().min(2).max(2),
    postalCode: z.string().min(1),
  }),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = createOrderSchema.parse(body);
    
    const order = await createOrder(validatedData);
    
    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: 'Validation failed', details: error.errors },
        { status: 400 }
      );
    }
    
    console.error('Order creation failed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// ❌ Avoid
export async function POST(request: NextRequest) {
  const body = await request.json();
  const order = await createOrder(body);
  return NextResponse.json(order);
}
```

### File Organization

```
src/
├── app/                    # Next.js App Router pages
│   ├── (marketing)/       # Marketing pages (landing, about)
│   ├── (shop)/           # Shop pages (products, cart, checkout)
│   ├── api/              # API routes
│   └── globals.css       # Global styles
├── components/            # Reusable UI components
│   ├── ui/               # Basic UI components (Button, Input, etc.)
│   ├── forms/            # Form components
│   └── layout/           # Layout components
├── lib/                  # Utility functions and configurations
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database utilities
│   ├── email/            # Email utilities
│   ├── payments/         # Payment utilities
│   └── validation/       # Validation schemas
├── types/                 # TypeScript type definitions
├── hooks/                 # Custom React hooks
├── stores/                # State management (Zustand, etc.)
└── utils/                 # General utility functions
```

### Naming Conventions

- **Files**: kebab-case (`user-profile.tsx`, `order-service.ts`)
- **Components**: PascalCase (`UserProfile`, `OrderService`)
- **Functions**: camelCase (`getUserProfile`, `createOrder`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_FILE_SIZE`, `DEFAULT_TIMEOUT`)
- **Types/Interfaces**: PascalCase (`UserProfile`, `OrderData`)

---

## Git Workflow

### Branch Naming

Use descriptive branch names with prefixes:

```bash
# Feature branches
feat/user-authentication
feat/payment-integration
feat/order-tracking

# Bug fixes
fix/login-validation
fix/payment-decline
fix/email-delivery

# Documentation
docs/api-documentation
docs/user-guide
docs/deployment-guide

# Infrastructure
infra/ci-cd-setup
infra/monitoring
infra/security-updates

# Chores
chore/dependency-updates
chore/code-formatting
chore/test-improvements
```

### Commit Messages

Follow [Conventional Commits](https://www.conventionalcommits.org/) format:

```bash
# Format
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]

# Examples
feat(auth): add two-factor authentication

feat(auth): add two-factor authentication

- Add TOTP-based 2FA support
- Include backup codes generation
- Add 2FA setup flow in user settings

Closes #123

fix(api): resolve order creation timeout

The timeout was caused by missing database indexes.
Added composite index on (user_id, created_at).

fix: resolve order creation timeout

docs: update API documentation

chore: update dependencies

refactor(orders): simplify order status logic

BREAKING CHANGE: Order status enum values have changed
```

### Commit Types

- **feat**: New feature
- **fix**: Bug fix
- **docs**: Documentation changes
- **style**: Code style changes (formatting, etc.)
- **refactor**: Code refactoring
- **test**: Adding or updating tests
- **chore**: Maintenance tasks
- **perf**: Performance improvements
- **ci**: CI/CD changes
- **build**: Build system changes
- **revert**: Revert previous commit

---

## Pull Request Process

### Before Submitting

1. **Ensure your code follows standards**
   ```bash
   npm run lint
   npm run type-check
   npm test
   npm run build
   ```

2. **Update documentation** if needed
3. **Add tests** for new functionality
4. **Test manually** in your local environment

### Pull Request Template

```markdown
## Description

Brief description of what this PR accomplishes.

## Type of Change

- [ ] Bug fix (non-breaking change which fixes an issue)
- [ ] New feature (non-breaking change which adds functionality)
- [ ] Breaking change (fix or feature that would cause existing functionality to not work as expected)
- [ ] Documentation update
- [ ] Performance improvement
- [ ] Refactoring
- [ ] Test update

## Testing

- [ ] Unit tests pass
- [ ] Integration tests pass
- [ ] Manual testing completed
- [ ] Cross-browser testing (if applicable)

## Screenshots

Include screenshots for UI changes:

![Description](screenshot-url)

## Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Code is documented
- [ ] Tests are added/updated
- [ ] Documentation is updated
- [ ] No console.log statements left in code
- [ ] No hardcoded values or secrets

## Related Issues

Closes #123
Related to #456

## Additional Notes

Any additional information that reviewers should know.
```

### Review Process

1. **Automated Checks**: CI/CD pipeline runs automatically
2. **Code Review**: At least one team member must approve
3. **Testing**: All tests must pass
4. **Documentation**: Ensure documentation is updated
5. **Merge**: Once approved, maintainers will merge

---

## Code Review Guidelines

### For Reviewers

- **Be constructive**: Provide helpful feedback
- **Focus on code**: Review the code, not the person
- **Ask questions**: If something isn't clear, ask
- **Suggest alternatives**: Offer better approaches when possible
- **Check for security**: Look for potential security issues
- **Verify tests**: Ensure adequate test coverage

### For Authors

- **Be open to feedback**: Welcome suggestions and improvements
- **Respond to comments**: Address all review feedback
- **Ask questions**: If feedback isn't clear, ask for clarification
- **Update tests**: Add tests for any new functionality
- **Keep commits clean**: Squash commits if requested

### Review Checklist

- [ ] Code follows project standards
- [ ] Functionality is correct
- [ ] Error handling is appropriate
- [ ] Security considerations addressed
- [ ] Performance impact considered
- [ ] Tests are adequate
- [ ] Documentation is updated
- [ ] No debugging code left behind

---

## Testing Requirements

### Test Coverage

- **Unit Tests**: Minimum 80% coverage
- **Integration Tests**: Cover all API endpoints
- **E2E Tests**: Cover critical user flows
- **Accessibility Tests**: Ensure WCAG compliance

### Writing Tests

```typescript
// ✅ Good test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);
    
    fireEvent.click(screen.getByRole('button', { name: 'Click me' }));
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('is disabled when disabled prop is true', () => {
    render(<Button disabled>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeDisabled();
  });
});
```

### Test Naming

```typescript
// ✅ Good test names
describe('UserService', () => {
  describe('createUser', () => {
    it('should create a new user with valid data', () => {});
    it('should throw error when email is invalid', () => {});
    it('should throw error when password is too short', () => {});
  });
});

// ❌ Avoid
describe('UserService', () => {
  describe('createUser', () => {
    it('works', () => {});
    it('fails', () => {});
  });
});
```

---

## Documentation

### Code Documentation

```typescript
/**
 * Creates a new order in the system.
 * 
 * @param orderData - The order data to create
 * @param userId - The ID of the user creating the order
 * @returns Promise resolving to the created order
 * 
 * @throws {ValidationError} When order data is invalid
 * @throws {DatabaseError} When database operation fails
 * 
 * @example
 * ```typescript
 * const order = await createOrder({
 *   items: [{ productId: '123', quantity: 2 }],
 *   shippingAddress: { street: '123 Main St', city: 'Anytown' }
 * }, 'user-123');
 * ```
 */
export async function createOrder(
  orderData: CreateOrderData,
  userId: string
): Promise<Order> {
  // Implementation...
}
```

### README Updates

Update relevant README files when:
- Adding new features
- Changing configuration
- Updating dependencies
- Modifying deployment process

### API Documentation

- Document all API endpoints
- Include request/response examples
- Document error codes and messages
- Keep OpenAPI/Swagger specs updated

---

## Reporting Issues

### Bug Reports

Use the bug report template:

```markdown
## Bug Description

Clear and concise description of the bug.

## Steps to Reproduce

1. Go to '...'
2. Click on '...'
3. Scroll down to '...'
4. See error

## Expected Behavior

What you expected to happen.

## Actual Behavior

What actually happened.

## Environment

- OS: [e.g., macOS 14.0]
- Browser: [e.g., Chrome 120.0]
- Version: [e.g., 1.2.3]

## Additional Context

Any other context, screenshots, or logs.
```

### Security Issues

For security vulnerabilities:
- **DO NOT** create public issues
- Email security@linkist.ai
- Include detailed reproduction steps
- Allow time for investigation and fix

---

## Feature Requests

### Feature Request Template

```markdown
## Feature Description

Clear description of the feature you'd like to see.

## Problem Statement

What problem does this feature solve?

## Proposed Solution

How would you like this feature to work?

## Alternatives Considered

What other solutions have you considered?

## Additional Context

Any other information that might be helpful.
```

### Feature Request Process

1. **Discussion**: Open issue for discussion
2. **Specification**: Define requirements and acceptance criteria
3. **Implementation**: Develop the feature
4. **Testing**: Ensure quality and functionality
5. **Documentation**: Update relevant documentation
6. **Release**: Deploy to production

---

## Community Guidelines

### Code of Conduct

- **Be respectful**: Treat others with kindness and respect
- **Be inclusive**: Welcome contributors from all backgrounds
- **Be constructive**: Provide helpful, constructive feedback
- **Be patient**: Understand that everyone learns at different paces
- **Be professional**: Maintain professional behavior

### Communication

- **GitHub Issues**: For bugs, features, and discussions
- **GitHub Discussions**: For questions and community chat
- **Pull Requests**: For code contributions
- **Email**: For security issues or private matters

### Getting Help

- **Documentation**: Check existing documentation first
- **Issues**: Search existing issues for similar problems
- **Discussions**: Ask questions in GitHub Discussions
- **Team**: Reach out to the development team

---

## Recognition

### Contributors

All contributors are recognized in:
- Project README
- Release notes
- Contributor hall of fame
- Annual acknowledgments

### Contribution Levels

- **Bronze**: 1-5 contributions
- **Silver**: 6-20 contributions
- **Gold**: 21+ contributions
- **Platinum**: Major contributions or long-term involvement

---

## Questions?

If you have questions about contributing:

1. Check this document first
2. Search existing issues and discussions
3. Open a new discussion
4. Contact the development team

**Thank you for contributing to Linkist NFC!** 🎉

Your contributions help make this project better for everyone.

