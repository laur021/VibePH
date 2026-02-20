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
    public class MembersController(IUnitOfWork uow, IPhotoService photoService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<Member>>>> GetMemberList()
        {
            var members = await uow.MemberRepository.GetMemberListAsync();
            return SuccessResponse(members, "Members retrieved successfully");
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<ApiResponse<Member>>> GetMember(string id)
        {
            var member = await uow.MemberRepository.GetMemberByIdAsync(id);

            if (member is null)
                return ErrorResponse<Member>("Member not found.", StatusCodes.Status404NotFound);

            return SuccessResponse(member, "Member retrieved successfully");
        }

        [HttpGet("{id}/photos")]
        public async Task<ActionResult<ApiResponse<IReadOnlyList<Photo>>>> GetMemberPhotos(string id)
        {
            var photos = await uow.MemberRepository.GetMemberPhotosAsync(id);

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

            var member = await uow.MemberRepository.GetMemberForUpdate(memberId);

            if (member is null)
                return ErrorResponse("Could not get member.", StatusCodes.Status404NotFound);

            member.DisplayName = memberUpdateDto.DisplayName ?? member.DisplayName;
            member.Description = memberUpdateDto.Description ?? member.Description;
            member.City = memberUpdateDto.City ?? member.City;
            member.Country = memberUpdateDto.Country ?? member.Country;

            member.User.DisplayName = memberUpdateDto.DisplayName ?? member.User.DisplayName;

            uow.MemberRepository.Update(member); //optional

            if (!await uow.CompleteAsync())
                return ErrorResponse("Failed to update member.", StatusCodes.Status500InternalServerError);

            return SuccessResponse<object?>(null, "Profile updated successfully!", StatusCodes.Status200OK);

        }

        [HttpPost("add-photo")]
        [Consumes("multipart/form-data")]
        public async Task<ActionResult<ApiResponse<Photo>>> AddPhoto([FromForm] PhotoUploadDto photoUploadDto)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null)
                return ErrorResponse<Photo>("Cannot update member", StatusCodes.Status400BadRequest);

            var result = await photoService.UploadPhotoAsync(photoUploadDto.File);

            if (result.Error != null)
                return ErrorResponse<Photo>(result.Error.Message, StatusCodes.Status400BadRequest);

            var photo = new Photo
            {
                Url = result.SecureUrl.AbsoluteUri,
                PublicId = result.PublicId,
                MemberId = User.GetMemberId(),
                IsApproved = true
            };

            if (member.ImageUrl == null)
            {
                member.ImageUrl = photo.Url;
                member.User.ImageUrl = photo.Url;
            }

            member.Photos.Add(photo);

            if (await uow.CompleteAsync())
                return SuccessResponse(photo, "Photo added successfully");

            return ErrorResponse<Photo>("Problem adding photo", StatusCodes.Status400BadRequest);
        }

        [HttpPut("set-main-photo/{photoId}")]
        public async Task<ActionResult<ApiResponse<object?>>> SetMainPhoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null)
                return ErrorResponse("Cannot get member from token", StatusCodes.Status400BadRequest);

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (member.ImageUrl == photo?.Url || photo == null)
            {
                return ErrorResponse("Cannot set this as main image", StatusCodes.Status400BadRequest);
            }

            member.ImageUrl = photo.Url;
            member.User.ImageUrl = photo.Url;

            if (await uow.CompleteAsync())
                return SuccessResponse<object?>(null, "Main photo updated successfully");

            return ErrorResponse("Problem setting main photo", StatusCodes.Status400BadRequest);
        }

        [HttpDelete("delete-photo/{photoId}")]
        public async Task<ActionResult<ApiResponse<object?>>> DeletePhoto(int photoId)
        {
            var member = await uow.MemberRepository.GetMemberForUpdate(User.GetMemberId());

            if (member == null)
                return ErrorResponse("Cannot get member from token", StatusCodes.Status400BadRequest);

            var photo = member.Photos.SingleOrDefault(x => x.Id == photoId);

            if (photo == null || photo.Url == member.ImageUrl)
            {
                return ErrorResponse("This photo cannot be deleted", StatusCodes.Status400BadRequest);
            }

            if (photo.PublicId != null)
            {
                var result = await photoService.DeletePhotoAsync(photo.PublicId);
                if (result.Error != null)
                    return ErrorResponse(result.Error.Message, StatusCodes.Status400BadRequest);
            }

            member.Photos.Remove(photo);

            if (await uow.CompleteAsync())
                return SuccessResponse<object?>(null, "Photo deleted successfully");

            return ErrorResponse("Problem deleting the photo", StatusCodes.Status400BadRequest);
        }
    }

}
