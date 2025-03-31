
export class BaseResponseDto {
    isSucceed: boolean;
    message: string;

    constructor(isSucceed: boolean=true, message: string="Operation completed") {
        this.isSucceed = isSucceed;
        this.message = message;
    }
}



