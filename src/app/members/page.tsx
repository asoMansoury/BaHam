
import { getMembers } from "../actions/membersActions";
import {fetchCurrentUserLikeIdsWith } from "../actions/likeActions";
import { LikesVm } from "../types/Likes/LikesDto";
import MembersGridClient from "./MembersGridClient";


export default async function MembersPage() {
    const members = (await getMembers()as any).data.members;
    const likeIds = ((await fetchCurrentUserLikeIdsWith() as any).data as LikesVm).likesDto.map((item) => item.targetUserId);;
    
    return <MembersGridClient members={members} likeIds={likeIds} />;
}
