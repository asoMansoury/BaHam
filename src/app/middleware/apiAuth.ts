import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

export function apiAuth(req) {
    // Extract bearer token from the Authorization header
    const token = req.headers.get('Authorization')?.split(' ')[1];
    
    // Validate the token
    if (token) {
        try {
            jwt.verify(token, process.env.JWT_SECRET); // Replace with your secret
        } catch (error) {
            return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
        }
    } else {
        return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
    }

    // Removed NextResponse.next() to comply with app routing conventions
}
