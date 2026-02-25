using System;
using API.Data;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class MemberRepository(AppDbContext context) : IMemberRespository
{
    public async Task<Member?> GetMemberByIdAsync(string id)
    {
        return await context.Members.FindAsync(id);
    }

    public async Task<Member?> GetMemberForUpdate(string id)
    {
        return await context.Members
            .Include(x => x.User)
            .Include(x => x.Photos)
            .SingleOrDefaultAsync(x => x.Id == id);
    }

    public async Task<PaginatedResult<Member>> GetMemberListAsync(MemberParams memberParams)
    {
        var query = context.Members.AsQueryable(); // Deferred execution

        // Exclude current user
        query = query.Where(x =>
            x.Id != memberParams.CurrentMemberId);

        // Filter by gender (if provided)
        if (!string.IsNullOrEmpty(memberParams.Gender))
        {
            query = query.Where(x => x.Gender == memberParams.Gender);
        }

        // Oldest acceptable DOB (based on max age)
        var minDob = DateOnly.FromDateTime(
            DateTime.Today.AddYears(-memberParams.MaxAge - 1)
        );

        // Youngest acceptable DOB (based on min age)
        var maxDob = DateOnly.FromDateTime(
            DateTime.Today.AddYears(-memberParams.MinAge)
        );

        // Apply sorting based on OrderBy parameter
        query = memberParams.OrderBy switch
        {
            "created" => query.OrderByDescending(x => x.Created),     // newest members first
            _ => query.OrderByDescending(x => x.LastActive)           // default: most recently active
        };


        query = query.Where(x =>
            x.DateOfBirth >= minDob &&
            x.DateOfBirth <= maxDob
        );

        return await PaginationHelper.CreateAsync(
            query,
            memberParams.PageNumber,
            memberParams.PageSize
        );
    }

    public async Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId)
    {
        return await context.Members
            .Where(m => m.Id == memberId)
            .SelectMany(m => m.Photos)
            .ToListAsync();
    }

    public void Update(Member member)
    {
        context.Entry(member).State = EntityState.Modified;
    }
}
