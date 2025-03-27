import { NextResponse } from 'next/server';
import { getMemberByUserId } from '@/app/actions/membersActions';
import jwt from 'jsonwebtoken';
import { apiAuth } from '@/app/middleware/apiAuth';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
    const authResponse = apiAuth(request); // Use the new middleware for token validation
    if (authResponse) return authResponse; // Return the response if token is invalid

    const member = await getMemberByUserId(params.userId);
    return NextResponse.json(member);
}
