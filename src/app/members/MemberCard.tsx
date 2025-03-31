import { calculateAge } from "@/lib/utils";

 

import {
  Card,
  CardFooter,
  Image,
} from "@heroui/react";
import { useState } from "react";

import { Member } from "@prisma/client";
import Link from "next/link";
import React from "react";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";
 


 

type Props = {
  member: MembersDto;
};
 


 

export default function MemberCard({
  member,
}: Props) {
  return (
    <Card
      fullWidth
      as={Link}
      href={`/members/${member.userId}`}
      isPressable
    >
      <Image
        isZoomed
        alt={member.name}
        width={300}
        src={member.image || "/images/user.png"}
        className="aspect-square object-cover transition-transform duration-300 hover:scale-105"
      />

      <CardFooter className="flex justify-start bg-black overflow-hidden absolute bottom-0 z-10 bg-dark-gradient p-4 rounded-lg shadow-lg">

         <div className="flex flex-col text-white">
          <span className="font-semibold">
            {member.name},{" "}
            {calculateAge(member.dateOfBirth)}
          </span>
          <span className="text-sm">
            {member.city}
          </span>
        </div>
      </CardFooter>
    </Card>
  );
}
