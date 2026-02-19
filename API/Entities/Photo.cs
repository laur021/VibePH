using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; } = null!;
    public string? PublicId { get; set; }
    public bool IsApproved { get; set; }
    public string MemberId { get; set; } = null!;
    [JsonIgnore]
    public Member Member { get; set; } = null!;
}
