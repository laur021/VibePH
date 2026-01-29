using System;
using API.Entities;

namespace API.Interfaces;

public interface IMemberService
{
    Task<IReadOnlyList<AppUser>> GetMemberListAsync();
    Task<AppUser?> GetMemberByIdAsync(string id);
}
