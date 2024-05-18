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
        .select('collection_id, is_make_public, is_pending, is_approved, created_at, updated_at, collections (collection_id, id, display_name, description, is_public, users (id, name, email))')
        .eq('is_pending', true);

    if (pubCollErr) {
        console.error('Error fetching public collection request data from database:', pubCollErr.message);
        return NextResponse.json({ error: pubCollErr.message }, { status: 500 });
    }

    console.log('Public Collections Request:', pubCollectionsReq);

    return NextResponse.json({ pubCollectionsReq: pubCollectionsReq });
}