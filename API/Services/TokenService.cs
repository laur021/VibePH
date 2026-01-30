using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using API.Entities;
using API.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace API.Services;

public class TokenService(IConfiguration config) : ITokenService
{
    public string CreateToken(AppUser user)
    {
        var tokenKey = config["TokenKey"]
            ?? throw new Exception("Cannot get token key from configuration");

        if (tokenKey.Length < 64)
            throw new Exception("Token key must be at least 64 characters long");

        //Converts the secret string into a byte array, Symmetric = same key signs and validates tokens
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(tokenKey));

        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString())
        };

        //Signing credentials specify the key and the algorithm used to sign the token
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

        //Combines all token configuration in one place
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = creds
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        //builds the token
        var token = tokenHandler.CreateToken(tokenDescriptor);
        //converts it to a string
        return tokenHandler.WriteToken(token);
    }
}
