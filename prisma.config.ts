// Prisma 7 CLI config — migrate/generate read the datasource from here (the schema
// file no longer carries a url). Runtime connections use the PrismaPg adapter in
// src/server/db.ts. Env vars load explicitly (dotenv) so `npx prisma migrate deploy`
// works in the Amplify build, which writes .env in preBuild.
import 'dotenv/config'
import { defineConfig } from 'prisma/config'

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Plain lookup with a placeholder fallback (the strict env() helper throws at
    // config-load time, which would break `prisma generate` in URL-less contexts
    // like npm postinstall). Anything that actually CONNECTS still fails loudly.
    url: process.env.DATABASE_URL ?? 'postgresql://unset:unset@localhost:5432/unset',
  },
})
