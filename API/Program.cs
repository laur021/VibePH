using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    // Configure Entity Framework to use SQLite
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
//resolve the cors issue
builder.Services.AddCors();
builder.Services.AddScoped<IMemberService, MemberService>();
builder.Services.AddScoped<IAccountService, AccountService>();
builder.Services.AddScoped<ITokenService, TokenService>();
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        // Read symmetric key from configuration
        var tokenKey = builder.Configuration["TokenKey"]
            ?? throw new InvalidOperationException("TokenKey is not configured - Program.cs");

        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,  // Ensure token was issued by this server
            IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(tokenKey)), // Same encoding as token creation
            ValidateIssuer = false,   // Skipped in development
            ValidateAudience = false // Skipped in development
        };
    });

var app = builder.Build();

//resolve the cors issue
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
