// src/app/components/MembersGridClient.tsx
"use client";

import MemberCard from "./MemberCard";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";

type Props = {
  members: MembersDto[];
  likeIds: string[];
};

export default function MembersGridClient({ members, likeIds }: Props) {
  return (
    <div className="mt-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-8">
      {members.map((member) => (
        <MemberCard key={member.id} member={member} likeIds={likeIds} />
      ))}
    </div>
  );
}