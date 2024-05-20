export const dynamic = 'force-dynamic';

import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the user's collections requests data from the database
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

    // Retrieve the user's collections and collections requests data via inner join from the database
    const { data: userCollectionsReq, error: userCollErr } = await supabase
        .from('collections')
        .select(`
            collection_id,
            display_name,
            description,
            is_public,
            created_at,
            collections_requests (
                collection_id,
                is_make_public,
                is_pending,
                is_approved,
                created_at,
                updated_at
            )
        `)
        .eq('id', userId);

    if (userCollErr) {
        console.error('Error fetching user collections requests data from database:', userCollErr.message);
        return NextResponse.json({ error: userCollErr.message }, { status: 500 });
    }

    // console.log('User Collections Requests:', userCollectionsReq);

    return NextResponse.json({ userCollectionsReq: userCollectionsReq });
}

// POST request to insert the user's collections request data into the database if not exist (Used by user)
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
    const { data: newUserCollectionsReq, error: newUserCollErr } = await supabase
        .from('collections_requests')
        .insert([{ collection_id, is_make_public }]);

    if (newUserCollErr) {
        console.error('Error inserting user collections request data into database:', newUserCollErr.message);
        return NextResponse.json({ error: newUserCollErr.message }, { status: 500 });
    }

    // console.log('Insert User Collections Requests:', userCollectionsReq);

    return NextResponse.json({ newUserCollectionsReq });
}

// PUT request to update the user's collections request data in the database (Used by user)
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
    const { data: updatedUserCollectionsReq, error: updatedUserCollErr } = await supabase
        .from('collections_requests')
        .update({ is_make_public: is_make_public, is_pending: true, is_approved: false })
        .eq('collection_id', collection_id);

    if (updatedUserCollErr) {
        console.error('Error updating user collections request data in database:', updatedUserCollErr.message);
        return NextResponse.json({ error: updatedUserCollErr.message }, { status: 500 });
    }

    // console.log('Update User Collections Requests:', userCollectionsReq);

    return NextResponse.json({ updatedUserCollectionsReq });
}

// DELETE request to delete the user's collections request data from the database
export async function DELETE(request: NextRequest) {
    // Create a new Supabase client
    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the collection_id from the request body
    const { collection_id } = await request?.json();

    // Delete the user's collections request data from the database
    const { data: deletedUserCollectionsReq, error: deletedUserCollErr } = await supabase
        .from('collections_requests')
        .delete()
        .eq('collection_id', collection_id);

    if (deletedUserCollErr) {
        console.error('Error deleting user collections request data from database:', deletedUserCollErr.message);
        return NextResponse.json({ error: deletedUserCollErr.message }, { status: 500 });
    }

    // console.log('Delete User Collections Requests:', userCollectionsReq);

    return NextResponse.json({ deletedUserCollectionsReq });
}