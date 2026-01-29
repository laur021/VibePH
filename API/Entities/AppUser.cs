namespace API.Entities;

public class AppUser
{
    // Primary key stored as a string GUID
    public string Id { get; set; } = Guid.NewGuid().ToString();
    // Required ensures this value must be provided
    public required string DisplayName { get; set; }
    // Required ensures this value must be provided
    public required string Email { get; set; }

}
