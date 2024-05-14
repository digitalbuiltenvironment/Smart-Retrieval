import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the public collections requests data from the database
    const { data: pubCollectionsReq, error: pubCollErr } = await supabase
        .from('public_collections_requests')
        .select('collection_id, is_pending, is_approved, is_cancel_req, is_cancel_pending, is_cancel_approved, created_at, updated_at');

    if (pubCollErr) {
        console.error('Error fetching public collection request data from database:', pubCollErr.message);
        return NextResponse.json({ error: pubCollErr.message }, { status: 500 });
    }

    console.log('Public Collections Request:', pubCollectionsReq);

    return NextResponse.json({ pubCollectionsReq: pubCollectionsReq });
}