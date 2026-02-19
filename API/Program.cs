using API.Data;
using API.Data.Repository;
using API.Errors;
using API.Helpers;
using API.Interfaces;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.InvalidModelStateResponseFactory = context =>
    {
        var validationErrors = context.ModelState
            .Where(x => x.Value?.Errors.Count > 0)
            .ToDictionary(
                kvp => kvp.Key,
                kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray());

        var response = ApiResponse<object?>.ErrorResult(
            "Validation failed.",
            StatusCodes.Status400BadRequest,
            validationErrors);

        return new BadRequestObjectResult(response);
    };
});
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "API", Version = "v1" });

    var securityScheme = new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Description = "Enter your token.",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT"
    };

    options.AddSecurityDefinition("Bearer", securityScheme);
    options.AddSecurityRequirement(document => new OpenApiSecurityRequirement
    {
        [new OpenApiSecuritySchemeReference("Bearer", document, null)] = new List<string>()
    });
});
builder.Services.AddDbContext<AppDbContext>(opt =>
{
    // Configure Entity Framework to use SQLite
    opt.UseSqlite(builder.Configuration.GetConnectionString("DefaultConnection"));
});
//resolve the cors issue
builder.Services.AddCors();
builder.Services.AddScoped<IMemberRespository, MemberRepository>();
builder.Services.AddScoped<IAccountRepository, AccountRepository>();
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
builder.Services.AddScoped<IPhotoService, PhotoService>();
builder.Services.Configure<CloudinarySettings>(builder.Configuration
    .GetSection("CloudinarySettings"));
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

        options.Events = new JwtBearerEvents
        {
            OnChallenge = async context =>
            {
                context.HandleResponse();

                var response = ApiResponse<object?>.ErrorResult(
                    "Unauthorized.",
                    StatusCodes.Status401Unauthorized);

                context.Response.StatusCode = StatusCodes.Status401Unauthorized;
                await context.Response.WriteAsJsonAsync(response);
            },
            OnForbidden = async context =>
            {
                var response = ApiResponse<object?>.ErrorResult(
                    "Forbidden.",
                    StatusCodes.Status403Forbidden);

                context.Response.StatusCode = StatusCodes.Status403Forbidden;
                await context.Response.WriteAsJsonAsync(response);
            }
        };
    });

var app = builder.Build();

app.UseSwagger(options =>
{
    options.RouteTemplate = "swagger/{documentName}/swagger.json";
});
app.UseSwaggerUI(options =>
{
    // Serve Swagger UI at application root
    options.RoutePrefix = string.Empty;
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "API v1");
});
app.UseMiddleware<ExceptionMiddleware>();
//resolve the cors issue
app.UseCors(x => x
    .AllowAnyHeader()
    .AllowAnyMethod()
    .AllowCredentials()
    .WithOrigins("http://localhost:4200", "https://localhost:4200"));

app.UseAuthentication();
app.UseAuthorization();
app.UseStatusCodePages(async context =>
{
    var response = context.HttpContext.Response;

    if (response.StatusCode != StatusCodes.Status404NotFound)
    {
        return;
    }

    var payload = ApiResponse<object?>.ErrorResult(
        "The requested resource was not found.",
        StatusCodes.Status404NotFound);

    await response.WriteAsJsonAsync(payload);
});

app.MapControllers();

// Create service scope (Service Locator pattern)
using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;

try
{
    // Resolve DbContext manually (no DI in Program.cs)
    var context = services.GetRequiredService<AppDbContext>();

    // Apply pending migrations & create DB if missing
    await context.Database.MigrateAsync();

    // Seed users
    await Seed.SeedUsers(context);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "An error occurred during migration");
}


app.Run();
