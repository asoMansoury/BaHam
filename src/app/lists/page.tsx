"use client";

import React from 'react'
import { fetchCurrentUserLikeIds, fetchCurrentUserLikeIdsWith, fetchLikedMembers } from '../actions/likeActions'
import { getAuthUserId } from '../actions/authActions';
import ListsTab from './ListsTab';
import { LikesVm } from '../types/Likes/LikesDto';

export type searchParams = {
  type:string
}
export default async function ListPage({
  type
}:searchParams) {
    const userId = await getAuthUserId();
  const likeIdsVM =((await fetchCurrentUserLikeIds(userId) as any).data as LikesVm);
  const membersVm = (await fetchLikedMembers(type,userId) as any).data as LikesVm;

  const likeIds=likeIdsVM.likesDto.filter(t=>t.targetUserId).map(item=>{return item.targetUserId});
  return (
    <div>
      <ListsTab
        members={membersVm.members}
        likeIds={likeIds}
      >

      </ListsTab>
    </div>
  )
}
