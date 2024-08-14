class ApiErrors extends Error{
    constructor(message="something went wrong", status, errors=[]){
        super(message);
        this.message=message;
        this.status=status;
        this.errors=errors;
        this.success=false;
        this.data=null;

    }
}

export {ApiErrors}