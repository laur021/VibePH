using System;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data.Repository;

public class UnitOfWork(AppDbContext context, ITokenService tokenService) : IUnitOfWork
{
    private IMemberRespository? _memberRepository;
    private IAccountRepository? _accountRepository;
    private ILikeRepository? _likeRepository;
    public IMemberRespository MemberRepository => _memberRepository
        ??= new MemberRepository(context);

    public IAccountRepository AccountRepository => _accountRepository
        ??= new AccountRepository(context, tokenService);

    public ILikeRepository LikeRepository => _likeRepository
        ??= new LikeRepository(context);

    public async Task<bool> CompleteAsync()
    {
        try
        {
            return await context.SaveChangesAsync() > 0;
        }
        catch (DbUpdateException ex)
        {
            throw new Exception("An error occured while saving changes", ex);
        }
    }

    public bool HasChanges()
    {
        return context.ChangeTracker.HasChanges();
    }
}
