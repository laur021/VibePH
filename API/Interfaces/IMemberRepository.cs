using System;
using API.Entities;
using API.Helpers;

namespace API.Interfaces;

public interface IMemberRespository
{
    void Update(Member member);
    Task<PaginatedResult<Member>> GetMemberListAsync(PagingParams pagingParams);
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}
