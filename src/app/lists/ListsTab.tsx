"use client";

import { useSearchParams,useRouter, usePathname } from "next/navigation";
import { MembersDto } from "../types/(auth)/LoginsResponseDto";
import { Tab, Tabs } from "@heroui/react";
import { Key, useTransition } from "react";
import MemberCard from "../members/MemberCard";
import LoadingComponent from "../components/LoadingComponent";



 type ListsTabProps = {
    members: MembersDto[];
    likeIds:string[];
}
export default function ListsTab({
    members,
    likeIds
}:ListsTabProps){
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();
    const [isPending,startTransition] = useTransition();

    const tabs = [
        {
            id:"source",
            label:"Member I have liked",
        },
        {
            id:"target",
            label:'Members that like me',
        },
        {
            id:"taret",
            label:"Mutual likes"
        }
    ]

    function handleTabChange(key:Key){
        startTransition(()=>{
            const params =new  URLSearchParams(searchParams);
            params.set("type",key.toString());
            router.replace(
                `${pathname}?${params.toString()}`
              );
        })

    }
    return (
        <div className="flex w-full flex-col mt-10 gap-5">
            <Tabs
                aria-label="Like tabs"
                items={tabs}
                color="default"
                onSelectionChange={(key)=>
                    handleTabChange(key)
                }
            >
 
 {(item) => (


<Tab key={item.id} title={item.label}>
  {isPending ? (
    <LoadingComponent />
  ) : (
    <>
      {members.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-8">
          {members.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              likeIds={likeIds}
            />
          ))}
        </div>
      ) : (
        <div>
          No members for this filter
        </div>
      )}
    </>
  )}
</Tab>
)}
            </Tabs>
        </div>
    )
}