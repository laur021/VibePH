using System;
using API.DTOs;
using API.Entities;
using API.Errors;
using API.Extensions;
using API.Helpers;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class MessagesController(IUnitOfWork uow) : BaseApiController
{
    [HttpPost]
    public async Task<ActionResult<ApiResponse<MessageDto>>> CreateMessage(CreateMessageDto createMessageDto)
    {
        var sender = await uow.MemberRepository.GetMemberByIdAsync(User.GetMemberId());
        var recipient = await uow.MemberRepository.GetMemberByIdAsync(createMessageDto.RecipientId);

        if (recipient == null || sender == null || sender.Id == createMessageDto.RecipientId)
            return ErrorResponse<MessageDto>("Cannot send this message", StatusCodes.Status400BadRequest);

        var message = new Message
        {
            SenderId = sender.Id,
            RecipientId = recipient.Id,
            Content = createMessageDto.Content
        };

        uow.MessageRepository.AddMessage(message);

        if (await uow.CompleteAsync())
            return SuccessResponse(message.ToDto(), "Message sent successfully");

        return ErrorResponse<MessageDto>("Failed to send message", StatusCodes.Status400BadRequest);
    }

    [HttpGet]
    public async Task<ActionResult<ApiResponse<PaginatedResult<MessageDto>>>> GetMessagesByContainer(
        [FromQuery] MessageParams messageParams)
    {
        messageParams.MemberId = User.GetMemberId();
        var messages = await uow.MessageRepository.GetMessagesForMember(messageParams);

        return SuccessResponse(messages, "Messages retrieved successfully");
    }

    [HttpGet("thread/{recipientId}")]
    public async Task<ActionResult<ApiResponse<IReadOnlyList<MessageDto>>>> GetMessageThread(string recipientId)
    {
        var thread = await uow.MessageRepository.GetMessageThread(User.GetMemberId(), recipientId);
        return SuccessResponse(thread, "Message thread retrieved successfully");
    }

    [HttpDelete("{id}")]
    public async Task<ActionResult<ApiResponse<object?>>> DeleteMessage(string id)
    {
        var memberId = User.GetMemberId();

        var message = await uow.MessageRepository.GetMessage(id);

        if (message == null)
            return ErrorResponse("Cannot delete this message", StatusCodes.Status400BadRequest);

        if (message.SenderId != memberId && message.RecipientId != memberId)
            return ErrorResponse("You cannot delete this message", StatusCodes.Status400BadRequest);

        if (message.SenderId == memberId) message.SenderDeleted = true;
        if (message.RecipientId == memberId) message.RecipientDeleted = true;

        if (message is { SenderDeleted: true, RecipientDeleted: true })
        {
            uow.MessageRepository.DeleteMessage(message);
        }

        if (await uow.CompleteAsync())
            return SuccessResponse<object?>(null, "Message deleted successfully");

        return ErrorResponse("Problem deleting the message", StatusCodes.Status400BadRequest);
    }
}
