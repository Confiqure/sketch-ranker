# Comedy Sketch Ranker

A web application that allows users to log in with Google, vote on their favorite comedy sketches, and view rankings based on Elo ratings.

## Project Overview

This project is built using the T3 stack, which includes Next.js, TypeScript, Prisma, tRPC, and Tailwind CSS. The goal is to provide an engaging platform where users can rank comedy sketches by voting on pairs, with an Elo rating system determining the rankings.

## Status

Feature-complete; revival staged on AWS Aurora Serverless v2 with scale-to-zero
auto-pause, restored from the original database snapshot (the always-on RDS instance
was retired over cost). Append `sslmode=require&connect_timeout=30` to `DATABASE_URL`
so clients ride out the ~15 s wake from auto-pause; migrations run in the Amplify
build (`amplify.yml`).

## Features

- Head-to-head voting (`/vote`) with skip, keyboard shortcuts, leveling + confetti
- **Invite-only voting**: sign in with Google, then an admin approves your email
  from `/admin` (friendly ask-the-owner page until then); the homepage and
  leaderboard stay public
- Elo rating system (K=32) — transactional updates plus a durable per-vote event
  log powering cross-device per-user stats
- Leaderboard (`/leaderboard`) with view-all and live rankings
- Random sketch memes on vote cards (S3-hosted)
- Admin interface (`/admin`) for managing sketches, meme images, and the voter
  allowlist — gated on the `ADMIN_EMAILS` env var
- 86-sketch seed catalog covering all three seasons + 879 image mappings

## Tech Stack

- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - Superset of JavaScript for type-safe code
- **Prisma** - ORM for interacting with PostgreSQL database
- **tRPC** - Type-safe API development framework
- **Tailwind CSS** - Utility-first CSS framework for styling
- **NextAuth.js** - Authentication library for handling user sign-ins

## Getting Started

### Prerequisites

- Node.js (>=20; Next 16 requirement)
- PostgreSQL (local or hosted instance — `docker run -e POSTGRES_PASSWORD=dev -p 5432:5432 postgres:16-alpine` is plenty)
- Google Developer Console (for OAuth credentials)

### Setup

1. **Clone the repository**:

   ```bash
   git clone https://github.com/Confiqure/sketch-ranker.git
   cd sketch-ranker
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up environment variables**:

   - Create a `.env` file in the root directory and add the following environment variables:

     ```bash
     DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     NEXTAUTH_SECRET=any-random-string
     NEXTAUTH_URL=http://localhost:3000
     ADMIN_EMAILS=you@example.com   # comma-separated /admin allowlist
     ```

4. **Initialize Prisma**:

   - Run the following commands to set up your database schema:

     ```bash
     npx prisma migrate dev
     npx prisma generate
     ```

5. **Load seed data**:

   - Run the following command to load seed data into your database:

     ```bash
     npm run seed
     ```

   - Seeds the full 86-sketch catalog and all 879 meme-image mappings
     (`prisma/sketch_images.json`, exported from production data; the images
     themselves live in the public `itysl-memes` S3 bucket). Idempotent.
     **Never seed production**: the live database carries the restored historical
     data with real Elo standings.

### Running Locally

1. **Start the development server**:

   ```bash
   npm run dev
   ```

   - The app will be available at `http://localhost:3000`.

2. **Test Authentication**:

   - Visit `http://localhost:3000/profile` and sign in with Google.

3. **Verify Database Integration**:

   - Check that user information is stored in your PostgreSQL database after signing in:

     ```bash
     npx prisma studio
     ```

### Building for Production

1. **Build the project**:

   ```bash
   npm run build
   ```

2. **Start the production server**:

   ```bash
   npm start
   ```

   - The app will be available at `http://localhost:3000`.

### Deployment

The project is set up for deployment on AWS Amplify. To deploy:

1. Push the code to a GitHub repository.
2. Connect the repository to AWS Amplify.
3. Set the environment variables in AWS Amplify's dashboard.
4. Deploy the app from the Amplify dashboard.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request.

## License

This project is licensed under the MIT License.
