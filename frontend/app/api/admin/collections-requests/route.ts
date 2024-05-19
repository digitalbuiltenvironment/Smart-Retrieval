import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the collections requests data from the database
export async function GET(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collections requests data from the database
    const { data: collectionsReq, error: collErr } = await supabase
        .from('collections_requests')
        .select('collection_id, is_make_public, is_pending, is_approved, created_at, updated_at, collections (collection_id, id, display_name, description, is_public, users (id, name, email))')
        .eq('is_pending', true);

    if (collErr) {
        console.error('Error fetching collection request data from database:', collErr.message);
        return NextResponse.json({ error: collErr.message }, { status: 500 });
    }

    // console.log('Collections Request:', collectionsReq);

    return NextResponse.json({ collectionsReq: collectionsReq });
}
