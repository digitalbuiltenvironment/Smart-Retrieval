import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
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
        return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }

    // Retrieve the user's collections and public collections requests data via inner join from the database
    const { data: userPubCollectionsReq, error: userPubCollErr } = await supabase
        .from('collections')
        .select('collection_id, display_name, description, created_at, public_collections_requests (collection_id, is_make_public, is_pending, is_approved, created_at, updated_at)')
        .eq('id', userId);

    if (userPubCollErr) {
        console.error('Error fetching user public collections requests data from database:', userPubCollErr.message);
        return NextResponse.json({ error: userPubCollErr.message }, { status: 500 });
    }

    // console.log('User Public Collections Requests:', userPubCollectionsReq.map(item => item.public_collections_requests));

    return NextResponse.json({ userPubCollectionsReq: userPubCollectionsReq });
}
