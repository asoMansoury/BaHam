import { NextResponse } from 'next/server';
import { getUserImageById, getUserImages, setMainImage, setMainImageForApi } from '@/app/actions/userActions';
import { apiAuth, apiTokenEmail } from '@/app/middleware/apiAuth';
import { getUserByEmail } from '@/app/actions/authActions';
import { Photo } from '@prisma/client';

export async function GET(request: Request) {
    const authResponse = apiAuth(request);
    if (authResponse) return authResponse;

    const email = apiTokenEmail(request);//Fetch email of requester
    const userData = await getUserByEmail(email); //Get details of user by email

    const url = new URL(request.url);
    const photoId = url.searchParams.get('photoId');

    const photo = await getUserImageById(photoId);
    const result = await setMainImageForApi(photo.data as Photo,userData.id);


    if (photo.status === 'error') {
        return NextResponse.json({ message: photo.error }, { status: 404 });
    }

    return NextResponse.json({ images: photo.data });
}
