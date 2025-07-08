import { BaseResponseDto } from "../BaseResponseDto";
import { MessageDto } from "./MessageDto";

export type MessageVm = BaseResponseDto & {
    messages:MessageDto[],
    message:MessageDto
}