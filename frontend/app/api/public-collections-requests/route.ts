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

    // const userId = sessionData?.userId;

    if (sessionError) {
        console.error('Error fetching session from database:', sessionError.message);
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    // Retrieve the user's collections id and data from the database
    const { data: pubCollectionsReq, error: pubCollErr } = await supabase
        .from('public_collections')
        .select('collection_id, is_pending, is_approved, is_cancel_req, is_cancel_pending, is_cancel_approved, created_at, updated_at');

    if (pubCollErr) {
        console.error('Error fetching public collection request data from database:', pubCollErr.message);
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    return NextResponse.json({ pubCollectionsReq: pubCollectionsReq });
}
