# Linkist NFC — E‑commerce at /nfc 🚀

## What it is
A global, single‑product storefront for personalized NFC cards at `linkist.ai/nfc`. Think of it like a digital store where people can order smart business cards that work with just a tap!

## Purpose
- **Generate near‑term revenue** while the Linkist mobile app targets Dec 2025
- **Deliver a friction‑light purchase flow** with live preview and reliable fulfillment
- **Recognize early customers** as Founder Members (1‑year app fee waived at app launch)

## Target audience
Professionals, teams, and SMBs worldwide who want premium NFC business cards and easy contact sharing.

## Key features
- **Configurator** with validation and live proof (front/back)
- **Guest checkout** → auto‑create account via email one‑time code (no password)
- **USD pricing globally**; 5% VAT by default; international shipping surcharge when destination ≠ UAE
- **Status emails**: confirmation, payment receipt, in‑production, shipped (tracking), delivered
- **Admin dashboard** for production/programming/shipping

## High‑level tech
- **Frontend**: Next.js (React), Tailwind, Zod
- **Backend**: Node.js (Next API routes or NestJS), serverless jobs
- **Payments**: Stripe (adapter to add Checkout.com later)
- **Email**: AWS SES
- **Data**: PostgreSQL + S3‑compatible object storage + Redis
- **Infra**: IaC (Terraform), CI/CD (GitHub Actions)

## Quick Start
1. Clone this repository
2. Install dependencies: `npm install`
3. Set up environment variables (see `.env.example`)
4. Run development server: `npm run dev`
5. Visit `http://localhost:3000/nfc`

## Project Structure
```
linkist-nfc/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── lib/                  # Utility functions and configurations
├── docs/                 # Project documentation
└── README.md            # This file
```

## Getting Help
- Check the `docs/` folder for detailed guides
- Review `PROJECT_PLAN.md` for development phases
- See `TASK_LIST.md` for current priorities

---

**Ready to build something amazing?** 🎯 Let's make those NFC cards fly off the digital shelves!

