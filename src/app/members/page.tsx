
import { getMembers } from "../actions/membersActions";
import {fetchCurrentUserLikeIdsWith } from "../actions/likeActions";
import { LikesVm } from "../types/Likes/LikesDto";
import MembersGridClient from "./MembersGridClient";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function MembersPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
     const params = await searchParams;
    const {items:members,totalCount} = (await getMembers(params));
    const likeIds = ((await fetchCurrentUserLikeIdsWith() as any).data as LikesVm).likesDto.map((item) => item.targetUserId);;
    
    return <MembersGridClient totalCount={totalCount} members={members} likeIds={likeIds} />;
}
