using API.Errors;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Route("api/[controller]")]
[ApiController]
public class BaseApiController : ControllerBase
{
    protected ActionResult<ApiResponse<T>> SuccessResponse<T>(
        T data,
        string message = "Request successful",
        int statusCode = StatusCodes.Status200OK)
    {
        var response = ApiResponse<T>.SuccessResult(data, message, statusCode);
        return StatusCode(statusCode, response);
    }

    protected ActionResult<ApiResponse<object?>> ErrorResponse(
        string message,
        int statusCode,
        object? errors = null)
    {
        var response = ApiResponse<object?>.ErrorResult(message, statusCode, errors);
        return StatusCode(statusCode, response);
    }

    protected ActionResult<ApiResponse<T>> ErrorResponse<T>(
        string message,
        int statusCode,
        object? errors = null)
    {
        var response = ApiResponse<T>.ErrorResult(message, statusCode, errors);
        return StatusCode(statusCode, response);
    }
}
