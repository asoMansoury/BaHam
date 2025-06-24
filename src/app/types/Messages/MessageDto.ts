import { Message, Prisma } from "@prisma/client";
import { BaseResponseDto } from "../BaseResponseDto"
import { formatShortDateTime } from "@/lib/utils";

export type MessageVM = BaseResponseDto &{
    messageResponse: MessageDto
};

export type MessageDto = {
  id: string,
  text: string,
  created: Date,
  senderId: string | null,
  recipientId: string | null,
  dateRead: Date | null,
  senderDeleted: boolean,
  recipientDeleted: boolean,
  senderName:string,
  senderImage:string,
  recipientImage:string,
  recipientName:string
}

export type MessageWithSenderRecipient = Prisma.MessageGetPayload<{
  select:{
    id: true,
    text: true,
    created: true,
    dateRead:true,
    sender:{
      select:{userId,name,image}
    },
    recipient:{
      select:{userId,name,image}
    }
  }
}>

export function mapMessageToMessageDto(message: MessageWithSenderRecipient): MessageDto {
  return {
        id: message.id,
        text: message.text,
        created: message.created,
        dateRead: message.dateRead ? message.dateRead : null,
        senderId: message.sender?.userId,
        senderName: message.sender?.name,
        senderImage: message.sender?.image,
        recipientId: message.recipient?.userId,
        recipientImage: message.recipient?.image,
        recipientName: message.recipient?.name,
        senderDeleted:false,
        recipientDeleted:false
  } ;
}


