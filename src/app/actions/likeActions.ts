'use server';

import { prisma } from '../../lib/prisma';
import { ActionResult } from "@/types";
import { LikesDto, LikesVm } from "../types/Likes/LikesDto";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";
import { getAuthUserId } from "./authActions";
import { pusherServer } from '@/lib/pusher';

export async function toggleLikeMember(targetUserId:string,isLiked:boolean,userId:string): Promise<ActionResult<LikesVm>>{

    if(isLiked){
        await prisma.like.delete({
            where:{
                sourceUserId_targetUserId:{
                    sourceUserId:userId,
                    targetUserId
                }
            }
        })
    } else {
       var like =  await prisma.like.create({
            data:{
                sourceUserId:userId,
                targetUserId
            },
            select:{
                sourceMember:{
                    select:{
                        id:true,
                        name:true,
                        userId:true,
                        image:true
                    }
                }
            }
        });
        
        await pusherServer.trigger(`private-${targetUserId}`, 'like:new', {
            image: like.sourceMember.image,
            name: like.sourceMember.name,
            userId:like.sourceMember.userId
        });
    }

    return { status: 'success', data: {} as LikesVm  }
}

export async function fetchCurrentUserLikeIds(userId:string): Promise<ActionResult<LikesVm>>{
    const likeIds = await prisma.like.findMany({
        where:{
            sourceUserId:userId,
            
        },
        select:{
            targetUserId:true
        }
    });

    var result  =  likeIds.map(like=>{
        return {
           targetUserId: like.targetUserId,
           sourceUserId:userId
        } as LikesDto
    });

    return { status: 'success', 
        data:  {
        likesDto:result
    } as LikesVm  
}
}

export async function fetchCurrentUserLikeIdsWith(): Promise<ActionResult<LikesVm>>{
    const userId = await getAuthUserId();
    
    const likeIds = await prisma.like.findMany({
        where:{
            sourceUserId:userId,
            
        },
        select:{
            targetUserId:true
        }
    });

    var result  =  likeIds.map(like=>{
        return {
           targetUserId: like.targetUserId,
           sourceUserId:userId
        } as LikesDto
    });

    return { status: 'success', data:  {
        likesDto:result
    } as LikesVm  
}
}

export async function fetchCurrentUserLikeIdsWithUI(){
    const userId = await getAuthUserId();
    
    const likeIds = await prisma.like.findMany({
        where:{
            sourceUserId:userId,
            
        },
        select:{
            targetUserId:true
        }
    });

    var result  =  likeIds.map(like=>{
        return {
           targetUserId: like.targetUserId,
           sourceUserId:userId
        } as LikesDto
    });

    return {
        likesDto:result
    } as LikesVm  
}


export async function fetchSourceLikes(userId:string):Promise<ActionResult<LikesVm>>{
    const sourceList = await prisma.like.findMany({
        where:{sourceUserId:userId},
        select:{targetMember:true}
    })

    var members = sourceList.map(t=>t.targetMember).map((item)=>{
        return {
            id:item.id,
            name:item.name,
            userId:item.userId,
            gender:item.gender,
            city:item.city,
            country:item.country,
            dateOfBirth:item.dateOfBirth,
            description:item.description,
            image:item.image
            
        } as MembersDto
    });
    return { 
        status: 'success', 
        data:  {members:members} as LikesVm  
    }
}

export async function fetchTargetLikes(userId:string):Promise<ActionResult<LikesVm>>{
    const sourceList = await prisma.like.findMany({
        where:{targetUserId:userId},
        select:{sourceMember:true}
    })

    var members = sourceList.map(t=>t.sourceMember).map((item)=>{
        return {
            id:item.id,
            name:item.name,
            userId:item.userId,
            gender:item.gender,
            city:item.city,
            country:item.country,
            dateOfBirth:item.dateOfBirth,
            description:item.description,
            image:item.image
            
        } as MembersDto
    });
    return { 
        status: 'success', 
        data:  {members:members} as LikesVm  
    }
}

export async function fetchMutualLikes(userId:string):Promise<ActionResult<LikesVm>>{
    const likedUsers = await prisma.like.findMany({
        where:{sourceUserId:userId},
        select:{targetUserId:true}
    });
    const likedIds= likedUsers.map(x=>x.targetUserId);
    const mutualList = await prisma.like.findMany({
        where:{
            AND:{
                targetUserId:userId,
                sourceUserId:{in:likedIds}
            }
        },
        select:{sourceMember:true}
    });
    var members = mutualList.map(t=>t.sourceMember).map((item)=>{
        return {
            id:item.id,
            name:item.name,
            userId:item.userId,
            gender:item.gender,
            city:item.city,
            country:item.country,
            dateOfBirth:item.dateOfBirth,
            description:item.description,
            image:item.image
            
        } as MembersDto
    });

    return { 
        status: 'success', 
        data:  {members:members} as LikesVm  
    }
}
export async function fetchLikedMembers(type='source',userId:string):Promise<ActionResult<LikesVm>>{
    switch(type){
            case 'source':
                return await fetchSourceLikes(userId);
                case 'target':
                    return await fetchTargetLikes(userId);
                    case 'mutual':
                        return await fetchMutualLikes(userId);
            default:

            return { 
                status: 'success', 
                data:  {members:[]} as LikesVm  
            }
    }
}