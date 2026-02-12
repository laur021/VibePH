namespace API.Errors;

public class ApiResponse<T>(
    bool success,
    int statusCode,
    string message,
    T? data = default,
    object? errors = null)
{
    public bool Success { get; init; } = success;
    public int StatusCode { get; init; } = statusCode;
    public string Message { get; init; } = message;
    public T? Data { get; init; } = data;
    public object? Errors { get; init; } = errors;
    public DateTime Timestamp { get; init; } = DateTime.UtcNow;

    public static ApiResponse<T> SuccessResult(T data, string message = "Request successful", int statusCode = 200)
    {
        return new ApiResponse<T>(true, statusCode, message, data);
    }

    public static ApiResponse<T> ErrorResult(string message, int statusCode, object? errors = null)
    {
        return new ApiResponse<T>(false, statusCode, message, default, errors);
    }
}
