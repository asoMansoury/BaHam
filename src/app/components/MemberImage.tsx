"use client";

import { Button, Image } from "@heroui/react";
import { Photo, Role } from "@prisma/client";
import clsx from "clsx";
import { CldImage } from "next-cloudinary";
import React from "react";
import { useRole } from "../hooks/useRoles";
import { approvePhoto, rejectPhoto } from "../actions/adminActions";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";


type Props = {
  photo: Photo | null;
};

export default function MemberImage({
  photo,
}: Props) {
  if(!photo) return null;
  const role = useRole();
  const router = useRouter();

  const approve = async(photoId:string)=>{
    try{
      await approvePhoto(photoId);
      router.refresh();
    }catch(error){
      toast.error(error?.message || "Something went wrong");
    }
  }

  const reject = async(photo:Photo)=>{
    try{
      await rejectPhoto(photo); // Temporarily using approvePhoto, replace with rejectPhoto when implemented
      router.refresh();
    }catch(error){
      toast.error(error?.message || "Something went wrong");
    }   
  }
  return (
    <div>
      {photo?.publicId ? (
        <CldImage
          alt="Image of member"
          src={photo.publicId}
          width={300}
          height={300}
          crop="fill"
          gravity="faces"
          className={clsx("rounded-2xl",{
            "opacity-40":!photo.isApproved && role != Role.ADMIN
          })}
          priority
        />
      ) : (
        <Image
          src={photo?.url || "/images/user.png"}
          alt="Image of user"
        />
      )}
      {!photo?.isApproved && role != Role.ADMIN && (
        <div className="absolute bottom-2 w-full bg-slate-200 p-1">
          <div className="flex justify-center text-danger font-semibold">
            Awaiting Approval
          </div>
        </div>
      )}

      {
        role === Role.ADMIN && (
          <div className="flex flex-row gap-2 mt-2">
            <Button
              onPress={()=>approve(photo!.id)}
              color="success"
              variant="bordered"
              fullWidth
            >
              Approve
            </Button>
            <Button
              onPress={()=>reject(photo!)}
              color="danger"
              variant="bordered"
              fullWidth
            ></Button>
        </div>
        ) 
      }

    </div>
  );
}