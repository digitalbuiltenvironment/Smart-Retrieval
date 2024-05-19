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

    // console.log('Collections:', collections);

    return NextResponse.json({ collections: collections });
}

// PUT request to update the collection data in the database
export async function PUT(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection ID from the request body
    const { collection_id, is_public } = await request.json();

    // Update the collection data in the database
    const { data, error } = await supabase
        .from('collections')
        .update({ is_public: is_public })
        .match({ collection_id });

    if (error) {
        console.error('Error updating collection data in database:', error.message);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // console.log('Updated collection:', data);

    // Delete the collection requests data in the database (Since it is manually updated by Admin)
    const { data: delData, error: delError } = await supabase
        .from('collection_requests')
        .delete()
        .match({ collection_id });
    
    if (delError) {
        console.error('Error deleting collection requests data in database:', delError.message);
        return NextResponse.json({ error: delError.message }, { status: 500 });
    }

    // console.log('Deleted collection requests:', delData);

    return NextResponse.json({ message: 'Collection updated successfully' });
}