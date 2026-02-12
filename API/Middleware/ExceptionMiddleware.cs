using System;
using System.Net;
using API.Errors;

namespace API.Middleware;

public class ExceptionMiddleware(
    RequestDelegate next,
    ILogger<ExceptionMiddleware> logger,
    IHostEnvironment env)
{
    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await next(context);
        }
        catch (Exception ex)
        {
            logger.LogError(ex, "{Message}", ex.Message);

            context.Response.StatusCode = ex switch
            {
                UnauthorizedAccessException => StatusCodes.Status401Unauthorized,
                InvalidOperationException => StatusCodes.Status400BadRequest,
                KeyNotFoundException => StatusCodes.Status404NotFound,
                _ => (int)HttpStatusCode.InternalServerError
            };

            var response = env.IsDevelopment()
                ? new ApiException(
                    context.Response.StatusCode,
                    ex.Message,
                    new { detail = ex.StackTrace?.ToString() })
                : new ApiException(context.Response.StatusCode, "Internal Server Error");

            await context.Response.WriteAsJsonAsync(response);
        }
    }
}
