// src/app/components/MembersGridClient.tsx
"use client";

import MemberCard from "./MemberCard";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";
import PaginationComponent from "../components/PaginationComponent";

type Props = {
  members: MembersDto[];
  likeIds: string[];
  totalCount:number;
};

export default function MembersGridClient({ members, likeIds ,totalCount}: Props) {
  return (
    <>
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} likeIds={likeIds} />
      ))}
    </div>
    <PaginationComponent totalCount={totalCount}></PaginationComponent>
    </>
  );
}