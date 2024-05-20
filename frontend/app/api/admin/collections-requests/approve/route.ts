import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// POST request to approve the user's collections request status in the database (Used by admin)
export async function POST(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id, is_make_public } = await request?.json();

    // Update the user's collections request data in the database, set is_pending = false
    const { data: updatedUserCollectionsReq, error: updatedUserCollReqErr } = await supabase
        .from('collections_requests')
        .update({ is_pending: false, is_approved: true })
        .eq('collection_id', collection_id);

    if (updatedUserCollReqErr) {
        console.error('Error updating user collections request data in database:', updatedUserCollReqErr.message);
        return NextResponse.json({ error: updatedUserCollReqErr.message }, { status: 500 });
    }

    // Update the user's collections data in the database, set is_public to is_make_public
    console.log('is_public:', is_make_public);
    const { data: updatedUserCollections, error: updatedUserCollErr } = await supabase
        .from('collections')
        .update({ is_public: is_make_public})
        .eq('collection_id', collection_id);

    if (updatedUserCollErr) {
        console.error('Error updating user public collections data in database:', updatedUserCollErr.message);
        return NextResponse.json({ error: updatedUserCollErr.message }, { status: 500 });
    }

    // console.log('Admin: Approved User Collections Request:', userPubCollectionsReq);
    // console.log('Admin: Updated User Collections:', userPubCollections);

    return NextResponse.json({ updatedUserCollectionsReq, updatedUserCollections });
}
