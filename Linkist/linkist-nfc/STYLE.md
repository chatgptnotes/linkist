# Style Guide 🎨

## Brand Identity

### Logo Usage
- **Header/Emails/Confirmations**: Use horizontal logo for wide spaces
- **Mobile/Tight Areas**: Use stacked logo for narrow spaces
- **Clear Space**: Maintain clear space ≥ width of "L" around logos
- **Dark Surfaces**: Use red mark + white wordmark for contrast

### Typography
- **Headings (H1/H2)**: Inter font family
- **Body Text, Inputs, Buttons**: DM Sans font family
- **Rule**: Maximum two font styles per screen
- **Line Height**: Generous spacing for readability

## Color Palette

### Primary Colors
- **Linkist Red**: Primary CTAs, highlights, badges (Founder Member)
- **Trusty Navy**: Section backgrounds, secondary elements
- **Clear Blue**: Alternative section backgrounds

### Accent Colors
- **Signal Yellow**: Small highlights and attention-grabbing elements
- **Innovative Gold**: Subtle accents and premium features

### Neutral Colors
- **Casual Black**: Primary text on white backgrounds
- **Welcoming White**: Primary background color
- **Soft Gray**: Dividers, borders, and secondary text

### Accessibility
- **Contrast**: Ensure WCAG AA compliance for all color combinations
- **Color Blindness**: Don't rely solely on color to convey information

## Component Design

### Buttons
- **Primary Button**: Red background with white text (hover: -6% luminance)
- **Secondary Button**: Navy outline with navy text
- **Size**: Minimum 44px height for touch targets
- **Focus State**: Red focus ring for accessibility

### Cards & Containers
- **Background**: White with soft shadow
- **Padding**: 16–24px internal spacing
- **Border Radius**: Consistent rounded corners
- **Shadow**: Subtle elevation for depth

### Badges & Status
- **Founder Badge**: Red pill shape with white text
- **Status Indicators**: Color-coded for quick recognition
- **Size**: Appropriate for the context (not too large or small)

## Layout & Grid

### Desktop Layout
- **Grid System**: 12-column layout
- **Gutters**: 4/8 column spacing for visual hierarchy
- **Margins**: Consistent 16px, 24px, 32px spacing
- **Max Width**: 1200px for optimal readability

### Mobile Layout
- **Stacking**: Single column layout on small screens
- **Touch Targets**: Minimum 44px for all interactive elements
- **Spacing**: Reduced margins (8px, 16px, 24px)
- **Navigation**: Collapsible menu for mobile

### Responsive Breakpoints
- **Mobile**: <768px
- **Tablet**: 768px - 1024px
- **Desktop**: >1024px

## Interactive Elements

### Form Inputs
- **Height**: Minimum 44px for accessibility
- **Focus Ring**: Red color to match brand
- **Validation**: Clear error states with helpful messages
- **Placeholders**: Subtle text that doesn't interfere with input

### Hover & Focus States
- **Buttons**: Subtle color changes (-6% luminance)
- **Links**: Underline or color change on hover
- **Focus**: Always visible focus indicators
- **Transitions**: Smooth 150ms transitions

### Loading States
- **Skeletons**: Show content structure while loading
- **Spinners**: Use for short loading times
- **Progress Bars**: For longer operations
- **Placeholders**: Maintain layout during loading

## Motion & Animation

### Micro-interactions
- **Proof Updates**: Subtle fades/slides (<150ms)
- **Form Validation**: Smooth error message appearance
- **Button Clicks**: Subtle scale or color feedback
- **Page Transitions**: Smooth navigation between pages

### Performance
- **60fps**: Target smooth animations
- **Reduced Motion**: Respect user preferences
- **Hardware Acceleration**: Use transform and opacity
- **Debouncing**: Prevent excessive animations

## Accessibility

### Visual Design
- **Color Contrast**: WCAG AA compliance (4.5:1 ratio)
- **Text Size**: Minimum 16px for body text
- **Spacing**: Adequate spacing between elements
- **Focus Indicators**: Clear and visible focus states

### Keyboard Navigation
- **Tab Order**: Logical tab sequence
- **Skip Links**: Allow users to skip to main content
- **Keyboard Shortcuts**: Common actions accessible via keyboard
- **Focus Management**: Proper focus handling in modals

### Screen Readers
- **Alt Text**: Descriptive alt text for images
- **ARIA Labels**: Proper labeling for complex components
- **Semantic HTML**: Use appropriate HTML elements
- **Landmarks**: Clear page structure and navigation

## File Naming & Organization

### Component Files
- **Naming**: PascalCase for components (e.g., `ConfigForm.tsx`)
- **Organization**: Group by feature or domain
- **Index Files**: Export components from index files
- **Types**: Co-locate types with components

### Asset Files
- **Images**: Descriptive names (e.g., `hero-nfc-cards.jpg`)
- **Icons**: Semantic names (e.g., `icon-check.svg`)
- **Logos**: Brand-specific names (e.g., `logo-horizontal.svg`)
- **Organization**: Group by type and purpose

---

**Remember**: Good design is invisible! 🎯 Users should focus on their goals, not on the interface. Keep it simple, accessible, and beautiful.
