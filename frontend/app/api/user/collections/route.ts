import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the user's collections data from the database
export async function GET(request: NextRequest) {
    const { pathname, origin } = request.nextUrl;
    const signinPage = new URL('/sign-in', origin);
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
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    // Retrieve the user's collections id and data from the database
    const { data: userCollections, error: userCollErr } = await supabase
        .from('collections')
        .select('collection_id, display_name, description, created_at')
        .eq('id', userId);

    if (userCollErr) {
        console.error('Error fetching user collection data from database:', userCollErr.message);
        return NextResponse.redirect(signinPage.href, { status: 302 });
    }

    return NextResponse.json({ userCollections: userCollections });
}

// POST request to insert the user's collection data into the database
export async function POST(request: NextRequest) {
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

    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    // Retrieve the collection data from the request body
    const { display_name, description } = await request?.json();

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

    // Insert the collection data into the database and return the data
    const { data: insertData, error: insertError } = await supabase
        .from('collections')
        .insert([{ id: userId, display_name, description }])
        .select('collection_id');

    if (insertError) {
        console.error('Error inserting user collection data into database:', insertError.message);
        return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    // console.log('Collection data inserted:', insertData);

    return NextResponse.json({ message: 'Collection data inserted successfully.', collectionId: insertData[0].collection_id });
}

// DELETE request to delete the user's collection data from the database
export async function DELETE(request: NextRequest) {
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

    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    // Retrieve the authorization token from the request headers
    let authorization = request.headers.get('Authorization');

    // Public API key
    let api_key = null;

    // If no session, use the public API key
    if (authorization === null || authorization === undefined || authorization.includes('undefined')) {
        console.log('No authorization token found, using public API key');
        api_key = process.env.BACKEND_API_KEY as string;
        authorization = null; // Clear the authorization token
    }

    // Create default delete_vecs variable
    let is_delete_vecs = true;
    // Retrieve the collection_id from the request body
    const { collection_id, delete_vecs } = await request?.json();

    // if delete_vecs is not undefined, take its value
    if (delete_vecs !== undefined) {
        is_delete_vecs = delete_vecs;
    }

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

    if (is_delete_vecs === true) {
        // Delete the vector collection from the vecs schema via POST request to Backend API
        const deleteVecsResponse = await fetch(`${process.env.DELETE_SINGLE_COLLECTION_API}?collection_id=${collection_id}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authorization,
                'X-API-Key': api_key,
            } as any,
            body: JSON.stringify({ collection_id: collection_id }),
        });

        if (!deleteVecsResponse.ok) {
            console.error('Error deleting', collection_id, 'from vecs schema:', deleteVecsResponse.statusText);
            return NextResponse.json({ error: deleteVecsResponse.statusText }, { status: deleteVecsResponse.status });
        }
    }

    // Delete the collection data from the database
    const { data: deleteData, error: deleteError } = await supabase
        .from('collections')
        .delete()
        .eq('id', userId)
        .eq('collection_id', collection_id);

    if (deleteError) {
        console.error('Error deleting', collection_id, ' from database:', deleteError.message);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // console.log('Delete', collection_id, ':', deleteData, 'deleteVecsResponse:', deleteVecsResponse);

    return NextResponse.json({ message: 'Collection data deleted successfully.' });
}
