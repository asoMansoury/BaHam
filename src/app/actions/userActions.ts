'use server'

import { memberEditSchema, MemberEditSchema } from "@/lib/schemas/MemberEditSchema";
import { ActionResult } from "@/types";
import { getAuthUserId } from "./authActions";
import { prisma } from "@/lib/prisma";
import { Member, User } from "@prisma/client";
import { MemberVm } from "../types/Members/MemberVM";
import { EditProfileRequestDto } from "../types/Api/Request/Member/EditProfile";

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