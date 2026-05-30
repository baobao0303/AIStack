using Xunit;
using Identity.Application.Authentication.Commands.RegisterTenant;

namespace Identity.Tests.Application
{
    public class RegisterTenantCommandValidatorTests
    {
        private readonly RegisterTenantCommandValidator _validator;

        public RegisterTenantCommandValidatorTests()
        {
            _validator = new RegisterTenantCommandValidator();
        }

        [Fact]
        public void Validator_Should_Be_Valid_When_Command_Is_Perfect()
        {
            // Arrange
            var command = new RegisterTenantCommand
            {
                CompanyName = "Acme Corp",
                CompanyDomain = "acme",
                Email = "owner@acme.com",
                Password = "SecureP@ssword123!",
                FirstName = "John",
                LastName = "Doe"
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            Assert.True(result.IsValid);
        }

        [Theory]
        [InlineData("acme space", "Email must not have spaces")]
        [InlineData("acme!", "Email must be alphanumeric")]
        public void Validator_Should_Fail_When_Domain_Is_Invalid(string domain, string reason)
        {
            // Arrange
            var command = new RegisterTenantCommand
            {
                CompanyName = "Acme Corp",
                CompanyDomain = domain,
                Email = "owner@acme.com",
                Password = "SecureP@ssword123!"
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            Assert.False(result.IsValid, reason);
            Assert.Contains(result.Errors, e => e.PropertyName == "CompanyDomain");
        }

        [Theory]
        [InlineData("weak", "Too short")]
        [InlineData("weakpassword123", "No caps or special chars")]
        [InlineData("WEAKPASSWORD123!", "No lowercase")]
        [InlineData("WeakPassword!", "No numbers")]
        public void Validator_Should_Fail_When_Password_Is_Weak(string password, string reason)
        {
            // Arrange
            var command = new RegisterTenantCommand
            {
                CompanyName = "Acme Corp",
                CompanyDomain = "acme",
                Email = "owner@acme.com",
                Password = password
            };

            // Act
            var result = _validator.Validate(command);

            // Assert
            Assert.False(result.IsValid, reason);
            Assert.Contains(result.Errors, e => e.PropertyName == "Password");
        }
    }
}
