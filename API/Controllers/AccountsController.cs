using System;
using System.Security.Cryptography;
using System.Text;
using API.DTOs;
using API.Entities;
using API.Errors;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class AccountsController(IAccountRepository accountService) : BaseApiController
{
    [HttpPost("register")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Register(RegisterDto registerDto)
    {
        var user = await accountService.RegisterAsync(registerDto);
        return SuccessResponse(user, "User registered successfully");
    }

    [HttpPost("login")]
    public async Task<ActionResult<ApiResponse<UserDto>>> Login(LoginDto loginDto)
    {
        var user = await accountService.LoginAsync(loginDto);
        return SuccessResponse(user, "Login successful");
    }
}
