using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class MembersController(IMemberService memberService) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<AppUser>>> GetMemberList()
        {
            return Ok(await memberService.GetMemberListAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<AppUser>> GetMember(string id)
        {
            var member = await memberService.GetMemberByIdAsync(id);

            if (member is null)
                return NotFound();
            return Ok(member);
        }
    }
}
