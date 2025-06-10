'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/MessageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import {prisma} from '@/lib/prisma';
import { MessageVM } from "../types/Messages/MessageDto";

export async function createMessage(recipientUserId:string,data:MessageSchema):Promise<ActionResult<Message>>{
    const userId = await getAuthUserId();
    const validated = messageSchema.safeParse(data);

    if(!validated.success) return {status:'error',error:validated.error.errors}

    const {text} = validated.data;
    const message= await prisma.message.create({
        data:{
            text,
            recipientId:recipientUserId,
            senderId:userId
        }
    });

    return {status:'success',data:message};
}

export async function createMessageApi(senderId:string,recipientUserId:string,data:MessageSchema):Promise<ActionResult<MessageVM>>{

    const validated = messageSchema.safeParse(data);

    if(!validated.success) return {status:'error',error:validated.error.errors}

    const {text} = validated.data;

    const message= await prisma.message.create({
        data:{
            text,
            recipientId:recipientUserId,
            senderId:senderId
        }
    });
    return null;
    //return {status:'success',data:message};
}


export async function getMessageThread(recipientId:string){
    const userId = await getAuthUserId();

    const messages = await prisma.message.findMany({
        where:{
            OR: [
                {
                    senderId:userId, 
                    recipientId:recipientId,
                    senderDeleted:false
                },
                {
                    senderId:recipientId,
                    recipientId:userId,
                    recipientDeleted:false
                }
            ]
        },
        orderBy:{
            created:'asc'
        },
        select:{
            id:true,
            text:true,
            created:true,
            dateRead:true,
            senderId:true,
            recipientId:true,
            sender:{
                select:{
                    userId:true,
                    name:true,
                    image:true
                }
            },
            recipient:{
                select:{
                    userId:true,
                    name:true,
                    image:true
                }
            }
        }
    });

    return messages;
}