import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next"
import { getServerSession } from "next-auth"

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
    // Configure one or more authentication providers
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        {
            id: 'sgid',
            name: 'SGID',
            type: 'oauth',
            issuer: 'https://api.id.gov.sg/v2',
            authorization: {
                url: 'https://api.id.gov.sg/v2/oauth/authorize',
                params: { scope: 'openid myinfo.name' },
            },
            jwks_endpoint: 'https://api.id.gov.sg/v2/.well-known/jwks.json',
            token: 'https://api.id.gov.sg/v2/oauth/token',
            userinfo: 'https://api.id.gov.sg/v2/oauth/userinfo',
            checks: ['pkce', 'state'],
            idToken: true,
            client: { token_endpoint_auth_method: 'client_secret_post' },
            clientId: process.env.SGID_CLIENT_ID,
            clientSecret: process.env.SGID_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.sub,
                }
            },
        },
    ],
    pages: {
        signIn: '/sign-in',
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Persist the OAuth access_token to the token right after signin
            if (account) {
                token.id_token = account.id_token
                token.provider = account.provider
                token.accessToken = account.access_token
            }
            return token
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            session.accessToken = token.accessToken as string
            return session
        }
    }
} satisfies NextAuthOptions

// Use it in server contexts
export async function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config)
}