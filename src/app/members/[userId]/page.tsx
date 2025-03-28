import { getMemberByUserId } from '@/app/actions/membersActions'
import { notFound } from 'next/navigation';
import React from 'react'

type MemberDetailedPage = {
    params:{userId}
}
export default async function MemberDetailedPage({params}:MemberDetailedPage) {
  const member = await getMemberByUserId(params.userId);

  if(!member) return notFound();

  return <>
  {member.name} This is the member detail page
  </>
}
