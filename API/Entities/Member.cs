using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Member
{
    public string Id { get; set; } = null!;
    public DateOnly DateOfBirth { get; set; }
    public string? ImageUrl { get; set; }
    public required string DisplayName { get; set; } = null!;
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public required string Gender { get; set; } = null!;
    public string? Description { get; set; }
    public required string City { get; set; } = null!;
    public string Country { get; set; } = null!;

    // Navigation property (one-to-one relationship with AppUser)
    //
    // [ForeignKey(nameof(Id))]
    // - Tells EF that Member.Id is also the foreign key
    // - This creates a shared primary key relationship
    // - Member.Id == AppUser.Id
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;
    public ICollection<Photo> Photos { get; set; } = [];

}
