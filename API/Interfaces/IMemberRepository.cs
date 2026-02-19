using System;
using API.Entities;

namespace API.Interfaces;

public interface IMemberRespository
{
    void Update(Member member);
    Task<IReadOnlyList<Member>> GetMemberListAsync();
    Task<Member?> GetMemberByIdAsync(string id);
    Task<IReadOnlyList<Photo>> GetMemberPhotosAsync(string memberId);
    Task<Member?> GetMemberForUpdate(string id);
}
