import { ZodIssue } from "zod";

type ActionResult<T> = 
{status:'success', data:T} | {status:'error',error:string|ZodIssue[]}


type UserFilters = {
    ageRange:number[];
    gender:string[];
    orderBy:string;
    withPhoto:boolean;
};

type PaginatedResponse<T> = {
    items:T[];
    totalCount:number;
}

type PagingParams = {
    pageNumber:number;
    pageSize:number;
}

type PagingResult = {
    totalPages:number;
    totalCount:number;
} & PagingParams;

type GetMemberParams = {
    ageRange?:string;
    gender?:string;
    orderBy?:string;
    withPhoto?:string;
    pageNumber?:string;
    pageSize?:string;
}
