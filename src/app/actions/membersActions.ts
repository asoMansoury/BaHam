import { auth } from '@/auth'

import {prisma} from '@/lib/prisma';

import UserNotSignedInException from '../utils/exceptions/UserNotSignedInException';
import { Photo } from '@prisma/client';
import { ActionResult } from '@/types';
import { BaseResponseDto } from '../types/BaseResponseDto';
import { MembersDto } from '../types/(auth)/LoginsResponseDto';

//this function populate all activated members 
export async function getMembers(): Promise<ActionResult<BaseResponseDto<MembersDto[]>>>{
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

    var bodyResponse = {
        isSuccess:true,
        message: 'Succeeded',
        body:members as any
    } as BaseResponseDto<MembersDto[]>;
    
    return { status: 'success', data: bodyResponse }
}

export async function getMemberByUserId(userId:string): Promise<ActionResult<BaseResponseDto<MembersDto>>>{
    var member =await prisma.member.findUnique({where:{userId, is_active:true}});

    const result = {
        isSuccess: true,
        message: 'Succeeded',
        body:{
            id:member.id,
            name:member.name,
            description:member.description,
            gender:member.gender,
            image:member.image,
            city:member.city,
            country:member.country,
            dateOfBirth:member.dateOfBirth,
            userId:member.userId
        }
    } as BaseResponseDto<MembersDto>
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
