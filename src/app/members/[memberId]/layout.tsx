import { getMemberByUserId } from "@/app/actions/membersActions";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@heroui/react";

type LayoutProps = {
    children:ReactNode;
    params:{memberId:string}
};
export default async function Layout({
    children,
    params
}:LayoutProps){
    const awaitedParams = await params;
    const member = (await getMemberByUserId(awaitedParams.memberId) as any).data;

    const basePath = `/members/${awaitedParams.memberId}`;
    const navLinks = [
        { name: "Profile", href: `${basePath}` },
        {
          name: "Photos",
          href: `${basePath}/photos`,
        },
        { name: "Chat", href: `${basePath}/chat` },
      ];

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
