import { BaseResponseDto } from "../BaseResponseDto";

export type LoginResponseDto =BaseResponseDto &  {
    token:string;
}

export type RegisterResponseDto =BaseResponseDto &  {
    name:string;
    email:string;
    id:string;
}

export type MembersDto =BaseResponseDto & {
    id: string,
    userId: string,
    name: string,
    gender: string,
    dateOfBirth: Date,
    description: string,
    city: string,
    country: string,
    image: string,

}

export type GetMembersDto=BaseResponseDto & {
    members:MembersDto[]
}