using System;
using System.ComponentModel.DataAnnotations.Schema;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; } = null!;
    public string? PublicId { get; set; }
    public Member Member { get; set; } = null!;
    public string MemberId { get; set; } = null!;
}
