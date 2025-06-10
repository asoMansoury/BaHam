import { auth } from '@/auth'

import {prisma} from '@/lib/prisma';

import UserNotSignedInException from '../utils/exceptions/UserNotSignedInException';
import { Photo } from '@prisma/client';
import { ActionResult } from '@/types';
import { GetMembersDto, MembersDto } from '../types/(auth)/LoginsResponseDto';

//this function populate all activated members 
export async function getMembers(): Promise<ActionResult<GetMembersDto>>{
    const session = await auth();
    if(!session.user) throw new UserNotSignedInException();

    var members = await prisma.member.findMany({
        where:{
            NOT:{
                userId:session.user.id
            },
            is_active:true
        }
    });
    var mapped = members.map((item)=>{
        var result:MembersDto = {
            id:item.id,
            userId:item.userId,
            name:item.name,
            description:item.description,
            gender:item.gender,
            city:item.city,
            country:item.country,
            dateOfBirth:item.dateOfBirth,
            image:item.image,
            isSucceed:true,
            message:"operation completed"
        };
        return result
    })

    var bodyResponse = {
        members:mapped
    } as GetMembersDto;
    
    return { status: 'success', data: bodyResponse }
}

export async function getMemberByUserId(userId:string): Promise<ActionResult<MembersDto>>{
    var member =await prisma.member.findUnique({where:{userId:userId, is_active:true}});
    const result = {
        id:member.id,
        name:member.name,
        description:member.description,
        gender:member.gender,
        image:member.image,
        city:member.city,
        country:member.country,
        dateOfBirth:member.dateOfBirth,
        userId:member.userId
    } as MembersDto
    return { status: 'success', data: result }
}



export async function getMemberPhotoNyUserId(userId:string){
    const member =await prisma.member.findUnique({
        where:{userId,is_active:true},
        select:{photos:true}
    });

    if(member) null ;

    return member.photos.map(p=>p) as Photo[];
}
