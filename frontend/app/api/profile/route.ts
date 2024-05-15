import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

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

    // console.log('userData:', userData);

    return NextResponse.json({ userData: userData });
}
