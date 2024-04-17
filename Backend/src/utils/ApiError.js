class ApiError{
    constructor(
        statusCode,message,success=false
    ){
        this.status=statusCode;
        this.message=message;
        this.success=success;
    }
}


export {ApiError}