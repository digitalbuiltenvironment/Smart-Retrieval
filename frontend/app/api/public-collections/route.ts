import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the public collections id and data from the database
    const { data: publicCollections, error: pubCollErr } = await supabase
        .from('public_collections')
        .select('collections (collection_id, display_name, description)');

    if (pubCollErr) {
        console.error('Error fetching public collection data from database:', pubCollErr.message);
        return NextResponse.json({ error: pubCollErr.message }, { status: 500 });
    }

    // Extract collections object from each item in the array
    const formattedPublicCollections = publicCollections.map(item => item.collections);

    // console.log('formattedPublicCollections:', formattedPublicCollections);

    return NextResponse.json({ publicCollections: formattedPublicCollections });
}
