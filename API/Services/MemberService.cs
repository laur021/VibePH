using System;
using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class MemberService(AppDbContext context) : IMemberService
{
    public async Task<IReadOnlyList<AppUser>> GetMemberListAsync()
    {
        return await context.Users.ToListAsync();
    }

    public async Task<AppUser?> GetMemberByIdAsync(string id)
    {
        return await context.Users.FindAsync(id);
    }
}
