import { getMemberByUserId } from '@/app/actions/membersActions'
import { notFound } from 'next/navigation';
import React from 'react'

type MemberDetailedPageProps = {
  params: { memberId: string }
}

export default async function MemberDetailedPage({ params }: MemberDetailedPageProps) {
  var bodyParam = await params;
  const member = (await getMemberByUserId(bodyParam.memberId) as any)?.data;

  if (!member) return notFound();

  return (
    <>
      {member.name} This is the member detail page
    </>
  );
}
