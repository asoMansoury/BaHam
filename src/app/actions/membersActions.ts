import { auth } from '@/auth'

import {prisma} from '@/lib/prisma';

import UserNotSignedInException from '../utils/exceptions/UserNotSignedInException';
import { Photo } from '@prisma/client';

//this function populate all activated members 
export async function getMembers(){
    const session = await auth();
    if(!session.user) throw new UserNotSignedInException();

    return prisma.member.findMany({
        where:{
            NOT:{
                userId:session.user.id
            },
            is_active:true
        }
    })
}

export async function getMemberByUserId(userId:string){
    return prisma.member.findUnique({where:{userId, is_active:true}});
}


export async function getMemberPhotoNyUserId(userId:string){
    const member =await prisma.member.findUnique({
        where:{userId,is_active:true},
        select:{photos:true}
    });

    if(member) null ;

    return member.photos.map(p=>p) as Photo[];
}
