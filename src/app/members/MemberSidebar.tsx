
"use client";

import { calculateAge } from "@/lib/utils";
import { Button, Card, CardBody, CardFooter, Divider, Image, Link } from "@heroui/react";
import { Member } from "@prisma/client"
import { usePathname } from "next/navigation";

type MemberSidebarProps = {
    member:Member;
    navLinks:{name:string,href:string}[]
}




export default function MemberSidebar({
    member,
    navLinks
}:MemberSidebarProps){
    const pathname = usePathname();
    const basePath = `/members/${member.userId}`;

     
    return (
        <Card className="w-full mt-10 items-center h-[80vh]">
            <Image
                height={200}
                width={200}
                src={member.image || "/images/user.png"}
                alt="User profile main image"
                className="rounded-full mt-6 aspect-square object-cover"
            ></Image>
            <CardBody>
                <div className="flex flex-col items-center">
                    <div className="text-2xl">
                        {member.name},{" "}
                        {calculateAge(member.dateOfBirth)}
                    </div>
                    <div className="text-sm text-neutral-500">
                        {member.city},{member.country}
                    </div>
                </div>
                <Divider className="my-3"></Divider>
                <nav className="flex flex-col p-4 ml-4 text-2xl gap-4">
                    {navLinks.map((link)=>(
                        <Link
                            href={link.href}
                            key={link.name}
                            className={`block rounded 
                                ${
                                  pathname === link.href
                                    ? "text-default"
                                    : "hover:text-default/50"
                                }`}
                        >
                            {link.name}
                        </Link>
                    ))}
                </nav>
            </CardBody>
            <CardFooter>
                <Button
                    as={Link}
                    href="/members"
                    fullWidth
                    color="default"
                    variant="bordered"
                >
                    Go back
                </Button>
            </CardFooter>
        </Card>
    )
}