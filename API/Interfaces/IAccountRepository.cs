using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IAccountRepository
{
    Task<UserDto> RegisterAsync(RegisterDto registerDto);
    Task<UserDto> LoginAsync(LoginDto loginDto);
}
