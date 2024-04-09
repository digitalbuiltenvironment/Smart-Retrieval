import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import type { GetServerSidePropsContext, NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { SupabaseAdapter } from "@auth/supabase-adapter";
import type { Adapter } from 'next-auth/adapters';
import jwt from "jsonwebtoken";
import { JWE, JWK } from 'node-jose';

const makeUserinfoRequest = async (context: any) => {
    console.log('context:', context);
    const response = await fetch("https://api.id.gov.sg/v2/oauth/userinfo", {
        headers: {
            Authorization: `Bearer ${context.tokens.access_token}`,
        },
    })
    const profile = await response.json()

    // Decrypt the encrypted profile data
    const privateKey = process.env.SGID_PRIVATE_KEY as string;
    const decryptedProfile = await decryptData(profile.key, profile.data, privateKey);

    // Build profile object
    let newProfile = {
        sub: profile.sub,
        name: decryptedProfile['myinfo.name'],
    }

    // Return the decrypted profile
    return newProfile
}

const decryptData = async (encKey: string, block: { [s: string]: unknown; } | ArrayLike<unknown>, privateKeyPem: string | object | Buffer | JWK.RawKey) => {
    const result: { [key: string]: string } = {};

    // Decrypted encKey to get block key
    const privateKey = await JWK.asKey(privateKeyPem, 'pem');
    const key = await JWE.createDecrypt(privateKey).decrypt(encKey);

    // Parse the block key
    const decryptedKey = await JWK.asKey(key.plaintext, 'json');

    // Decrypt data
    for (const [key, value] of Object.entries(block)) {
        const { plaintext } = await JWE.createDecrypt(decryptedKey).decrypt(value as string);
        result[key] = plaintext.toString('ascii');
    }

    return result
}

// You'll need to import and pass this
// to `NextAuth` in `app/api/auth/[...nextauth]/route.ts`
export const config = {
    // Configure one or more authentication providers
    // Enable debug messages if running in development
    debug: process.env.NODE_ENV === 'development',
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
            userinfo: {
                url: 'https://api.id.gov.sg/v2/oauth/userinfo',
                // The result of this method will be the input to the `profile` callback.
                async request(context) {
                    // context contains useful properties to help you make the request.
                    return await makeUserinfoRequest(context)
                }
            },
            checks: ['pkce', 'state'],
            idToken: true,
            client: { token_endpoint_auth_method: 'client_secret_post' },
            clientId: process.env.SGID_CLIENT_ID,
            clientSecret: process.env.SGID_CLIENT_SECRET,
            profile: async (profile) => {
                return {
                    id: profile.sub,
                    name: profile.name,
                }
            },
        },
    ],
    // Persist accounts and session state to Supabase
    adapter: SupabaseAdapter({
        url: process.env.SUPABASE_URL || '',
        secret: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
    }) as Adapter,
    pages: {
        signIn: '/sign-in',
    },
    session: {
        // Choose how you want to save the user session.
        // The default is `"jwt"`, an encrypted JWT (JWE) stored in the session cookie.
        // If you use an `adapter` however, we default it to `"database"` instead.
        // You can still force a JWT session by explicitly defining `"jwt"`.
        // When using `"database"`, the session cookie will only contain a `sessionToken` value,
        // which is used to look up the session in the database.
        // strategy: "jwt",

        // Seconds - How long until an idle session expires and is no longer valid.
        maxAge: 30 * 24 * 60 * 60, // 30 days

        // Seconds - Throttle how frequently to write to database to extend a session.
        // Use it to limit write operations. Set to 0 to always update the database.
        // Note: This option is ignored if using JSON Web Tokens
        updateAge: 24 * 60 * 60, // 24 hours
    },
    callbacks: {
        async jwt({ token, user, account, profile }) {
            // Persist the OAuth access_token and or the user id to the token right after signin
            if (account) {
                token.accessToken = account.access_token
                token.id = profile?.sub
            }
            return token;
        },
        async session({ session, token, user }) {
            // Send properties to the client, like an access_token from a provider.
            const signingSecret = process.env.SUPABASE_JWT_SECRET
            // console.log('Signing Secret:', signingSecret);
            if (signingSecret) {
                const payload = {
                    aud: "authenticated",
                    exp: Math.floor(new Date(session.expires).getTime() / 1000),
                    sub: user.id,
                    // email: user.email,
                    role: "authenticated",
                }
                session.supabaseAccessToken = jwt.sign(payload, signingSecret) as string;
                // console.log('New Session:', session);
                // session.jwt = token.jwt as string;
                // session.id = token.id as string;
            }
            return session;
        },

    }
} satisfies NextAuthOptions

// Use it in server contexts
export async function auth(...args: [GetServerSidePropsContext["req"], GetServerSidePropsContext["res"]] | [NextApiRequest, NextApiResponse] | []) {
    return getServerSession(...args, config)
}