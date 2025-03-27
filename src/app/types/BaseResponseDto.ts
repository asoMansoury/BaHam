export type BaseResponseDto<T = undefined> = {
    isSuccess:true | false;
    message: 'Succeeded' | 'Failed';
    body?:T;
}



