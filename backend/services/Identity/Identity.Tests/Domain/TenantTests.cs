using System;
using Xunit;
using Identity.Domain.Entities;

namespace Identity.Tests.Domain
{
    public class TenantTests
    {
        [Fact]
        public void Tenant_Create_With_Valid_Values_Should_Initialize_Properties()
        {
            // Arrange
            var id = Guid.NewGuid();
            var name = "Acme Corp";
            var domain = "ACME "; // Contains spaces & caps to test normalization

            // Act
            var tenant = new Tenant(id, name, domain);

            // Assert
            Assert.Equal(id, tenant.Id);
            Assert.Equal("Acme Corp", tenant.Name);
            Assert.Equal("acme", tenant.Domain); // normalized to lower and trimmed
            Assert.Equal("Free", tenant.SubscriptionPlan);
            Assert.True(tenant.CreatedAt <= DateTimeOffset.UtcNow);
        }

        [Theory]
        [InlineData("", "acme")]
        [InlineData("Acme", "")]
        [InlineData("   ", "acme")]
        [InlineData("Acme", "  ")]
        public void Tenant_Create_With_Empty_Values_Should_Throw_ArgumentException(string name, string domain)
        {
            // Act & Assert
            Assert.Throws<ArgumentException>(() => new Tenant(Guid.NewGuid(), name, domain));
        }
    }
}
