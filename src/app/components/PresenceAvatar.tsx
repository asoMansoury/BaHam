import React from 'react'
import usePresenceStore from '../hooks/usePresenceStore';
import { Avatar, Badge } from '@heroui/react';

type PresenceAvatarProps = {
    userId?:string;
    src?:string|null;
};
export default function PresenceAvatar({
    userId,
    src
}:PresenceAvatarProps) {
    const membersId = usePresenceStore(state => state.membersId);

    const isOnline =userId && membersId.indexOf(userId)!==-1;


  return (
   <Badge
    content=""
    color='success'
    shape='circle'
    isInvisible={!isOnline}
   >
    <Avatar
        src={src || "/images/user.png"}
        alt='Image of member'
    ></Avatar>
   </Badge>
  )
}
