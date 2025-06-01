import { NextResponse } from 'next/server';
import RequestDtoInvalidException from './exceptions/RequestDtoInvalidException';
import UserNotSignedInException from './exceptions/UserNotSignedInException';

export function handleError(error: any) {
    console.error(error);
    if (error instanceof UserNotSignedInException) {
        return { status: 'error', error: error.message};
    }
    if(error instanceof RequestDtoInvalidException){
         return NextResponse.json(
                    { error: error.message },
                    { status: 400 }
                    );
    }
    return { status: 'error', error: 'An unexpected error occurred' };
}
