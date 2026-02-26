using System;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class LikeController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost("{targetMemberId}")]
    public async Task<ActionResult<ApiResponse<object?>>> ToggleLike(string targetMemberId)
    {
        var sourceMemberId = User.GetMemberId();

        if (sourceMemberId == targetMemberId)
            return ErrorResponse("You cannot like yourself", StatusCodes.Status400BadRequest);

        var existingLike = await uow.LikeRepository.GetMemberLike(sourceMemberId, targetMemberId);

        if (existingLike == null)
        {
            var like = new MemberLike
            {
                SourceMemberId = sourceMemberId,
                TargetMemberId = targetMemberId
            };

            uow.LikeRepository.AddLike(like);
        }
        else
        {
            uow.LikeRepository.DeleteLike(existingLike);
        }

        if (!await uow.CompleteAsync())
            return ErrorResponse("Failed to update like", StatusCodes.Status400BadRequest);

        var message = existingLike == null
            ? "Member liked successfully"
            : "Like removed successfully";

        return SuccessResponse<object?>(null, message, StatusCodes.Status200OK);
    }

    [HttpGet("list")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<string>>>> GetCurrentMemberLikeIds()
    {
        var likeIds = await uow.LikeRepository.GetCurrentMemberLikeIds(User.GetMemberId());
        return SuccessResponse(likeIds, "Liked member ids retrieved successfully");
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<Member>>>> GetMemberLikes(
        [FromQuery] LikeParams likeParams)
    {
        likeParams.MemberId = User.GetMemberId();
        var members = await uow.LikeRepository.GetMemberLikes(likeParams);

        return SuccessResponse(members, "Likes retrieved successfully");
    }
}
