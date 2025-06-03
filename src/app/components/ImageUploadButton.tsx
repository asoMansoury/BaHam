"use client"

import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { HiPhoto } from "react-icons/hi2";

type ImageUploadButtonProps = {
  onUploadImage: (
    result: CloudinaryUploadWidgetResults
  ) => void;
};

export default function ImageUploadButton({
    onUploadImage
}:ImageUploadButtonProps){
    const onErrorUpload = (error:any)=>{
        console.log("error:::> ",error)
    }
    return (
        <CldUploadButton
            options={{maxFiles:1}}
            onSuccess={onUploadImage}
            signatureEndpoint={"/api/sign-image"}
            onError={onErrorUpload}
            uploadPreset={
                process.env.UPLOAD_PRESET_NAME
            }
            className={'flex items-center gap-2 border-2 border-default text-default rounded-lg py-2 px-4 hover:big-default/10'}
        >
            <HiPhoto size={28}></HiPhoto>
            Upload new image
        </CldUploadButton>
    )
}