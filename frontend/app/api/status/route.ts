export async function GET(request: Request) {
    const healthcheck_api = process.env.NEXT_PUBLIC_HEALTHCHECK_API as string;

    // Retrieve the session token from the request headers
    let session = request.headers.get('Authorization');

    console.log('Status API - headers:', request.headers);

    // Public API key
    let api_key = null;

    // If no session, use the public API key
    if (!session) {
        api_key = process.env.BACKEND_API_KEY as string;
    }

    const res = await fetch(healthcheck_api, {
        signal: AbortSignal.timeout(5000), // Abort the request if it takes longer than 5 seconds
        headers: {
            'Content-Type': 'application/json',
            'Authorization': session,
            'X-API-Key': api_key,
        } as any,
    })
    const data = await res.json()

    return Response.json({ data })
}