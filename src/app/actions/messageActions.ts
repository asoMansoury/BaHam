'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/MessageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import {prisma} from '@/lib/prisma';
import { mapMessageToMessageDto, MessageDto, MessageVM } from "../types/Messages/MessageDto";

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


export async function getMessageThread(recipientId:string):Promise<MessageDto[]>{
    const userId = await getAuthUserId();

    var result:Message[] = [];
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

    return messages.map((message)=>mapMessageToMessageDto(message));
}

export async function getMessagesByContainer(container:string){
    const userId = await getAuthUserId();

    const outboxConditions = {senderId:userId,senderDeleted:false}
    const inboxConditions = {recipientId:userId,recipientDeleted:false}

    const conditions = container === 'outbox' ? outboxConditions:inboxConditions;
    
    // {
    //     [container === 'outbox' ? 'senderId':'recipientId']:userId,
    //     ...(container === 'outbox' ? {senderDeleted:false} :{ recipientDeleted:false})
    // }

    const messages = await prisma.message.findMany({
        where:conditions,
        orderBy:{
            created:'desc'
        },
        select:{
            id:true,
            text:true,
            created:true,
            dateRead:true,
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

    return messages.map(message=>mapMessageToMessageDto(message));
}


export async function deleteMessage(messageId:string,isOutbox:boolean){
    const selector = isOutbox ? 'senderDeleted':'recipientDeleted';

    const userId =await getAuthUserId();

    await prisma.message.update({
        where:{id:messageId},
        data:{
            [selector]:true
        }
    });

    const messagesToDelete =await prisma.message.findMany({
        where:{
            OR:[
                {
                    senderId:userId,
                    senderDeleted:true,
                    recipientDeleted:true
                },
                {
                    recipientId:userId,
                    senderDeleted:true,
                    recipientDeleted:true
                }
            ]
        }
    });

    if(messagesToDelete.length > 0){
        await prisma.message.deleteMany({
            where:{
                OR:messagesToDelete.map(m=>({id:m.id}))
            }
        })
    }  
}

export async function deleteMessageApi(userId:string,messageId:string,isOutbox:boolean):Promise<ActionResult<MessageVM>>{
    const selector = isOutbox ? 'senderDeleted':'recipientDeleted';

    await prisma.message.update({
        where:{id:messageId},
        data:{
            [selector]:true
        }
    });

    const messagesToDelete =await prisma.message.findMany({
        where:{
            OR:[
                {
                    senderId:userId,
                    senderDeleted:true,
                    recipientDeleted:true
                },
                {
                    recipientId:userId,
                    senderDeleted:true,
                    recipientDeleted:true
                }
            ]
        }
    });

    if(messagesToDelete.length > 0){
        await prisma.message.deleteMany({
            where:{
                OR:messagesToDelete.map(m=>({id:m.id}))
            }
        })
    }  

        return { 
            status: 'success', 
            data:  {} as MessageVM  
        }
}