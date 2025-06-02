import { getMemberByUserId } from '@/app/actions/membersActions'
import { notFound } from 'next/navigation';
import React from 'react'

type MemberDetailedPageProps = {
  params: { userId: string }
}

export default async function MemberDetailedPage({ params }: MemberDetailedPageProps) {
  const member = (await getMemberByUserId(params.userId) as any)?.data;

  if (!member) return notFound();

  return (
    <>
      {member.name} This is the member detail page
    </>
  );
}
