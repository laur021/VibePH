using API.Entities;
using API.Errors;
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
            return SuccessResponse(photos, "Member photos retrieved successfully");
        }

    }
}
