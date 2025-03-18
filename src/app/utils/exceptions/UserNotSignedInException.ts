class UserNotSignedInException extends Error {
    constructor(message = "User is not signed in") {
        super(message);
        this.name = "UserNotSignedInException";
    }
}

export default UserNotSignedInException;
