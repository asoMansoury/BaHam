import { prisma } from "@/lib/prisma";
import { getUserRole } from "./authActions";
import { Photo, Role } from "@prisma/client";
import { image } from "@heroui/react";
import { cloudinary } from "@/lib/cloudinary";

export async function getUnapprovedPhotos(){

    const role = await getUserRole();

    if(role !== Role.ADMIN) throw new Error("Forbidden");

    return prisma.photo.findMany({
        where:{isApproved:false},
    });


}

export async function approvePhoto(photoId:string){
    const role = await getUserRole();

    if(role !== Role.ADMIN) throw new Error("Forbidden");

    const photo = await prisma.photo.findUnique({
        where:{id:photoId},
        include:{member:{include:{user:true}}}
    });

    if(!photo || !photo.member || !photo.member.user) throw new Error("Photo or member not found");

    const {member} = photo;
    
    const userUpdate = member.user && member.user.image === null ? {image:photo.url} : {};
    const memberUpdate = member.image === null ? {image: photo.url} : {};

    if(Object.keys(userUpdate).length > 0){
        await prisma.user.update({
            where:{id:member.user.id},
            data:userUpdate
        });
    }

    return prisma.member.update({
        where:{id:member.id},
        data:{
            ...memberUpdate,
            photos:{
                update:{
                    where:{id:photo.id},
                    data:{isApproved:true}
                }
            }
        }
    })

}

export async function rejectPhoto(photo:Photo){
    const role = await getUserRole();
    if(role !== Role.ADMIN) throw new Error("Forbidden");

    if(photo.publicId){
        await cloudinary.v2.uploader.destroy(photo.publicId, {resource_type: "image"});
    }

    return prisma.photo.delete({
        where:{id:photo.id}
    });
}