"use client";

import { MessageDto } from "@/app/types/Messages/MessageDto";
import { useCallback, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";

type MessageListProps = {
    initialMessage : MessageDto[];
    currentUserId: string;
    chatId: string;
};

export default function MessageList({
    initialMessage,
    currentUserId,
    chatId
}: MessageListProps) {
    const  [messages, setMessages] = useState<MessageDto[]>(initialMessage);
    
    const handleNewMessage = useCallback(
        (message: MessageDto) => {

        setMessages((prevMessages) => [...prevMessages, message]);
    },[]);
    
    useEffect(() => {
        const channel = pusherClient.subscribe(chatId);
        channel.bind("message:new", handleNewMessage);

        return () => {
            channel.unbind("message:new", handleNewMessage);
            pusherClient.unsubscribe(chatId);
        };
    },[chatId]);
    
    return (
        <div>
            {messages.length === 0 ? (
                "No messages to display"
            ) : (
                <div>
                    {messages.map((message) => (
                        <MessageBox
                            key={message.id}
                            currentUserId={currentUserId}
                            message={message}
                        ></MessageBox>
                    ))}
                </div>
            )}
        </div>
    );
}