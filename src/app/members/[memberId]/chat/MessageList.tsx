"use client";

import { MessageDto } from "@/app/types/Messages/MessageDto";
import { useCallback, useEffect, useState } from "react";
import MessageBox from "./MessageBox";
import { pusherClient } from "@/lib/pusher";
import { formatShortDateTime } from "@/lib/utils";

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
    const  [messages, setMessages] = useState(initialMessage);
    
    const handleNewMessage = useCallback(
        (message: MessageDto) => {

        setMessages((prevMessages) => [...prevMessages, message]);
    },[]);

  const handleReadMessages = useCallback(
    (messageIds: string[]) => {
      setMessages((prevState) =>
        prevState.map((message) =>
          messageIds.includes(message.id)
            ? {
                ...message,
                dateRead: new Date(),
              }
            : message
        )
      );
    },
    []
  );
    
    useEffect(() => {
        const channel = pusherClient.subscribe(chatId);
        channel.bind("message:new", handleNewMessage);
        channel.bind("message:read", handleReadMessages);
        return () => {
            channel.unbind("message:new", handleNewMessage);
            channel.unbind("message:read", handleReadMessages);
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
