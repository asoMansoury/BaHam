import { BaseResponseDto } from "../BaseResponseDto";

export type LoginResponseDto =  {
    token:string;
}

export type RegisterResponseDto =  {
    name:string;
    email:string;
    id:string;
}

export type MembersDto = {
    id: string,
    userId: string,
    name: string,
    gender: string,
    dateOfBirth: Date,
    email:string;
    description: string,
    city: string,
    country: string,
    image: string,

}
