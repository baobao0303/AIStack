using System;

namespace Chat.Api.Entities
{
    public static class ActiveChatStatuses
    {
        public const string Offline = "Offline";
        public const string Online = "Online";
        public const string Busy = "Busy";
    }

    public static class ChatSessionStatuses
    {
        public const string Active = "Active";
        public const string Closed = "Closed";
        public const string Queued = "Queued";
    }

    public static class SenderTypes
    {
        public const string Customer = "Customer";
        public const string Employee = "Employee";
        public const string AI = "AI";
    }

    public class Employee
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string FirstName { get; set; } = null!;
        public string LastName { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string? Department { get; set; }
        public string ActiveChatStatus { get; set; } = ActiveChatStatuses.Offline;
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
    }

    public class EmployeeShift
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public Guid EmployeeId { get; set; }
        public DateTimeOffset ShiftStart { get; set; }
        public DateTimeOffset ShiftEnd { get; set; }
        public string? Notes { get; set; }
    }

    public class ChatSession
    {
        public Guid Id { get; set; }
        public Guid TenantId { get; set; }
        public string CustomerEmail { get; set; } = null!;
        public Guid? AssignedEmployeeId { get; set; }
        public string Status { get; set; } = ChatSessionStatuses.Active;
        public string? Summary { get; set; }
        public int? BuyerScore { get; set; }
        public DateTimeOffset CreatedAt { get; set; } = DateTimeOffset.UtcNow;
        public DateTimeOffset? ClosedAt { get; set; }
    }

    public class ChatMessage
    {
        public Guid Id { get; set; }
        public Guid SessionId { get; set; }
        public string SenderType { get; set; } = null!;
        public string SenderName { get; set; } = null!;
        public string Content { get; set; } = null!;
        public DateTimeOffset SentAt { get; set; } = DateTimeOffset.UtcNow;
    }
}
