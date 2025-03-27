import { NextResponse } from 'next/server';
import { getMemberByUserId } from '@/app/actions/membersActions';
import { apiAuth } from '@/app/middleware/apiAuth'; // Import the new API auth middleware

export async function GET(request: Request) {
    const authResponse = apiAuth(request); // Use the new middleware for token validation
    if (authResponse) return authResponse; // Return the response if token is invalid

    // Extract userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    if (!userId) {
        return NextResponse.json({ message: 'User ID is required' }, { status: 400 });
    }

    const member = await getMemberByUserId(userId);
    return NextResponse.json(member);
}
