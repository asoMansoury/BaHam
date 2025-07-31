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
    const [isOnline,setIsOnline] = useState(false);
    const { membersId } = usePresenceStore(
    (state) => ({
      membersId: state.membersId,
    })
  );

    useEffect(() => {
        const isOnline = membersId.indexOf(member.id)!==-1;
        setIsOnline(isOnline);
        },[membersId])

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

