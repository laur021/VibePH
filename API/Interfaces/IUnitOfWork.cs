using System;

namespace API.Interfaces;

public interface IUnitOfWork
{
    IMemberRespository MemberRepository { get; }
    IAccountRepository AccountRepository { get; }
    ILikeRepository LikeRepository { get; }
    IMessageRepository MessageRepository { get; }
    Task<bool> CompleteAsync();
    bool HasChanges();
}
