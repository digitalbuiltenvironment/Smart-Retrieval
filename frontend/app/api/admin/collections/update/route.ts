export const revalidate = 10;

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// POST request to update the collection data in the database
export async function POST(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection ID from the request body
    const { collection_id, is_public } = await request.json();

    // Update the collection data in the database
    const { data: updateData, error: updateError } = await supabase
        .from('collections')
        .update({ is_public: is_public })
        .eq('collection_id', collection_id);

    if (updateError) {
        console.error('Error updating collection data in database:', updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // console.log('Updated collection:', updateData);

    // Check if there is an existing collection request for the collection
    const { data: collReq, error: collReqError } = await supabase
        .from('collections_requests')
        .select('collection_id')
        .eq('collection_id', collection_id);

    if (collReqError) {
        console.error('Error fetching collection requests data from database:', collReqError.message);
        return NextResponse.json({ error: collReqError.message }, { status: 500 });
    }

    // console.log('Collection requests:', collReq);

    // If there is an existing collection request, delete it
    if (collReq.length === 1) {
        const { data: delData, error: delError } = await supabase
            .from('collections_requests')
            .delete()
            .eq('collection_id', collection_id);

        if (delError) {
            console.error('Error deleting collection requests data in database:', delError.message);
            return NextResponse.json({ error: delError.message }, { status: 500 });
        }

        // console.log('Deleted collection requests:', delData);
    }

    return NextResponse.json({ message: 'Collection updated successfully' });
}