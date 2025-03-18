import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMembers } from '@/app/actions/membersActions';

export async function GET(request: Request) {
    console.log("hello");
    const session = await auth();
    
    if (!session.user) {
        return NextResponse.json({ error: 'User not signed in' }, { status: 401 });
    }

    const members = await getMembers();
    
    return NextResponse.json(members);
}
