'use server'

import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/MemberEditSchema";
import { ActionResult } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { Member, Photo, User } from "@prisma/client";
import { MemberVm } from "../types/Members/MemberVM";
import { EditProfileRequestDto } from "../types/Api/Request/Member/EditProfile";
import { cloudinary } from "@/lib/cloudinary";

export async function updateMemberProfile(data:MemberEditSchema,nameUpdated:boolean):Promise<ActionResult<Member>>{

    const userId = await getAuthUserId();

    const validated = memberEditSchema.safeParse(data);
    if(!validated.success) 
        return {status:'error' , error:validated.error.errors}

    const {name,description,city,country} = validated.data;

    if(nameUpdated){
        await prisma.user.update({
            where:{id:userId},
            data:{name}
        })
    }

    const member = await prisma.member.update({
        where: { userId },
        data:{
            name,
            description,
            city,
            country
        }
    });
    return {status:'success',data:member}
}

export async function updateMemberProfileFunc(data:EditProfileRequestDto,user:User):Promise<ActionResult<MemberVm>>{
        
    const {name,description,city,country} = data;

    if(user.name!=name){
        await prisma.user.update({
            where:{id:user.id},
            data:{name}
        })
    }

    const member = await prisma.member.update({
        where: { userId:user.id },
        data:{
            name,
            description,
            city,
            country
        }
    });

    return { 
        status: 'success', 
        data:  {} as MemberVm  
    };
}

export async function addImage(url:string,publicId:string){
    const userId = await getAuthUserId();

    return prisma.member.update({
        where: { userId },
        data:{
            photos:{
                create:[
                    {
                        url,
                        publicId
                    }
                ]
            }
        }
    })
}

export async function addImageApi(url:string,publicId:string,userId:string){
    return prisma.member.update({
        where: { userId },
        data:{
            photos:{
                create:[
                    {
                        url,
                        publicId
                    }
                ]
            }
        }
    })
}

export async function setMainImage(photo:Photo){

    if(!photo.isApproved) throw new Error("Photo not approved");
    const userId = await getAuthUserId();

    await prisma.user.update({
        where:{id:userId},
        data:{image:photo.url}
    });

    return prisma.member.update({
        where: { userId },
        data:{image:photo.url}
    });
}

export async function setMainImageForApi(photo:Photo,userId:string){

    await prisma.user.update({
        where:{id:userId},
        data:{image:photo.url}
    });

    return prisma.member.update({
        where: { userId },
        data:{image:photo.url}
    });
}


export async function deleteImage(photo:Photo){
    const userId = await getAuthUserId();

    if(photo.publicId)
        await cloudinary.v2.uploader.destroy(photo.publicId);

    return prisma.member.update({
        where:{userId},
        data:{
            photos:{
                delete:{id:photo.id}
            }
        }
    })
}

export async function getUserImages(userId: string) {
    const memberWithPhotos = await prisma.member.findUnique({
        where: { userId },
        select: {
            photos: {
                select: {
                    url: true,
                    publicId: true,
                    id: true
                }
            }
        }
    });

    if (!memberWithPhotos) {
        return { status: 'error', error: 'User not found' };
    }

    return { status: 'success', data: memberWithPhotos.photos };
}

export async function getUserImageById(photoId: string) {
    const photo = await prisma.photo.findUnique({
        where: { id: photoId },
        select: {
            id: true,
            url: true,
            publicId: true,
            memberId: true
        }
    });

    if (!photo) {
        return { status: 'error', error: 'Photo not found' };
    }

    return { status: 'success', data: photo };
}

