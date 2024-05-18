import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// GET request to retrieve the users data from the database
export async function GET(request: NextRequest) {
    // Create a new Supabase client

    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('id, name, email, admins (id)');

    if (usersError) {
        console.error('Error fetching users data from database:', usersError.message);
        return NextResponse.json({ error: usersError.message }, { status: 500 });
    }

    // console.log('usersData:', usersData);

    return NextResponse.json({ users: usersData });
}
