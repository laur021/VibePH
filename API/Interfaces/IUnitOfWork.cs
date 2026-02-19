using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRespository MemberRepository { get; }
    IAccountRepository AccountRepository { get; }
    Task<bool> CompleteAsync();
    bool HasChanges();
}
