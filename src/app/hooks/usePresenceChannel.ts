import { useCallback, useEffect, useRef } from "react";
import usePresenceStore from "./usePresenceStore";
import { Channel, Members } from "pusher-js";
import { pusherClient } from "@/lib/pusher";
import { updateLastActive } from "../actions/membersActions";
export const usePresenceChannel = () => {
    const set = usePresenceStore((state) => state.set);
    const add = usePresenceStore((state) => state.add);
    const remove = usePresenceStore((state) => state.remove);

    const channelRef = useRef<Channel | null>(null);

    const handleSetMembers = useCallback((members: string[]) => {
        console.log("Members set:", members);
        set(members);
    }, [set]);

    const handleAddMember = useCallback((memberId: string) => {
        console.log("Member added:", memberId);
        add(memberId);
    }, [add]);

    const handleRemoveMember = useCallback((memberId: string) => {
        console.log("Member removed:", memberId);
        remove(memberId);
    }, [remove]);

    useEffect(() => {

        if (typeof window === "undefined") return;

        if (!channelRef.current) {
            channelRef.current = pusherClient.subscribe("presence-match-me");

            channelRef.current.bind("pusher:subscription_succeeded",async (members: Members) => {
                handleSetMembers(Object.keys(members.members));
                await updateLastActive();
            });


            channelRef.current.bind("pusher:member_added", (member: Record<string, any>) => {
                handleAddMember(member.id);
            });

            channelRef.current.bind("pusher:member_removed", (member: Record<string, any>) => {
                handleRemoveMember(member.id);
            });
        }

        return () => {
            if (channelRef.current) {
                channelRef.current.unsubscribe();
                channelRef.current.unbind("pusher:subscription_succeeded", handleSetMembers);
                channelRef.current.unbind("pusher:member_added", handleAddMember);
                channelRef.current.unbind("pusher:member_removed", handleRemoveMember);
            }
        };
    }, [handleAddMember, handleRemoveMember, handleSetMembers]);
};
