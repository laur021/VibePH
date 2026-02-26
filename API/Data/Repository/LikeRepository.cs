using System;
using API.Entities;
using API.Helpers;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class LikeRepository(AppDbContext context) : ILikeRepository
{
    public void AddLike(MemberLike like)
    {
        context.Likes.Add(like);
    }

    public void DeleteLike(MemberLike like)
    {
        context.Likes.Remove(like);
    }

    public async Task<IReadOnlyList<string>> GetCurrentMemberLikeIds(string memberId)
    {
        return await context.Likes
            .Where(x => x.SourceMemberId == memberId)
            .Select(x => x.TargetMemberId)
            .ToListAsync();
    }

    public async Task<MemberLike?> GetMemberLike(string sourceMemberId, string targetMemberId)
    {
        return await context.Likes.FindAsync(sourceMemberId, targetMemberId);
    }

    public async Task<PaginatedResult<Member>> GetMemberLikes(LikeParams likeParams)
    {
        var query = context.Likes.AsQueryable();
        IQueryable<Member> result;

        switch (likeParams.Predicate)
        {
            case "liked":
                result = query
                    .Where(like => like.SourceMemberId == likeParams.MemberId)
                    .Select(like => like.TargetMember);
                break;
            case "likedBy":
                result = query
                    .Where(like => like.TargetMemberId == likeParams.MemberId)
                    .Select(like => like.SourceMember);
                break;
            default: // mutual
                var likeIds = await GetCurrentMemberLikeIds(likeParams.MemberId);

                result = query
                    .Where(x => x.TargetMemberId == likeParams.MemberId
                        && likeIds.Contains(x.SourceMemberId))
                    .Select(x => x.SourceMember);
                break;
        }

        return await PaginationHelper.CreateAsync(result,
            likeParams.PageNumber, likeParams.PageSize);
    }
}
