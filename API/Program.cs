using API.Data;
using API.Interfaces;
using API.Services;
using Microsoft.EntityFrameworkCore;

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

var app = builder.Build();

//resolve the cors issue
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.MapControllers();

app.Run();
