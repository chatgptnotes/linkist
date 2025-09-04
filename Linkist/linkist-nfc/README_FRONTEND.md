# Frontend Development Guide 🎨

## Technology Stack

### Core Framework
- **Next.js 14+**: App Router with React 18
- **TypeScript**: Full type safety throughout
- **Tailwind CSS**: Utility-first styling framework
- **Zod**: Schema validation for forms and data

### Key Libraries
- **React Hook Form**: Form state management
- **Stripe Elements**: Payment form integration
- **Framer Motion**: Smooth animations and transitions
- **React Query**: Server state management

### Development Tools
- **ESLint**: Code quality and consistency
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality checks
- **Storybook**: Component documentation and testing

## Project Structure

### App Router Structure
```
app/
├── (marketing)/           # Marketing pages (landing, about)
│   └── nfc/
│       └── page.tsx      # Main NFC landing page
├── (shop)/               # E-commerce pages
│   └── nfc/
│       ├── configure/    # Card configuration
│       ├── cart/         # Shopping cart
│       ├── checkout/     # Checkout process
│       └── success/      # Order confirmation
├── account/              # User account pages
│   └── verify/           # Email verification
├── api/                  # API routes
└── globals.css           # Global styles
```

### Component Organization
```
components/
├── ui/                   # Reusable UI components
│   ├── Button.tsx
│   ├── Input.tsx
│   └── Card.tsx
├── forms/                # Form-specific components
│   ├── ConfigForm.tsx
│   ├── AddressForm.tsx
│   └── PaymentForm.tsx
├── layout/               # Layout components
│   ├── Header.tsx
│   ├── Footer.tsx
│   └── Navigation.tsx
└── features/             # Feature-specific components
    ├── ProofPreview.tsx
    ├── CartSummary.tsx
    └── OrderStatus.tsx
```

### Utility Functions
```
lib/
├── utils/                # General utility functions
├── validation/           # Zod schemas
├── api/                  # API client functions
├── hooks/                # Custom React hooks
└── constants/            # App constants and config
```

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager
- Git for version control

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

# Start development server
npm run dev
```

### Environment Variables
```bash
# Frontend Environment Variables
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
NEXT_PUBLIC_API_BASE_URL=http://localhost:3000/api
NEXT_PUBLIC_APP_URL=http://localhost:3000
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

# Run accessibility tests
npm run test:a11y

# Generate coverage report
npm run test:coverage
```

### Building
```bash
# Build for production
npm run build

# Start production server
npm start

# Export static files
npm run export
```

## Component Development

### Creating New Components
```typescript
// components/ui/Button.tsx
import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline'
  size?: 'sm' | 'md' | 'lg'
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
    return (
      <button
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500',
          {
            'bg-red-600 text-white hover:bg-red-700': variant === 'primary',
            'bg-navy-600 text-white hover:bg-navy-700': variant === 'secondary',
            'border border-navy-600 text-navy-600 hover:bg-navy-50': variant === 'outline',
          },
          {
            'h-8 px-3 text-sm': size === 'sm',
            'h-10 px-4 text-base': size === 'md',
            'h-12 px-6 text-lg': size === 'lg',
          },
          className
        )}
        ref={ref}
        {...props}
      />
    )
  }
)

Button.displayName = 'Button'
```

### Using Components
```typescript
// In your page or component
import { Button } from '@/components/ui/Button'

export default function ConfigPage() {
  return (
    <div>
      <Button variant="primary" size="lg">
        Order NFC Card
      </Button>
    </div>
  )
}
```

## Form Handling

### Zod Schemas
```typescript
// lib/validation/configurator.ts
import { z } from 'zod'

export const cardConfigSchema = z.object({
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  title: z.string().min(1, 'Title is required'),
  company: z.string().min(1, 'Company is required'),
  mobile: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Invalid phone number'),
  email: z.string().email('Invalid email address'),
  website: z.string().url('Invalid website URL').optional(),
  socials: z.object({
    linkedin: z.string().url().optional(),
    twitter: z.string().url().optional(),
    instagram: z.string().url().optional(),
  }).optional(),
  photo: z.instanceof(File).optional(),
  background: z.instanceof(File).optional(),
  founderBadge: z.boolean().default(true),
})

