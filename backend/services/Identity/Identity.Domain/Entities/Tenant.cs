using System;
using Shared.Domain;

namespace Identity.Domain.Entities
{
    public class Tenant : BaseEntity
    {
        public string Name { get; private set; }
        public string Domain { get; private set; }
        public string SubscriptionPlan { get; private set; }

        private Tenant() 
        { 
            Name = null!;
            Domain = null!;
            SubscriptionPlan = null!;
        } // Required for EF Core

        public Tenant(Guid id, string name, string domain, string subscriptionPlan = "Free") : base(id)
        {
            if (string.IsNullOrWhiteSpace(name))
                throw new ArgumentException("Tenant name cannot be empty.", nameof(name));
            
            if (string.IsNullOrWhiteSpace(domain))
                throw new ArgumentException("Tenant domain cannot be empty.", nameof(domain));

            Name = name;
            Domain = domain.ToLowerInvariant().Trim();
            SubscriptionPlan = subscriptionPlan;
        }
    }
}
