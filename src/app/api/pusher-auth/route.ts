import { getUserByEmail } from "@/app/actions/authActions";
import { apiAuth, apiTokenEmail } from "@/app/middleware/apiAuth";
import { auth } from "@/auth";
import { pusherServer } from "@/lib/pusher";
import { NextResponse } from "next/server";

export async function POST(request:Request){

        const session = await auth();
        if (!session?.user?.id) {
            return new Response('Unauthorised', { status: 401 })
        }
        const body = await request.formData();

        const socketId = body.get('socket_id') as string;
        const channelName = body.get('channel_name') as string;
        const data = {
            user_id:session.user.id
        }

        const authPusher = pusherServer.authorizeChannel(socketId, channelName, data);
        return NextResponse.json(authPusher);
}