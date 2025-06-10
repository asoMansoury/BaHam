import { BaseResponseDto } from "../BaseResponseDto"

export type MessageVM = BaseResponseDto &{
    messageResponse:MesageDto
};


export type MesageDto = {
  id:String ,
  text:String,
  created:Date ,
  senderId:String | null,
  recipientId:String| null,
  dateRead:Date,
  senderDeleted:Boolean,
  recipientDeleted:Boolean 
}