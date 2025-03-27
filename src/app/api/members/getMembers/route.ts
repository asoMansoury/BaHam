import { NextResponse } from 'next/server';
import { getMembers } from '@/app/actions/membersActions';
import { apiAuth } from '@/app/middleware/apiAuth'; // Import the new API auth middleware

export async function GET(request: Request) {
    const authResponse = apiAuth(request); // Use the new middleware for token validation
    if (authResponse) return authResponse; // Return the response if token is invalid

    const members = await getMembers();
    return NextResponse.json(members);
}
