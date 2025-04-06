import Link from "next/link";
import { getMembers } from "../actions/membersActions";
import MemberCard from "./MemberCard";
import {fetchCurrentUserLikeIdsWith } from "../actions/likeActions";
import { LikesDto, LikesVm } from "../types/Likes/LikesDto";
export default async function MembersPage() {
    const members = (await getMembers()as any).data.members;
    const likeIds = ((await fetchCurrentUserLikeIdsWith() as any).data as LikesVm);
    
    return (
        <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
        {members &&
          members.map((member) => (
            <MemberCard
              member={member}
              key={member.id}
              likeIds={likeIds.likesDto.map((item)=>item.targetUserId)}
            />
          ))}
      </div>
    );
}
