import { type DefaultSession } from 'next-auth'

// The session callback in [...nextauth].ts copies the user id from the JWT onto
// the session — teach TypeScript about it.
declare module 'next-auth' {
  interface Session {
    user?: DefaultSession['user'] & { id?: string }
  }
}
