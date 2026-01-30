using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IAccountService
{
    Task<AppUser> RegisterAsync(RegisterDto registerDto);
}
