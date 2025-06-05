import { NextResponse } from 'next/server';
import { getUserImages } from '@/app/actions/userActions';
import { apiAuth, apiTokenEmail } from '@/app/middleware/apiAuth';
import { getUserByEmail } from '@/app/actions/authActions';

export async function GET(request: Request) {
    const authResponse = apiAuth(request);
    if (authResponse) return authResponse;

    const email = apiTokenEmail(request);//Fetch email of requester
    const userData = await getUserByEmail(email); //Get details of user by email

    const result = await getUserImages(userData.id);

    if (result.status === 'error') {
        return NextResponse.json({ message: result.error }, { status: 404 });
    }

    return NextResponse.json({ images: result.data });
}
