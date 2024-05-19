import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// POST request to approve the user's public collections request status in the database (Used by admin)
export async function POST(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id, is_make_public } = await request?.json();

    // Update the user's public collections request data in the database, set is_pending = false
    const { data: updatedUserPubCollectionsReq, error: updatedUserPubCollReqErr } = await supabase
        .from('public_collections_requests')
        .update({ is_pending: false, is_approved: true })
        .eq('collection_id', collection_id);

    if (updatedUserPubCollReqErr) {
        console.error('Error updating user public collections request data in database:', updatedUserPubCollReqErr.message);
        return NextResponse.json({ error: updatedUserPubCollReqErr.message }, { status: 500 });
    }

    // Update the user's collections data in the database, set is_public = true
    console.log('is_public:', is_make_public);
    const { data: updatedUserPubCollections, error: updatedUserPubCollErr } = await supabase
        .from('collections')
        .update({ is_public: is_make_public})
        .eq('collection_id', collection_id);

    if (updatedUserPubCollErr) {
        console.error('Error updating user public collections data in database:', updatedUserPubCollErr.message);
        return NextResponse.json({ error: updatedUserPubCollErr.message }, { status: 500 });
    }

    // console.log('Admin: User Public Collections Requests:', userPubCollectionsReq);
    // console.log('Admin: User Public Collections:', userPubCollections);

    return NextResponse.json({ updatedUserPubCollectionsReq, updatedUserPubCollections });
}
