import { Photo } from "@prisma/client";
import { useRouter } from "next/router";
import { useState } from "react";
import MemberImage from "./MemberImage";
import StarButton from "./StarButton";
import DeleteButton from "./DeleteButton";

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
        console.log("On set main is clicked");
    }

    const onDelete = async (photo:Photo)=>{
        console.log("onDelete is clicked");
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