import { Photo } from "@prisma/client";

import { useState } from "react";
import MemberImage from "./MemberImage";
import StarButton from "./StarButton";
import DeleteButton from "./DeleteButton";
import { useRouter } from "next/navigation";
import { deleteImage, setMainImage } from "../actions/userActions";
import { toast } from "react-toastify";

type MemberPhotosProps = {
    photos: Photo[] | null;
    editing?:boolean;
    mainImageUrl?:string | null;
}

export default function MemberPhotos({
    photos,
    editing,
    mainImageUrl
}:MemberPhotosProps){
    const router = useRouter();
    const [loading,setLoading] = useState({
        type:"",
        isLoading:false,
        id:""
    })

    const onSetMain = async(photo:Photo)=>{
        if(photo.url === mainImageUrl) return;
        setLoading({type:"main",isLoading:true,id:photo.id});
        try{
            await setMainImage(photo);
            router.refresh();
        }catch(err){
            toast.error(err.message || "Something went wrong");
        }finally{
            setLoading({type:"",isLoading:false,id:""});
        }
    }

    const onDelete = async (photo:Photo)=>{
        if(photo.url === mainImageUrl) {
            toast.error("Cannot delete main photo");
            return;
        }
        setLoading({type:"delete",isLoading:true,id:photo.id});
        await deleteImage(photo);
        router.refresh();
        setLoading({type:"",isLoading:false,id:""});
    }
    return (
        <div className="grid grid-col-5 gap-3 p-5">
            {photos &&
                photos.map((photo)=>(
                    <div
                        key={photo.id}
                        className="relative"
                    >
                        <MemberImage photo={photo}></MemberImage>
                        {
                            editing &&(
                                <>
                                    <div onClick={()=>onSetMain(photo)}
                                        className="absolute top-3 left-3 z-50">
                                            <StarButton selected={photo.url===mainImageUrl}
                                                        loading={
                                                            loading.isLoading &&
                                                            loading.type ==="main" &&
                                                            loading.id === photo.id
                                                        }
                                            ></StarButton>
                                    </div>
                                    <div
                                        onClick={()=>onDelete(photo)}
                                        className="absolute top-3 right-3 z-50"
                                    >
                                        <DeleteButton
                                            loading={
                                                loading.isLoading &&
                                                loading.type ==="delete" &&
                                                loading.id === photo.id
                                            }
                                        ></DeleteButton>
                                    </div>
                                </>
                            )
                        }
                    </div>
                ))
            }
        </div>
    )
}