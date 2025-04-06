import { toggleLikeMember } from "@/app/actions/likeActions";
import { apiAuth } from "@/app/middleware/apiAuth";
import { likedMemberSchema } from "@/lib/members/LikedMemberSchemas";
import { NextResponse } from "next/server";

export async function POST(request:Request){
    const authResponse = apiAuth(request); // Use the new middleware for token validation
    if (authResponse) return authResponse; // Return the response if token is invalid

    const body = await request.json();
    const validated = likedMemberSchema.safeParse(body);

    if (!validated.success) {
      return NextResponse.json(
        { error: 'Invalid request body' },
        { status: 400 }
      );
    }
    var params = validated.data;
    const members = await toggleLikeMember(params.targetUserId,params.isLiked,params.userId);
    return NextResponse.json(members);
}