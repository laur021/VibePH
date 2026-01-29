using API.Data;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MemberController(IMemberService memberService) : ControllerBase
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
