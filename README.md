# Comedy Sketch Ranker

A web application that allows users to log in with Google, vote on their favorite comedy sketches, and view rankings based on Elo ratings.

## Project Overview

This project is built using the T3 stack, which includes Next.js, TypeScript, Prisma, tRPC, and Tailwind CSS. The goal is to provide an engaging platform where users can rank comedy sketches by voting on pairs, with an Elo rating system determining the rankings.

## To-Do

- Integrate build system with AWS Amplify
- Integrate my editor with ESLint and Prettier
- Add admin interface for managing sketches
- Add voting screen for users to rank sketches
- Implement Elo ranking system for ranking sketches
- Display rankings on the /rankings page

## Features

- User authentication via Google
- Voting system for ranking comedy sketches
- Elo ranking system to rank sketches based on user preferences
- Admin interface for managing sketches

## Tech Stack

- **Next.js** - React framework for server-side rendering and static site generation
- **TypeScript** - Superset of JavaScript for type-safe code
- **Prisma** - ORM for interacting with PostgreSQL database
- **tRPC** - Type-safe API development framework
- **Tailwind CSS** - Utility-first CSS framework for styling
- **NextAuth.js** - Authentication library for handling user sign-ins

## Getting Started

### Prerequisites

- Node.js (>=14.x)
- PostgreSQL (local or hosted instance)
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
