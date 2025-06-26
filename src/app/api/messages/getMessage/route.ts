import { getUserByEmail } from "@/app/actions/authActions";
import { getMessageThreadApi } from "@/app/actions/messageActions";
import { apiAuth, apiTokenEmail } from "@/app/middleware/apiAuth";
import { NextResponse } from "next/server";

export async function GET(request:Request){
    const authResponse = apiAuth(request);
    if (authResponse) return authResponse; // Return the response if token is invalid

    const email = apiTokenEmail(request);//Fetch email of requester
    const userData = await getUserByEmail(email); //Get details of user by email

    const url = new URL(request.url);
    const recipientId = url.searchParams.get('recipientId');

    var messages = await getMessageThreadApi(userData.id,recipientId);

    return NextResponse.json(messages);
}