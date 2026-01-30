using System;
using API.DTOs;
using API.Entities;

namespace API.Interfaces;

public interface IAccountService
{
    Task<UserDto> RegisterAsync(RegisterDto registerDto);
    Task<UserDto> LoginAsync(LoginDto loginDto);
}
