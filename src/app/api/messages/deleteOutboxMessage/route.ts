import { getUserByEmail } from "@/app/actions/authActions";
import { deleteMessageApi } from "@/app/actions/messageActions";
import { apiAuth, apiTokenEmail } from "@/app/middleware/apiAuth";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    const authResponse = apiAuth(request);
    if (authResponse) return authResponse; // Return the response if token is invalid

    const email = apiTokenEmail(request);//Fetch email of requester
    const userData = await getUserByEmail(email); //Get details of user by email

        // Extract userId from query parameters
    const url = new URL(request.url);
    const messageId = url.searchParams.get('messageId');

    var result =  await deleteMessageApi(userData.id,messageId,true);

    return NextResponse.json(result);
}