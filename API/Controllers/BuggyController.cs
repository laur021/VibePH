using System;
using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class BuggyController : BaseApiController
{
    [HttpGet("auth")]
    public ActionResult<ApiResponse<object?>> GetAuth()
    {
        return ErrorResponse("You are not authorized to access this resource.", StatusCodes.Status401Unauthorized);
    }

    [HttpGet("not-found")]
    public ActionResult<ApiResponse<object?>> GetNotFound()
    {
        return ErrorResponse("The requested resource was not found.", StatusCodes.Status404NotFound);
    }

    [HttpGet("server-error")]
    public IActionResult GetServerError()
    {
        throw new Exception("This is a server error.");
    }

    [HttpGet("bad-request")]
    public ActionResult<ApiResponse<object?>> GetBadRequest()
    {
        return ErrorResponse("Not a good request.", StatusCodes.Status400BadRequest);
    }
}
