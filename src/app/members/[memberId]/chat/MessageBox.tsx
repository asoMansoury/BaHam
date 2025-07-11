"use client";

import { MessageDto } from "@/app/types/Messages/MessageDto"
import { Avatar } from "@heroui/react";
import { useEffect, useRef } from "react";
import clsx from "clsx";
import { timeAgo } from "@/app/utils/util";
type MessageBoxProps = {
    message:MessageDto,
    currentUserId:string
}

export default function MessageBox({
    message,
    currentUserId
}:MessageBoxProps){
  const isCurrentUserSender =
    message.senderId === currentUserId;

  const messageEndRef =
    useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messageEndRef.current)
      messageEndRef.current.scrollIntoView({
        behavior: "smooth",
      });
  }, [messageEndRef]);

  const renderAvatar = () => (
    <Avatar
      name={message.senderName}
      className="self-end"
      src={
        message.senderImage || "/images/user.png"
      }
    />
  );

  const messageContentClasses = clsx(
    "flex flex-col w-[50%] px-2 py-1",
    {
      "rounded-l-xl rounded-tr-xl text-white bg-blue-100":
        isCurrentUserSender,
      "rounded-r-xl rounded-tl-xl border-gray-200 bg-green-100":
        !isCurrentUserSender,
    }
  );

  const renderMessageHeader = () => (
    <div
      className={clsx(
        "flex items-center w-full",
        {
          "justify-between": isCurrentUserSender,
        }
      )}
    >
      {message.dateRead &&
      message.recipientId !== currentUserId ? (
        <span className="text-xs text-black text-italic">
          (Read {timeAgo(message.dateRead?.toString())}) 
        </span>
      ) : (
        <div></div>
      )}
      <div className="flex">
        <span className="text-sm font-semibold text-gray-900">
          {message.senderName}
        </span>
      <span className="text-sm text-gray-500 ml-2">
        {message.created ? new Date(message.created).toDateString() : ""}
      </span>
      </div>
    </div>
  );

  const renderMessageContent = () => {
    return (
      <div className={messageContentClasses}>
        {renderMessageHeader()}
        <p className="text-sm py-3 text-gray-900">
          {message.text}
        </p>
      </div>
    );
  };

  return (
    <div className="grid grid-rows-1">
      <div
        className={clsx("flex gap-2 mb-3", {
          "justify-end text-right":
            isCurrentUserSender,
          "justify-start": !isCurrentUserSender,
        })}
      >
        {!isCurrentUserSender && renderAvatar()}
        {renderMessageContent()}
        {isCurrentUserSender && renderAvatar()}
      </div>
      <div ref={messageEndRef} />
    </div>
  );
}