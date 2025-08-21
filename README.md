# Big Brother Fantasy League

A fantasy sports application for Big Brother Season 27, where users can pick 5 houseguests and compete based on their competition wins.

## Features

- **User Registration**: Magic link authentication via email
- **Fantasy Picks**: Select exactly 5 houseguests for your team
- **Scoring System**: 2 points per competition win (HOH, POV, Blockbuster)
- **Leaderboard**: Real-time rankings with points and remaining houseguests
- **Season History**: Week-by-week competition results and evictions
- **Admin Panel**: Role-based access for updating competition results
- **Responsive Design**: Works on desktop and mobile devices
- **Accessibility**: ARIA labels, keyboard navigation, alt text for images

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Prisma ORM
- **Database**: PostgreSQL
- **Authentication**: NextAuth.js with email provider
- **Deployment**: Vercel (recommended) or Railway

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Email service (for magic links)

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd BBFantasy
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in your database URL, NextAuth secret, and email provider settings.

4. Set up the database:
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses these main models:

- **User**: User accounts with picks and admin status
- **Houseguest**: Contestants with competition wins and status
- **Pick**: Many-to-many relationship between users and houseguests
- **Week**: Weekly competition results and eviction data

## API Endpoints

### Public Routes
- `GET /api/houseguests` - List all houseguests
- `GET /api/houseguests/[slug]` - Get houseguest details
- `GET /api/leaderboard` - Get user rankings
- `GET /api/users/[username]` - Get user profile
- `GET /api/history` - Get weekly results

### Authenticated Routes
- `POST /api/me` - Create/update user profile
- `POST /api/me/picks` - Update fantasy picks

### Admin Routes
- `PUT /api/admin/week/[n]` - Update week results
- `PUT /api/admin/houseguest/[id]` - Update houseguest
- `POST /api/admin/houseguests/seed` - Seed houseguests

## Scoring System

Players earn points based on their houseguests' competition wins:
- **2 points** per Head of Household (HOH) win
- **2 points** per Power of Veto (POV) win  
- **2 points** per BB Blockbuster win

## Season 27 Features

- Support for **3 nominees** per week
- **BB Blockbuster** competition tracking
- Power of Veto replacement nominee logic
- Eviction vote tracking

## Development

### Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed the database
- `npm run db:push` - Push schema changes

### Database Management

- Generate Prisma client: `npx prisma generate`
- Apply schema changes: `npx prisma db push`
- View database: `npx prisma studio`
- Create backup: `./scripts/backup-db.sh`

## Deployment

### Vercel (Recommended)

1. Connect your GitHub repository to Vercel
2. Set environment variables in the Vercel dashboard
3. Deploy automatically on push to main branch

### Railway

1. Connect your GitHub repository to Railway
2. Add PostgreSQL service
3. Set environment variables
4. Deploy

## Security Features

- Rate limiting on API endpoints
- Input validation with Zod
- SQL injection protection via Prisma
- CSRF protection via NextAuth.js
- Role-based access control

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

This project is licensed under the MIT License.