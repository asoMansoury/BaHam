import { fetchTargetLikes } from "@/app/actions/likeActions";
import { apiAuth } from "@/app/middleware/apiAuth";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    const authResponse = apiAuth(request);
    if (authResponse) return authResponse; // Return the response if token is invalid

    // Extract userId from query parameters
    const url = new URL(request.url);
    const userId = url.searchParams.get('userId');

    const members = await fetchTargetLikes(userId);
    return NextResponse.json(members);
}