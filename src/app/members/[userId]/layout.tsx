import { getMemberByUserId } from "@/app/actions/membersActions";
import { ReactNode } from "react";
import MemberSidebar from "../MemberSidebar";
import { Card } from "@heroui/react";

type LayoutProps = {
    children:ReactNode;
    params:{userId:string}
};
export default async function Layout({
    children,
    params
}:LayoutProps){
    const member = await getMemberByUserId(params.userId);

    return (
        <div className="grid grid-cols-12 gap-5 h-[80vh]">
            <div className="col-span-3">
                <MemberSidebar member={member} />
            </div>
            <div className="col-span-9">
                <Card className="w-full mt-10 h-[80vh]">
                    {children}
                </Card>
            </div>
        </div>
    )
}