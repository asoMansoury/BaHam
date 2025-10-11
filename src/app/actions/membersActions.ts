import { auth } from '@/auth'

import {prisma} from '@/lib/prisma';

import UserNotSignedInException from '../utils/exceptions/UserNotSignedInException';
import { Photo } from '@prisma/client';
import { ActionResult, GetMemberParams, PaginatedResponse } from '@/types';
import { GetMembersDto, MembersDto } from '../types/(auth)/LoginsResponseDto';
import { addYears } from 'date-fns';
import { getAuthUserId } from './authActions';

function getAgeRange(ageRange:string):Date[]{
    const [minAge,maxAge]= ageRange.split(',');
    const currentDate = new Date();
    const minDob = addYears(currentDate,-maxAge-1);
    const maxDob = addYears(currentDate,-minAge);

    return [minDob,maxDob];
}
//this function populate all activated members 
export async function getMembers({
    ageRange='18,100',
    gender ='male,female',
    orderBy='updated',
    pageNumber='1',
    pageSize = '12',
    withPhoto = 'true'
}:GetMemberParams): Promise<PaginatedResponse<MembersDto>>{
    const session = await auth();
    if(!session.user) throw new UserNotSignedInException();

    const [minDob,maxDob] = getAgeRange(ageRange);
    const selectedGender = gender.split(',');
    const page = parseInt(pageNumber);
    const limit = parseInt(pageSize);
    const skip = (page-1)*limit;

    const memberSelect = {
        where:{
            AND:[
                {dateOfBirth:{gte:minDob}},
                {dateOfBirth:{lte:maxDob}},
                {gender:{in:selectedGender}},
                ...(withPhoto ==='true'?[{image:{not:null}}]:[])
            ],
            NOT:{
                userId:session.user.id
            },
            is_active:true
        }
    }

    const count = await prisma.member.count(memberSelect);
    var members = await prisma.member.findMany({
        ...memberSelect,
        orderBy:{[orderBy]:'desc'},
        skip,
        take:limit
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
    
    return { 
        items:bodyResponse.members,
        totalCount:count
    }
}

//this function populate all activated members 
export async function getMembersUI(){
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
    
    return bodyResponse;
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
    const currentUserId = await getAuthUserId();

    const member =await prisma.member.findUnique({
        where:{userId,is_active:true},
        select:{photos:{where:currentUserId===userId?{}:{isApproved:true}}}
    });

    if(member) null ;

    return member.photos.map(p=>p) as Photo[];
}

export async function updateLastActive(){
    const session = await auth();
    if(!session.user) throw new UserNotSignedInException();

    return prisma.member.update({
        where:{userId:session.user.id},
        data:{updated:new Date()}
    });
}
