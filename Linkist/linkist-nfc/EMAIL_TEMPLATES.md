# Email Templates 📧

## Overview

This document defines the email templates for the Linkist NFC platform. All emails are sent via AWS SES and include both HTML and plain text versions for maximum compatibility.

### Email Design Principles
- **Brand Consistency**: Use Linkist colors and logos
- **Mobile First**: Responsive design for all devices
- **Clear CTAs**: Prominent call-to-action buttons
- **Accessibility**: High contrast and readable fonts
- **Personalization**: Dynamic content based on user data

### Template Structure
All email templates follow this structure:
1. **Header**: Linkist logo and navigation
2. **Hero Section**: Main message and visual
3. **Content**: Detailed information and context
4. **CTA Section**: Clear next steps
5. **Footer**: Support information and legal

---

## Order Confirmation Email

### Subject Line
```
Welcome to Linkist — your NFC card order is in!
```

### Preheader Text
```
You're officially a Founder Member. Here's your proof and delivery details.
```

### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Linkist — Your NFC Card Order</title>
    <style>
        /* Base styles */
        body { margin: 0; padding: 0; font-family: 'DM Sans', Arial, sans-serif; }
        .container { max-width: 600px; margin: 0 auto; background: #ffffff; }
        .header { background: #1e3a8a; padding: 20px; text-align: center; }
        .logo { height: 40px; }
        .hero { background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 40px 20px; text-align: center; color: white; }
        .hero h1 { margin: 0; font-size: 28px; font-weight: 600; }
        .hero p { margin: 10px 0 0 0; font-size: 16px; opacity: 0.9; }
        .content { padding: 40px 20px; }
        .section { margin-bottom: 30px; }
        .section h2 { color: #1e3a8a; font-size: 20px; margin-bottom: 15px; }
        .order-summary { background: #f8fafc; border-radius: 8px; padding: 20px; margin: 20px 0; }
        .order-row { display: flex; justify-content: space-between; margin: 10px 0; }
        .founder-badge { background: #dc2626; color: white; padding: 8px 16px; border-radius: 20px; display: inline-block; font-size: 14px; font-weight: 600; }
        .proof-image { max-width: 100%; height: auto; border-radius: 8px; margin: 20px 0; }
        .cta-button { background: #dc2626; color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 600; margin: 20px 0; }
        .footer { background: #f1f5f9; padding: 30px 20px; text-align: center; color: #64748b; }
        .social-links { margin: 20px 0; }
        .social-links a { display: inline-block; margin: 0 10px; }
        @media (max-width: 600px) {
            .hero h1 { font-size: 24px; }
            .content { padding: 20px; }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://linkist.ai/logo-white.png" alt="Linkist" class="logo">
        </div>

        <!-- Hero Section -->
        <div class="hero">
            <h1>Welcome to Linkist! 🎉</h1>
            <p>Your NFC card order is confirmed and you're officially a <span class="founder-badge">Founder Member</span></p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section">
                <h2>Order Details</h2>
                <div class="order-summary">
                    <div class="order-row">
                        <span>Order Number:</span>
                        <strong>{{orderNumber}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Order Date:</span>
                        <strong>{{orderDate}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Expected Delivery:</span>
                        <strong>{{expectedDelivery}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Total Amount:</span>
                        <strong>${{totalAmount}}</strong>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Your Card Preview</h2>
                <p>Here's how your personalized NFC card will look:</p>
                <img src="{{proofImageUrl}}" alt="Your NFC Card Preview" class="proof-image">
                <p><em>This preview shows the front and back of your card. The design is now locked for production.</em></p>
            </div>

            <div class="section">
                <h2>What Happens Next?</h2>
                <ol>
                    <li><strong>Production</strong> - Your card enters production (2-3 days)</li>
                    <li><strong>Programming</strong> - NFC chip is programmed with your details (1-2 days)</li>
                    <li><strong>Shipping</strong> - Card is shipped with tracking information (3-5 days)</li>
                    <li><strong>Delivery</strong> - You'll receive your card at your doorstep!</li>
                </ol>
            </div>

            <div class="section">
                <h2>Founder Member Benefits</h2>
                <p>As one of our first customers, you'll receive:</p>
                <ul>
                    <li>🎯 <strong>One-year app subscription waived</strong> when the Linkist mobile app launches</li>
                    <li>🏆 <strong>Founder badge</strong> displayed in the app</li>
                    <li>💎 <strong>Exclusive early access</strong> to new features</li>
                    <li>🎁 <strong>Special Founder pricing</strong> on future products</li>
                </ul>
            </div>

            <!-- CTA Section -->
            <div class="section" style="text-align: center;">
                <h2>Share Your Excitement!</h2>
                <p>Tell your network about your new NFC card and help them join the Linkist revolution.</p>
                <a href="{{referralLink}}" class="cta-button">Share Linkist with Friends</a>
                <p><small>Earn app credits for every friend who orders!</small></p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <div class="social-links">
                <a href="https://twitter.com/linkist_ai">Twitter</a>
                <a href="https://linkedin.com/company/linkist-ai">LinkedIn</a>
                <a href="https://instagram.com/linkist_ai">Instagram</a>
            </div>
            <p>Questions? Contact us at <a href="mailto:support@linkist.ai">support@linkist.ai</a></p>
            <p><small>© 2025 Linkist. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
```

### Plain Text Version
```
Welcome to Linkist! 🎉

Your NFC card order is confirmed and you're officially a Founder Member!

ORDER DETAILS
=============
Order Number: {{orderNumber}}
Order Date: {{orderDate}}
Expected Delivery: {{expectedDelivery}}
Total Amount: ${{totalAmount}}

YOUR CARD PREVIEW
=================
Your personalized NFC card preview is attached to this email. The design is now locked for production.

WHAT HAPPENS NEXT?
==================
1. Production - Your card enters production (2-3 days)
2. Programming - NFC chip is programmed with your details (1-2 days)
3. Shipping - Card is shipped with tracking information (3-5 days)
4. Delivery - You'll receive your card at your doorstep!

FOUNDER MEMBER BENEFITS
=======================
As one of our first customers, you'll receive:
• One-year app subscription waived when the Linkist mobile app launches
• Founder badge displayed in the app
• Exclusive early access to new features
• Special Founder pricing on future products

SHARE YOUR EXCITEMENT!
======================
Tell your network about your new NFC card and help them join the Linkist revolution.

Share Linkist with Friends: {{referralLink}}
Earn app credits for every friend who orders!

Questions? Contact us at support@linkist.ai

© 2025 Linkist. All rights reserved.
```

---

## Payment Receipt Email

### Subject Line
```
Payment received — Linkist NFC card
```

### Preheader Text
```
Your payment has been processed successfully. Here's your receipt.
```

### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Payment Receipt - Linkist NFC Card</title>
    <style>
        /* Same base styles as confirmation email */
        .receipt-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        .receipt-table th, .receipt-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
        .receipt-table th { background: #f8fafc; font-weight: 600; color: #1e3a8a; }
        .total-row { font-weight: 600; background: #f1f5f9; }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://linkist.ai/logo-white.png" alt="Linkist" class="logo">
        </div>

        <!-- Hero Section -->
        <div class="hero">
            <h1>Payment Confirmed! ✅</h1>
            <p>Your payment has been processed successfully</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section">
                <h2>Payment Receipt</h2>
                <div class="order-summary">
                    <div class="order-row">
                        <span>Transaction ID:</span>
                        <strong>{{transactionId}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Payment Date:</span>
                        <strong>{{paymentDate}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Payment Method:</span>
                        <strong>{{paymentMethod}}</strong>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Order Summary</h2>
                <table class="receipt-table">
                    <thead>
                        <tr>
                            <th>Item</th>
                            <th>Qty</th>
                            <th>Price</th>
                            <th>Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Linkist NFC Card</td>
                            <td>{{quantity}}</td>
                            <td>${{unitPrice}}</td>
                            <td>${{subtotal}}</td>
                        </tr>
                        <tr>
                            <td>Shipping</td>
                            <td>-</td>
                            <td>${{shipping}}</td>
                            <td>${{shipping}}</td>
                        </tr>
                        <tr>
                            <td>Tax</td>
                            <td>-</td>
                            <td>${{tax}}</td>
                            <td>${{tax}}</td>
                        </tr>
                        <tr class="total-row">
                            <td colspan="3"><strong>Total</strong></td>
                            <td><strong>${{totalAmount}}</strong></td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- CTA Section -->
            <div class="section" style="text-align: center;">
                <h2>Download Receipt</h2>
                <p>Need a copy for your records? Download the full receipt below.</p>
                <a href="{{receiptUrl}}" class="cta-button">Download Receipt</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Questions about your payment? Contact us at <a href="mailto:support@linkist.ai">support@linkist.ai</a></p>
            <p><small>© 2025 Linkist. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
```

---

## In Production Email

### Subject Line
```
Your Linkist NFC card is in production
```

### Preheader Text
```
Great news! Your card has entered the production phase.
```

### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>In Production - Linkist NFC Card</title>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://linkist.ai/logo-white.png" alt="Linkist" class="logo">
        </div>

        <!-- Hero Section -->
        <div class="hero">
            <h1>Production Started! 🏭</h1>
            <p>Your NFC card is now being manufactured</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section">
                <h2>What's Happening Now?</h2>
                <p>Your personalized NFC card has entered the production phase. Our team is working hard to bring your vision to life!</p>
                
                <div class="order-summary">
                    <div class="order-row">
                        <span>Order Number:</span>
                        <strong>{{orderNumber}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Current Status:</span>
                        <strong style="color: #dc2626;">In Production</strong>
                    </div>
                    <div class="order-row">
                        <span>Estimated Completion:</span>
                        <strong>{{productionCompletion}}</strong>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Production Process</h2>
                <ol>
                    <li><strong>Printing</strong> - Your card design is printed on premium materials</li>
                    <li><strong>Lamination</strong> - Protective coating is applied for durability</li>
                    <li><strong>Cutting</strong> - Cards are precisely cut to size</li>
                    <li><strong>Quality Check</strong> - Each card is inspected for perfection</li>
                </ol>
            </div>

            <div class="section">
                <h2>Next Steps</h2>
                <p>Once production is complete, your card will move to the programming phase where we'll encode the NFC chip with your contact information.</p>
                <p>We'll send you another update when your card is ready for programming!</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Questions? Contact us at <a href="mailto:support@linkist.ai">support@linkist.ai</a></p>
            <p><small>© 2025 Linkist. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
```

---

## Shipped Email

### Subject Line
```
Shipped! Track your Linkist NFC card
```

### Preheader Text
```
Your NFC card is on its way! Track the delivery here.
```

### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Shipped - Linkist NFC Card</title>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://linkist.ai/logo-white.png" alt="Linkist" class="logo">
        </div>

        <!-- Hero Section -->
        <div class="hero">
            <h1>Your Card is on the Way! 🚚</h1>
            <p>Track your Linkist NFC card delivery</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section">
                <h2>Shipping Information</h2>
                <div class="order-summary">
                    <div class="order-row">
                        <span>Order Number:</span>
                        <strong>{{orderNumber}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Carrier:</span>
                        <strong>{{carrier}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Service:</span>
                        <strong>{{service}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Tracking Number:</span>
                        <strong>{{trackingNumber}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Shipped Date:</span>
                        <strong>{{shippedDate}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Estimated Delivery:</span>
                        <strong>{{estimatedDelivery}}</strong>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>Track Your Package</h2>
                <p>Click the button below to track your delivery in real-time:</p>
                <a href="{{trackingUrl}}" class="cta-button">Track Package</a>
            </div>

            <div class="section">
                <h2>What to Expect</h2>
                <ul>
                    <li>📦 <strong>Package Protection</strong> - Your card is securely packaged</li>
                    <li>📱 <strong>Real-time Updates</strong> - Get delivery notifications</li>
                    <li>🏠 <strong>Safe Delivery</strong> - Signature required for security</li>
                </ul>
            </div>

            <div class="section">
                <h2>Delivery Instructions</h2>
                <p>Please ensure someone is available to receive your package. A signature will be required upon delivery.</p>
                <p>If you're not available, the carrier will leave a delivery notice with instructions for pickup.</p>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Questions about delivery? Contact us at <a href="mailto:support@linkist.ai">support@linkist.ai</a></p>
            <p><small>© 2025 Linkist. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
```

---

## Delivered Email

### Subject Line
```
Delivered — Welcome to the Linkist Founder circle
```

### Preheader Text
```
Your NFC card has been delivered! Time to start sharing.
```

### HTML Template
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Delivered - Linkist NFC Card</title>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <img src="https://linkist.ai/logo-white.png" alt="Linkist" class="logo">
        </div>

        <!-- Hero Section -->
        <div class="hero">
            <h1>Your Card Has Arrived! 🎉</h1>
            <p>Welcome to the Linkist Founder circle</p>
        </div>

        <!-- Content -->
        <div class="content">
            <div class="section">
                <h2>Delivery Confirmed</h2>
                <div class="order-summary">
                    <div class="order-row">
                        <span>Order Number:</span>
                        <strong>{{orderNumber}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Delivered Date:</span>
                        <strong>{{deliveredDate}}</strong>
                    </div>
                    <div class="order-row">
                        <span>Delivered To:</span>
                        <strong>{{deliveryAddress}}</strong>
                    </div>
                </div>
            </div>

            <div class="section">
                <h2>How to Use Your NFC Card</h2>
                <ol>
                    <li><strong>Share Your Card</strong> - Simply tap your card against any smartphone</li>
                    <li><strong>Instant Connection</strong> - Your contact details appear instantly</li>
                    <li><strong>Save to Contacts</strong> - Recipients can save you with one tap</li>
                    <li><strong>Always Updated</strong> - Update your details anytime via the app</li>
                </ol>
            </div>

            <div class="section">
                <h2>Founder Member Benefits</h2>
                <p>As a Founder Member, you'll receive exclusive access to:</p>
                <ul>
                    <li>🚀 <strong>Early App Access</strong> - Be first to try new features</li>
                    <li>💎 <strong>Premium Features</strong> - Unlock advanced functionality</li>
                    <li>🎁 <strong>Special Pricing</strong> - Discounts on future products</li>
                    <li>🌟 <strong>Founder Badge</strong> - Show your early adopter status</li>
                </ul>
            </div>

            <!-- CTA Section -->
            <div class="section" style="text-align: center;">
                <h2>Ready for the App?</h2>
                <p>The Linkist mobile app is coming soon! Get notified when it launches.</p>
                <a href="{{appNotificationLink}}" class="cta-button">Notify Me When App Launches</a>
            </div>

            <div class="section" style="text-align: center;">
                <h2>Share Your Experience</h2>
                <p>Help others discover the power of NFC business cards!</p>
                <a href="{{referralLink}}" class="cta-button">Refer Friends & Earn Credits</a>
            </div>
        </div>

        <!-- Footer -->
        <div class="footer">
            <p>Need help? Contact us at <a href="mailto:support@linkist.ai">support@linkist.ai</a></p>
            <p><small>© 2025 Linkist. All rights reserved.</small></p>
        </div>
    </div>
</body>
</html>
```

---

## Email Variables

### Dynamic Content Placeholders
All email templates use these variables that are replaced with actual data:

```typescript
interface EmailVariables {
  // User Information
  firstName: string;
  lastName: string;
  email: string;
  
  // Order Information
  orderNumber: string;
  orderDate: string;
  expectedDelivery: string;
  totalAmount: string;
  
  // Payment Information
  transactionId: string;
  paymentDate: string;
  paymentMethod: string;
  receiptUrl: string;
  
  // Product Information
  quantity: number;
  unitPrice: string;
  subtotal: string;
  shipping: string;
  tax: string;
  
  // Proof Information
  proofImageUrl: string;
  
  // Shipping Information
  carrier: string;
  service: string;
  trackingNumber: string;
  trackingUrl: string;
  shippedDate: string;
  estimatedDelivery: string;
  deliveryAddress: string;
  deliveredDate: string;
  
  // Links
  referralLink: string;
  appNotificationLink: string;
}
```

---

## Email Sending Logic

### Trigger Conditions
```typescript
// When to send each email type
const emailTriggers = {
  orderConfirmation: 'order.status === "paid"',
  paymentReceipt: 'payment.status === "succeeded"',
  inProduction: 'order.status === "in_production"',
  shipped: 'shipment.shipped_at IS NOT NULL',
  delivered: 'shipment.delivered_at IS NOT NULL'
};
```

### Rate Limiting
```typescript
// Prevent email spam
const emailRateLimits = {
  orderConfirmation: '1 per order',
  paymentReceipt: '1 per payment',
  inProduction: '1 per order',
  shipped: '1 per shipment',
  delivered: '1 per delivery',
  resend: '3 per email type per 24 hours'
};
```

---

## Email Testing

### Test Scenarios
1. **New Order Flow**: Send all emails in sequence
2. **Status Updates**: Test individual status change emails
3. **Resend Functionality**: Verify resend limits and content
4. **Mobile Rendering**: Test on various email clients
5. **Accessibility**: Ensure high contrast and readable fonts

### A/B Testing
```typescript
// Test different subject lines
const subjectLineTests = {
  orderConfirmation: [
    'Welcome to Linkist — your NFC card order is in!',
    '🎉 You\'re a Founder Member! Order confirmed',
    'Your Linkist NFC card is confirmed'
  ]
};
```

---

**These email templates ensure consistent, engaging communication with customers!** 🎯 Each email is designed to build excitement and provide clear next steps in the customer journey.
