namespace API.Errors;

public class ApiException(int statusCode, string message, object? errors = null)
    : ApiResponse<object?>(false, statusCode, message, null, errors)
{
}
