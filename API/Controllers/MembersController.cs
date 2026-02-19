using System.Security.Claims;
using API.DTOs;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class MembersController(IUnitOfWork uow) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<Member>>>> GetMemberList()
        {
            var members = await uow.MemberRespository.GetMemberListAsync();
            return SuccessResponse(members, "Members retrieved successfully");
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Member>>> GetMember(string id)
        {
            var member = await uow.MemberRespository.GetMemberByIdAsync(id);

            if (member is null)
                return ErrorResponse<Member>("Member not found.", StatusCodes.Status404NotFound);

            return SuccessResponse(member, "Member retrieved successfully");
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<Photo>>>> GetMemberPhotos(string id)
        {
            var photos = await uow.MemberRespository.GetMemberPhotosAsync(id);

            if (photos is null || !photos.Any())
                return ErrorResponse<IReadOnlyList<Photo>>("No photos found for this member.", StatusCodes.Status404NotFound);

            return SuccessResponse(photos, "Member photos retrieved successfully");
        }
        [HttpPut]
        public async Task<ActionResult<ApiResponse<object?>>> UpdateMember(MemberUpdateDto memberUpdateDto)
        {
            var memberId = User.GetMemberId();

            if (memberId is null)
                return ErrorResponse("Could not get member.", StatusCodes.Status400BadRequest);

            var member = await uow.MemberRespository.GetMemberForUpdate(memberId);

            if (member is null)
                return ErrorResponse("Could not get member.", StatusCodes.Status404NotFound);

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            uow.MemberRespository.Update(member); //optional

            if (!await uow.CompleteAsync())
                return ErrorResponse("Failed to update member.", StatusCodes.Status500InternalServerError);

            return SuccessResponse<object?>(null, "Profile updated successfully!", StatusCodes.Status200OK);

        }

    }
}
