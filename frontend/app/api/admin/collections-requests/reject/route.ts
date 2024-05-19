import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// POST request to reject the user's collections request status in the database (Used by admin)
export async function POST(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id } = await request?.json();

    // Update the user's collections request data in the database, set is_pending = false
    const { data: updatedUserCollectionsReq, error: updatedUserCollErr } = await supabase
        .from('collections_requests')
        .update({ is_pending: false, is_approved: false})
        .eq('collection_id', collection_id);

    if (updatedUserCollErr) {
        console.error('Error updating user collections request data in database:', updatedUserCollErr.message);
        return NextResponse.json({ error: updatedUserCollErr.message }, { status: 500 });
    }

    // console.log('Admin: Reject User Collections Requests:', updatedUserCollectionsReq);

    return NextResponse.json({ updatedUserCollectionsReq });
}
