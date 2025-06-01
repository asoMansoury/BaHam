class RequestDtoInvalidException extends Error {
    constructor(message = "Request body is invalid!") {
        super(message);
        this.name = "RequestDtoInvalidException";
    }
}

export default RequestDtoInvalidException;