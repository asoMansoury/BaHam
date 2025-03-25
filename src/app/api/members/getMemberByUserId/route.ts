import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMemberByUserId } from '@/app/actions/membersActions';

export async function GET(request: Request, { params }: { params: { username: string } }) {

    const session = await auth();
    
    if (!session.user) {
        return NextResponse.json({ error: 'User not signed in' }, { status: 401 });
    }

    const member = await getMemberByUserId(params.username);

    
    if (!member) {
        return NextResponse.json({ error: 'Member not found' }, { status: 404 });
    }

    return NextResponse.json(member);
}
