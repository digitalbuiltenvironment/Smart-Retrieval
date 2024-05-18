import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the collections data from the database
export async function GET(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collections requests data from the database
    const { data: collections, error: collErr } = await supabase
        .from('collections')
        .select('collection_id, id, display_name, description, is_public, created_at, users (id, name, email)');

    if (collErr) {
        console.error('Error fetching collections data from database:', collErr.message);
        return NextResponse.json({ error: collErr.message }, { status: 500 });
    }

    console.log('Collections:', collections);

    return NextResponse.json({ collections: collections });
}
