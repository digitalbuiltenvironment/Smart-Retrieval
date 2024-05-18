import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the user's profile data
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

    // Retrieve the user's profile data
    const { data: userData, error: userError } = await supabase
        .from('users')
        .select('id, name, email, image')
        .eq('id', userId)
        .single();

    if (userError) {
        console.error('Error fetching user data from database:', userError.message);
        return NextResponse.json({ error: userError.message }, { status: 500 });
    }

    console.log('userData:', userData);

    return NextResponse.json({ userData: userData });
}

// PUT request to update the user's profile data
export async function PUT(request: NextRequest) {
    // Retrieve the session token from the request cookies
    const session = request.cookies.get('next-auth.session-token') || request.cookies.get('__Secure-next-auth.session-token');

    // Retrieve the user's data from the request body
    const { userId, name, email, image } = await request.json();

    // Create a new Supabase client

    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Update the user's profile data
    const { data: updatedUserData, error: updateError } = await supabase
        .from('users')
        .update({ name, email, image })
        .eq('id', userId);

    if (updateError) {
        console.error('Error updating user data in database:', updateError.message);
        return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    // console.log('updatedUserData:', updatedUserData);

    return NextResponse.json({ updatedUserData });
}

// DELETE request to delete the user's profile & all data
export async function DELETE(request: NextRequest) {
    // Create a new Supabase client
    const supabaseAuth = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'next_auth' } },
    );

    // Retrieve the user's ID from the request body
    const { userId } = await request?.json();

    // Delete the user's profile data from users table in next_auth schema (and all related data via cascaded delete for tables in both publicand next_auth schema)
    const { data: deletedUserData, error: deleteError } = await supabaseAuth
        .from('users')
        .delete()
        .eq('id', userId)

    // TODO: Delete the user's vector collection from the vecs schema

    if (deleteError) {
        console.error('Error deleting user data from database:', deleteError.message);
        return NextResponse.json({ error: deleteError.message }, { status: 500 });
    }

    // console.log('deletedUserData:', deletedUserData);

    return NextResponse.json({ deletedUserData });
}