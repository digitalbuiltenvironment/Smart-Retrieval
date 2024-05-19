import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the user's public collections requests data from the database
export async function GET(request: NextRequest) {
    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    // Create a new Supabase client
    const supabaseAuth = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'next_auth' } },
    );

    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the user's ID from the session token
    const { data: sessionData, error: sessionError } = await supabaseAuth
        .from('sessions')
        .select('userId')
        .eq('sessionToken', session?.value)
        .single();

    const userId = sessionData?.userId;

    if (sessionError) {
        console.error('Error fetching session from database:', sessionError.message);
        return NextResponse.json({ error: sessionError.message }, { status: 500 });
    }

    // Retrieve the user's collections and public collections requests data via inner join from the database
    const { data: userPubCollectionsReq, error: userPubCollErr } = await supabase
        .from('collections')
        .select('collection_id, display_name, description, is_public, created_at, public_collections_requests (collection_id, is_make_public, is_pending, is_approved, created_at, updated_at)')
        .eq('id', userId);

    if (userPubCollErr) {
        console.error('Error fetching user public collections requests data from database:', userPubCollErr.message);
        return NextResponse.json({ error: userPubCollErr.message }, { status: 500 });
    }

    // console.log('User Public Collections Requests:', userPubCollectionsReq.map(item => item.public_collections_requests));

    return NextResponse.json({ userPubCollectionsReq: userPubCollectionsReq });
}

// POST request to insert the user's public collections request data into the database if not exist (Used by user)
export async function POST(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id, is_make_public } = await request?.json();

    // Insert the user's public collections request data into the database
    const { data: newUserPubCollectionsReq, error: newUserPubCollErr } = await supabase
        .from('public_collections_requests')
        .insert([{ collection_id, is_make_public }]);

    if (newUserPubCollErr) {
        console.error('Error inserting user public collections request data into database:', newUserPubCollErr.message);
        return NextResponse.json({ error: newUserPubCollErr.message }, { status: 500 });
    }

    // console.log('User Public Collections Requests:', userPubCollectionsReq);

    return NextResponse.json({ newUserPubCollectionsReq });
}

// PUT request to update the user's public collections request data in the database (Used by user)
export async function PUT(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id, is_make_public } = await request?.json();

    // Update the user's public collections request data in the database, set is_pending = true
    const { data: updatedUserPubCollectionsReq, error: updatedUserPubCollErr } = await supabase
        .from('public_collections_requests')
        .update({ is_make_public: is_make_public, is_pending: true, is_approved: false })
        .eq('collection_id', collection_id);

    if (updatedUserPubCollErr) {
        console.error('Error updating user public collections request data in database:', updatedUserPubCollErr.message);
        return NextResponse.json({ error: updatedUserPubCollErr.message }, { status: 500 });
    }

    // console.log('User Public Collections Requests:', userPubCollectionsReq);

    return NextResponse.json({ updatedUserPubCollectionsReq });
}

// DELETE request to delete the user's public collections request data from the database
export async function DELETE(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id } = await request?.json();

    // Delete the user's public collections request data from the database
    const { data: deletedUserPubCollectionsReq, error: deletedUserPubCollErr } = await supabase
        .from('public_collections_requests')
        .delete()
        .eq('collection_id', collection_id);

    if (deletedUserPubCollErr) {
        console.error('Error deleting user public collections request data from database:', deletedUserPubCollErr.message);
        return NextResponse.json({ error: deletedUserPubCollErr.message }, { status: 500 });
    }

    // console.log('User Public Collections Requests:', userPubCollectionsReq);

    return NextResponse.json({ deletedUserPubCollectionsReq });
}