using System;

namespace Identity.Domain.Entities
{
    public class Tenant
    {
        public Guid Id { get; private set; }
        public string Name { get; private set; }
        public string Domain { get; private set; }
        public string SubscriptionPlan { get; private set; }
        public DateTimeOffset CreatedAt { get; private set; }

        private Tenant() 
        { 
            Name = null!;
            Domain = null!;
            SubscriptionPlan = null!;
        } // Required for EF Core

        public Tenant(Guid id, string name, string domain, string subscriptionPlan = "Free")
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Tenant name cannot be empty.", nameof(name));
            
            if (string.IsNullOrWhiteSpace(domain))
                throw new ArgumentException("Tenant domain cannot be empty.", nameof(domain));

            Id = id;
            Name = name;
            Domain = domain.ToLowerInvariant().Trim();
            SubscriptionPlan = subscriptionPlan;
            CreatedAt = DateTimeOffset.UtcNow;
        }
    }
}
