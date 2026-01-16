# FreeHealthcareProxy

A "free clarity → paid action" healthcare admin proxy web app. Users describe their healthcare administrative problem, receive a free **Issue Resolution Map** (what's happening, who's responsible, likelihood of resolution, exact next steps + documents needed), and can optionally request paid assistance to handle it for them.

## Features

- **Free Issue Analysis**: Get a structured resolution map for any healthcare admin issue
- **Five Issue Types Supported**:
  - Insurance Denials
  - Confusing Bills / EOBs
  - Prior Authorization Issues
  - Medical Records Requests
  - Pending Claims
- **Deterministic Resolution Generator**: Rule-based heuristics with clean interface for future LLM integration
- **Optional Paid Services**: Lead capture for users who want hands-on help
- **No Login Required**: Anonymous session-based tracking

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript
- **Styling**: Tailwind CSS + shadcn/ui components
- **Database**: Prisma + SQLite (easily swappable to Postgres)
- **Testing**: Vitest
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── issues/route.ts     # Issue creation & retrieval
│   │   └── leads/route.ts      # Lead capture for paid services
│   ├── next/[id]/page.tsx      # DIY vs paid decision page
│   ├── privacy/page.tsx        # Privacy policy
│   ├── result/[id]/page.tsx    # Resolution map display
│   ├── start/page.tsx          # Intake form (3-step wizard)
│   ├── terms/page.tsx          # Terms of service
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx                # Landing page
├── components/
│   ├── ui/                     # shadcn/ui components
│   └── Disclaimer.tsx          # Persistent disclaimer banner
├── lib/
│   ├── db.ts                   # Prisma client singleton
│   ├── resolution-generator.ts # Core resolution logic
│   └── utils.ts                # Utility functions
└── __tests__/
    └── resolution-generator.test.ts  # Unit tests

prisma/
└── schema.prisma               # Database schema
```

## Routes

| Route | Description |
|-------|-------------|
| `/` | Landing page with clear free/paid value proposition |
| `/start` | 3-step intake form to describe the issue |
| `/result/[id]` | Full Issue Resolution Map with next steps |
| `/next/[id]` | Choose DIY or request paid assistance |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |

## Getting Started

```bash
# Install dependencies
npm install

# Set up the database
npx prisma generate
npx prisma db push

# Run development server
npm run dev

# Run tests
npm run test:run

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## Environment Variables

Create a `.env` file:

```env
DATABASE_URL="file:./dev.db"
```

For production with Postgres:

```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
```

## Resolution Generator

The resolution generator (`src/lib/resolution-generator.ts`) uses a clean interface:

```typescript
interface ResolutionGenerator {
  generate(input: IssueInput): Promise<ResolutionMap>;
}
```

The current implementation (`RuleBasedResolutionGenerator`) uses deterministic rules. To integrate an LLM:

1. Create a new class implementing `ResolutionGenerator`
2. Swap the implementation in the API route

## Testing

```bash
# Run all tests
npm run test:run

# Watch mode
npm test
```

14 unit tests cover:
- All 5 issue types
- Resolution structure validation
- Likelihood assessment logic
- Input customization

## Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to Vercel
3. Set `DATABASE_URL` environment variable (use Vercel Postgres or external)
4. Deploy

### Other Platforms

Ensure Node.js 18+ and set the `DATABASE_URL` environment variable.

## License

All rights reserved.
