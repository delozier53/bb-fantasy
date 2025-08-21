import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      image?: string | null
      isAdmin: boolean
    }
  }

  interface User {
    id: string
    email: string
    username: string
    photoUrl?: string
    isAdmin: boolean
  }
}
