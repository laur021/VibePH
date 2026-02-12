using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRespository MemberRespository { get; }
    IAccountRepository AccountRepository { get; }
    Task<bool> CompleteAsync();
    bool HasChanges();
}
