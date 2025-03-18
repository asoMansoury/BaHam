import UserNotSignedInException from './exceptions/UserNotSignedInException';

export function handleError(error: any) {
    console.error(error);
    if (error instanceof UserNotSignedInException) {
        return { status: 'error', error: 'User is not signed in' };
    }
    return { status: 'error', error: 'An unexpected error occurred' };
}
