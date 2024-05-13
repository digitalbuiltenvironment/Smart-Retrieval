import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const signinPage = new URL('/sign-in', origin);
    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    // Create a new Supabase client
    const supabaseAuth = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'next_auth' } },
    );

    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the user's ID from the session token
    const { data: sessionData, error: sessionError } = await supabaseAuth
        .from('sessions')
        .select('userId')
        .eq('sessionToken', session?.value)
        .single();

    const userId = sessionData?.userId;

    if (sessionError) {
        console.error('Error fetching session from database:', sessionError.message);
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    // Retrieve the user's collections id and data from the database
    const { data: userCollections, error: userCollErr } = await supabase
        .from('collections')
        .select('collection_id, display_name, description')
        .eq('id', userId);

    if (userCollErr) {
        console.error('Error fetching user collection data from database:', userCollErr.message);
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    return NextResponse.json({ userCollections: userCollections });
}
