// export { default } from "next-auth/middleware"

// export const config = {
//     matcher: ["/chat", "/search", "/query"] 
// }

// // Ensure auth is required for all except the following paths
// export const config = {
//     matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|favicon-16x16.png|apple-touch-icon.png|about|sign-in|api/status|privacy-policy|terms-of-service|sitemap.xml|robots.txt).+)']
// };

import { User } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js"

export const middleware = async (request: NextRequest) => {
    const { pathname, origin } = request.nextUrl;
    const signinPage = new URL('/sign-in', origin);
    // add params to the signinPage URL
    signinPage.searchParams.set('callbackUrl', pathname);
    const session = request.cookies.get('next-auth.session-token');
    let sessionExpired = false;

    if (!session) {
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }
    // console.log('session:', session);

    // Check the database for the session token
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'next_auth' } },
    );

    const { data, error } = await supabase
        .from('sessions')
        .select('userId, expires')
        .eq('sessionToken', session?.value)
        .single();

    if (!error) {
        // console.log('data:', data);

        // Check if the session is expired
        const now = new Date().getTime();
        const expires = new Date(data?.expires).getTime();
        sessionExpired = expires > now ? true : false;

        // Set a cookie to be used by the frontend to check if the session is expired
        // request.cookies.set('next-auth.session-valid', true, {
        //     httpOnly: true,
        //     sameSite: 'lax',
        //     secure: true,
        //     path: '/',
        //     maxAge: 60 * 60 * 24 * 1 // 1 day
        // });
    }
    else {
        console.error('Error fetching session from database:', error.message);
    }

    // Redirect to the sign-in page if the session is expired
    if (pathname != "/sign-in" && !sessionExpired) {
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }
}

export const config = {
    matcher: ['/((?!api/auth|_next/static|_next/image|favicon.ico|favicon-16x16.png|apple-touch-icon.png|about|sign-in|api/status|privacy-policy|terms-of-service|sitemap.xml|robots.txt).+)']
}

type session = {} | User;