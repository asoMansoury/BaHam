"use client";

import usePresenceStore from "../hooks/usePresenceStore";
import { GoDot, GoDotFill } from "react-icons/go";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";
import { useEffect, useState } from "react";

type PresenceDotProps = {
    member:MembersDto
};

export default function PresenceDot({
    member
}:PresenceDotProps){

//     const { membersId } = usePresenceStore(
//     (state) => ({
//       membersId: state.membersId,
//     })
//   );
    const membersId = usePresenceStore(state => state.membersId);
    const isOnline = membersId.indexOf(member.userId)!==-1;
    // if(member.userId === "cm83upvn60009w6ag4zta0lwg"){
    // console.log("member", member);  
    // console.log("membersId", membersId);
    // console.log("isOnline", isOnline);
    // }
    if(!isOnline) 
        return null;


    return (
        <>
            <GoDot
                size={36}
                className="fill-white absolute -top-[2px] -right-[2px]"
            />
            <GoDotFill
                size={32}
                className="fill-green-500 animate-pulse"
            ></GoDotFill>
        </>
    )
};

