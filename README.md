# FreeHealthcareProxy

FreeHealthcareProxy.com helps people understand and resolve healthcare administrative problems (bills, denials, records, prior authorizations) by acting as an informational proxy—explaining what's happening for free and offering optional paid assistance to handle next steps on their behalf.

## Features

- **Medical Bills Help**: Understand charges, identify errors, and learn options for disputing or negotiating
- **Insurance Denial Appeals**: Decode denial reasons, understand appeal rights, and get guidance on fighting back
- **Medical Records Assistance**: HIPAA rights explanation, request guidance, and error correction help
- **Prior Authorization Support**: Clarify requirements, explain timelines, and expedite urgent requests

## Tech Stack

- Next.js 16 with App Router
- React 19
- TypeScript
- Tailwind CSS 4

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
src/
├── app/
│   ├── globals.css    # Global styles and CSS variables
│   ├── layout.tsx     # Root layout with metadata
│   └── page.tsx       # Home page
└── components/
    ├── Navigation.tsx # Responsive header navigation
    ├── Hero.tsx       # Hero section with value proposition
    ├── Services.tsx   # Services grid (bills, denials, records, prior auth)
    ├── HowItWorks.tsx # Process steps and free vs paid comparison
    ├── FAQ.tsx        # Accordion FAQ section
    ├── Contact.tsx    # Contact form
    └── Footer.tsx     # Site footer
```

## Deployment

The site can be deployed to Vercel, Netlify, or any platform that supports Next.js.

## License

All rights reserved.
