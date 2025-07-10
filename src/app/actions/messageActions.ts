'use server';

import { messageSchema, MessageSchema } from "@/lib/schemas/MessageSchema";
import { ActionResult } from "@/types";
import { Message } from "@prisma/client";
import { getAuthUserId } from "./authActions";
import {prisma} from '@/lib/prisma';
import { mapMessageToMessageDto, MessageDto, MessageVM } from "../types/Messages/MessageDto";
import { MessageVm } from "../types/Messages/MessageVm";
import { pusherServer } from "@/lib/pusher";
import { createChatId } from "@/lib/utils";

export async function createMessage(recipientUserId:string,data:MessageSchema):Promise<ActionResult<MessageDto>>{
    const userId = await getAuthUserId();
    const validated = messageSchema.safeParse(data);

    if(!validated.success) return {status:'error',error:validated.error.errors}

    const {text} = validated.data;
    const message= await prisma.message.create({
        data:{
            text,
            recipientId:recipientUserId,
            senderId:userId
        },
        select :messageSelect
    });

    const messageDto = mapMessageToMessageDto(message);

    await pusherServer.trigger(createChatId(userId,recipientUserId),'message:new',messageDto);
    return {status:'success',data:messageDto};
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
        },
        select :messageSelect
    });

        const messageDto = mapMessageToMessageDto(message);
        
        await pusherServer.trigger(createChatId(senderId,recipientUserId),'message:new',messageDto);
        var result = {
            message:messageDto
        } as MessageVm

        return { 
            status: 'success', 
            data:  result as any
        }
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
        select:messageSelect
    });

    if(messages.length >0 ){
        const unreadMessageIds = messages
            .filter(m=>m.dateRead === null 
                    && m.recipient?.userId === userId
                    && m.sender?.userId === recipientId)
            .map(m=>m.id);


        await prisma.message.updateMany({
            where:{
                senderId:recipientId,
                recipientId:userId,
                dateRead:null
            },
            data:{dateRead:new Date()}
        });
        
        await pusherServer.trigger(createChatId(userId,recipientId),'message:read',unreadMessageIds);
    }
    return messages.map((message)=>mapMessageToMessageDto(message));
}

export async function getMessageThreadApi(recipientId:string,userId:string):Promise<ActionResult<MessageVM>>{


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
        select:messageSelect
    });

    
    if(messages.length >0 ){
        const unreadMessageIds = messages
            .filter(m=>m.dateRead === null 
                    && m.recipient?.userId === userId
                    && m.sender?.userId === recipientId)
            .map(m=>m.id);

        await prisma.message.updateMany({
            where:{
                senderId:recipientId,
                recipientId:userId,
                dateRead:null
            },
            data:{dateRead:new Date()}
        });

        await pusherServer.trigger(createChatId(userId,recipientId),'message:read',unreadMessageIds);
    }

    var messagesResult = messages.map((message)=>mapMessageToMessageDto(message));


        var result ={
            messages:messagesResult
        } as MessageVm

        return { 
            status: 'success', 
            data:  result as any
        }
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
        select:messageSelect
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


const messageSelect = {
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