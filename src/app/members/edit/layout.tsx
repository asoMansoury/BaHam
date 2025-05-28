import { getMemberByUserId } from "@/app/actions/membersActions";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@heroui/react";
import { getAuthUserId } from "@/app/actions/authActions";
import { notFound } from "next/navigation";

type LayoutProps = {
    children:ReactNode;
};
export default async function Layout({
    children,
}:LayoutProps){
    const userId = (await getAuthUserId());
    const member = (await getMemberByUserId(userId) as any).data;
    if(!member) return notFound();

    const basePath = "/members/edit";
    const navLinks = [
        {name:"Edit Profile",href:`${basePath}`},
        {name:"Update Photos",href:`${basePath}/photos`}
    ]

    return (
        <div className="grid grid-cols-12 gap-5 h-[80vh]">
            <div className="col-span-3">
                <MemberSidebar member={member} navLinks={navLinks}/>
            </div>
            <div className="col-span-9">
                <Card className="w-full mt-10 h-[80vh]">
                    {children}
                </Card>
            </div>
        </div>
    )
}