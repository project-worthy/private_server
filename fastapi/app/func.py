from fastapi import HTTPException, Request

def parameter_validation(request: Request) -> None:
    if request.query_params: # parameter validation
        invalid_params = [param for param in request.query_params if param != "device_id" and param not in ["skip", "limit"]]
        if invalid_params:
            raise HTTPException(status_code=400, detail=f"Invalid query parameter(s): {', '.join(invalid_params)}")