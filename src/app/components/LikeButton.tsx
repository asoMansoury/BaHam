"use client";

import { useRouter } from "next/navigation";
import { toggleLikeMember } from "../actions/likeActions";
import { getAuthUserId } from "../actions/authActions";
import { useEffect, useState } from "react";
import {
    AiFillHeart,
    AiOutlineHeart,
  } from "react-icons/ai";
type LikeButtonProps = {
    targetId:string;
    hasLiked:boolean;
};


export default function LikeButton({
    targetId,
    hasLiked,
}:LikeButtonProps){
    const [userId,setUserId] = useState<string>();
    const router = useRouter();
    useEffect(() => {
        const fetchUserId = async () => {
            const userId = await getAuthUserId();
            setUserId(userId);
        };
        fetchUserId();
    }, []);
    
    async function toggleLike(){
        const toggleUserFunc = async () => {
             await toggleLikeMember(targetId,hasLiked,userId);
        };
        toggleUserFunc();
    }

    return (
        <div
            onClick={toggleLike}
            className="relative hover:opacity-80 transition cursor-pointer"
        >
            <AiOutlineHeart
                size={28}
                className="fill-white absolute -top-[2px] -right-[2px]"
            >
                <AiFillHeart
                    size={24}
                    className={
                        hasLiked
                        ? "fill-rose-500"
                        : "fill-neutral-500/70"
                    }
                ></AiFillHeart>
            </AiOutlineHeart>
        </div>
    )
}