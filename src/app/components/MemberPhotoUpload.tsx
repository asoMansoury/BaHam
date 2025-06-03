"use client"

import { CloudinaryUploadWidgetResults } from "next-cloudinary"
import ImageUploadButton from "./ImageUploadButton";
import { addImage } from "../actions/userActions";
import { useSearchParams,useRouter, usePathname } from "next/navigation";
import { toast } from "react-toastify";

export default function MemberPhotoUpload(){
    const router = useRouter();
    const onAddImage = async(
        result:CloudinaryUploadWidgetResults
    ) =>{
        if(result.info &&
            typeof result.info === "object"
        )
        {
            await addImage(result.info.secure_url,
                result.info.public_id
            );
            router.refresh();
        }else{
            toast.error("problem adding image");
        }
    };

    return (
        <div>
            <ImageUploadButton
        onUploadImage={onAddImage}
      />
        </div>
    )
}