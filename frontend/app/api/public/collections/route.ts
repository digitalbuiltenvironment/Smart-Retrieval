export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
   // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collections id and data from the database where is_public = true
    const { data: publicCollections, error: pubCollErr } = await supabase
        .from('collections')
        .select('collection_id, display_name, description, created_at')
        .eq('is_public', true);

    if (pubCollErr) {
        console.error('Error fetching public collection data from database:', pubCollErr.message);
        return NextResponse.json({ error: pubCollErr.message }, { status: 500 });
    }

    // console.log('publicCollections:', publicCollections);

    return NextResponse.json({ publicCollections: publicCollections });
}
