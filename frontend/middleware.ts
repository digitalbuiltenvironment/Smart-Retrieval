import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"

type session = {} | User;

export const middleware = async (request: NextRequest) => {
    const { pathname, origin } = request.nextUrl;
    const signinPage = new URL('/sign-in', origin);
    // Add callbackUrl params to the signinPage URL
    signinPage.searchParams.set('callbackUrl', pathname);
    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    if (session) {
        // console.log('session:', session);

        // Check the database for the session token
        const supabase = createClient(
            process.env.SUPABASE_URL ?? '',
            process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
            { db: { schema: 'next_auth' } },
        );

        const { data, error } = await supabase
            .from('sessions')
            .select('userId, expires')
            .eq('sessionToken', session?.value)
            .single();

        // console.log('data:', data);

        // Check if the session is expired or not
        const now = new Date().getTime();
        const expires = new Date(data?.expires).getTime();
        const sessionExpired = expires > now ? true : false;

        // Redirect to the sign-in page if the session is expired and not on the sign-in page
        if (pathname != "/sign-in" && !sessionExpired) {
            return NextResponse.redirect(signinPage.href, { status: 302 });
        }

        if (error) {
            // Redirect to the sign-in page if there is an error fetching the session from the database
            console.error('Error fetching session from database:', error.message);
            return NextResponse.redirect(signinPage.href, { status: 302 });
        }
    }
    else {
        // Redirect to the sign-in page if there is no session token
        // console.error('No session token found');
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    // Continue to the next middleware
    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|favicon-16x16.png|apple-touch-icon.png|about|sign-in|api/status|privacy-policy|terms-of-service|sitemap.xml|robots.txt).+)']
}

// Default middleware for NextAuth checking for JWT session not database session

// export { default } from "next-auth/middleware"

// export const config = {
//     matcher: ["/chat", "/search", "/query"] 
// }

// // Ensure auth is required for all except the following paths
// export const config = {
//     matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|favicon-16x16.png|apple-touch-icon.png|about|sign-in|api/status|privacy-policy|terms-of-service|sitemap.xml|robots.txt).+)']
// };