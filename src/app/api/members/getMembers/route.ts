import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { getMembers } from '@/app/actions/membersActions';
import jwt from 'jsonwebtoken';
export async function GET(request: Request) {
    console.log("hello");
    const token = request.headers.get('Authorization')?.split(' ')[1];    


    if (!token) {
        return NextResponse.json({ error: 'No token provided' }, { status: 401 });
    }


    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
        
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }


    const members = await getMembers();


    
    return NextResponse.json(members);
}
