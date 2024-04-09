import NextAuth from 'next-auth'

declare module 'next-auth' {
    // Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
    interface Session {
        // A JWT which can be used as Authorization header with supabase-js for RLS.
        supabaseAccessToken?: string
        jwt?: string
        id?: string
        user: {
            id: string
            email: string
            name: string
            image: string
        } & DefaultSession["user"]
    }
}

declare module 'next-auth/jwt' {
    interface JWT {
        id_token?: string
        provider?: string
        accessToken?: string
    }
}