export type CardConfig = z.infer<typeof cardConfigSchema>
```

### React Hook Form Integration
```typescript
// components/forms/ConfigForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { cardConfigSchema, type CardConfig } from '@/lib/validation/configurator'

export function ConfigForm() {
  const form = useForm<CardConfig>({
    resolver: zodResolver(cardConfigSchema),
    defaultValues: {
      founderBadge: true,
    },
  })

  const onSubmit = async (data: CardConfig) => {
    try {
      // Handle form submission
      console.log(data)
    } catch (error) {
      console.error('Form submission failed:', error)
    }
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      {/* Form fields */}
    </form>
  )
}
```

## Styling Guidelines

### Tailwind CSS Classes
```typescript
// Use semantic class names
const buttonClasses = {
  primary: 'bg-red-600 text-white hover:bg-red-700',
  secondary: 'bg-navy-600 text-white hover:bg-navy-700',
  outline: 'border border-navy-600 text-navy-600 hover:bg-navy-50',
}

// Responsive design
const containerClasses = 'px-4 md:px-6 lg:px-8'

// Dark mode support
const textClasses = 'text-gray-900 dark:text-gray-100'
```

### CSS Custom Properties
```css
/* globals.css */
:root {
  --color-linkist-red: #dc2626;
  --color-trusty-navy: #1e3a8a;
  --color-clear-blue: #3b82f6;
  --color-signal-yellow: #fbbf24;
  --color-innovative-gold: #f59e0b;
}

/* Use in Tailwind config */
```

## Performance Optimization

### Image Optimization
```typescript
import Image from 'next/image'

// Optimize images automatically
<Image
  src="/hero-image.jpg"
  alt="NFC Cards"
  width={800}
  height={600}
  priority // For above-the-fold images
  placeholder="blur"
  blurDataURL="data:image/jpeg;base64,..."
/>
```

### Code Splitting
```typescript
// Lazy load components
import dynamic from 'next/dynamic'

const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
  loading: () => <div>Loading...</div>,
  ssr: false, // Disable SSR if not needed
})
```

### Bundle Analysis
```bash
# Analyze bundle size
npm run build
npm run analyze
```

## Accessibility

### ARIA Labels
```typescript
// Proper labeling for screen readers
<button
  aria-label="Add item to cart"
  aria-describedby="cart-description"
>
  Add to Cart
</button>
<div id="cart-description">Add this NFC card to your shopping cart</div>
```

### Keyboard Navigation
```typescript
// Ensure keyboard accessibility
const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === 'Enter' || event.key === ' ') {
    event.preventDefault()
    handleClick()
  }
}
```

### Focus Management
```typescript
// Manage focus in modals
useEffect(() => {
  if (isOpen) {
    const focusableElements = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    if (focusableElements?.length) {
      (focusableElements[0] as HTMLElement).focus()
    }
  }
}, [isOpen])
```

## Testing

### Unit Tests
```typescript
// __tests__/components/Button.test.tsx
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
  })

  it('applies variant classes correctly', () => {
    render(<Button variant="primary">Primary</Button>)
    const button = screen.getByRole('button')
    expect(button).toHaveClass('bg-red-600')
  })
})
```

### Integration Tests
```typescript
// __tests__/pages/configurator.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import ConfigPage from '@/app/(shop)/nfc/configure/page'

describe('Configurator Page', () => {
  it('submits form with valid data', async () => {
    render(<ConfigPage />)
    
    fireEvent.change(screen.getByLabelText('First Name'), {
      target: { value: 'John' },
    })
    
    fireEvent.click(screen.getByRole('button', { name: 'Continue' }))
    
    await waitFor(() => {
      expect(screen.getByText('Preview your card')).toBeInTheDocument()
    })
  })
})
```

## Deployment

### Build Optimization
```bash
# Production build
npm run build

# Analyze bundle
npm run analyze

# Start production server
npm start
```

### Environment Configuration
```bash
# Production environment
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
NEXT_PUBLIC_API_BASE_URL=https://api.linkist.ai
NEXT_PUBLIC_APP_URL=https://linkist.ai
```

---

**Happy coding!** 🎯 Remember to keep components small, test thoroughly, and maintain accessibility standards.
