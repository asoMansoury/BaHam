import { MembersDto } from "../(auth)/LoginsResponseDto";
import { BaseResponseDto } from "../BaseResponseDto";


export type LikesVm = BaseResponseDto & {
    likesDto:LikesDto[],
    members:MembersDto[]

}
export type LikesDto =  {
    sourceUserId:string;
    targetUserId:string;
}