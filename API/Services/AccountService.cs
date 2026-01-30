using System;
using System.Security.Cryptography;
using System.Text;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class AccountService(AppDbContext context) : IAccountService
{
    public async Task<AppUser> RegisterAsync(RegisterDto registerDto)
    {

        if (await IsEmailExists(registerDto.Email))
        {
            throw new InvalidOperationException("Email already taken");
        }

        using var hmac = new HMACSHA512();

        var user = new AppUser
        {
            Email = NormalizeEmail(registerDto.Email),
            DisplayName = registerDto.DisplayName,
            PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDto.Password)),
            PasswordSalt = hmac.Key
        };

        context.Users.Add(user);
        await context.SaveChangesAsync();

        return user;
    }

    private async Task<bool> IsEmailExists(string email)
    {
        return await context.Users.AnyAsync(u => u.Email == NormalizeEmail(email));
    }

    private static string NormalizeEmail(string email)
    {
        return email.Trim().ToLower();
    }

}
