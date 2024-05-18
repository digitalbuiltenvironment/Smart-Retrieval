import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from "next/server";

// POST request to demote a user to a normal user
export async function POST(request: NextRequest) {
    // Create a new Supabase client

    const supabase = createClient(
        process.env.SUPABASE_URL ?? '',
        process.env.SUPABASE_SERVICE_ROLE_KEY ?? '',
        { db: { schema: 'public' } },
    );

    // Retrieve the user id from the request body
    const { id } = await request?.json();

    const { data: updatedAdminsData, error: updateAdminsError } = await supabase
        .from('admins')
        .delete()
        .eq('id', id);

    if (updateAdminsError) {
        console.error('Error removing admin from database:', updateAdminsError.message);
        return NextResponse.json({ error: updateAdminsError.message }, { status: 500 });
    }

    return NextResponse.json({ updatedAdminsData });
}
