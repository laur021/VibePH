using System;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using API.DTOs;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class Seed
{
    public static async Task SeedUsers(AppDbContext context)
    {
        // If users already exist, stop execution
        if (await context.Users.AnyAsync()) return;

        // Read JSON file as string
        var memberData = await File.ReadAllTextAsync("Data/UserSeedData.json");

        // Deserialize JSON into DTO list
        var members = JsonSerializer.Deserialize<List<SeedUserDto>>(memberData);

        // Guard clause if deserialization fails
        if (members == null)
        {
            Console.WriteLine("No members in seed data");
            return;
        }

        // Used to create password hash + salt
        using var hmac = new HMACSHA512();

        foreach (var member in members)
        {
            var user = new AppUser
            {
                Id = member.Id,
                Email = member.Email,
                DisplayName = member.DisplayName,
                ImageUrl = member.ImageUrl,

                // Hash password (all demo users share same password)
                PasswordHash = hmac.ComputeHash(
                    Encoding.UTF8.GetBytes("Pa$$W0rd")
                ),
                PasswordSalt = hmac.Key,

                // Create related Member (one-to-one)
                Member = new Member
                {
                    Id = member.Id,
                    DisplayName = member.DisplayName,
                    Description = member.Description,
                    DateOfBirth = member.DateOfBirth,
                    ImageUrl = member.ImageUrl,
                    Gender = member.Gender,
                    City = member.City,
                    Country = member.Country,
                    LastActive = member.LastActive,
                    Created = member.Created
                }
            };

            // Add related Photo (one-to-many)
            user.Member.Photos.Add(new Photo
            {
                Url = member.ImageUrl!, // Seed data guarantees value
                MemberId = member.Id
            });

            context.Users.Add(user); // Track entity in memory
        }

        await context.SaveChangesAsync(); // Persist to database
    }
}
