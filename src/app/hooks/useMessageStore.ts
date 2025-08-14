"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { MessageDto } from "../types/Messages/MessageDto"

type MessageState = {
    messages: MessageDto[];
    undreadCount: number;
    add:(message:MessageDto)=>void;
    remove:(messageId:string)=>void;
    set:(messages:MessageDto[])=>void;
    updateUnreadCount:(count:number)=>void;
}

const useMessageStore = create<MessageState>()(
    devtools(
        (set) => ({
            messages: [],
            undreadCount: 0,
            add: (message) => set((state) => ({ messages: [...state.messages, message] })),
            remove: (messageId) => set((state) => ({
                messages: state.messages.filter((m) => m.id !== messageId)
            })),
            set: (messages) => set({ messages }),
            updateUnreadCount: (count) => set({ undreadCount: count }),
        }),
        { name: 'messageStoreDemo' }    
    )
);

export default useMessageStore;