using FluentValidation;

namespace Identity.Application.Authentication.Commands.RegisterTenant
{
    public class RegisterTenantCommandValidator : AbstractValidator<RegisterTenantCommand>
    {
        public RegisterTenantCommandValidator()
        {
            RuleFor(x => x.CompanyName)
                .NotEmpty().WithMessage("Company name is required.")
                .MinimumLength(2).WithMessage("Company name must be at least 2 characters.");

            RuleFor(x => x.CompanyDomain)
                .NotEmpty().WithMessage("Company domain is required.")
                .Matches("^[a-zA-Z0-9-]+$").WithMessage("Company domain can only contain alphanumeric characters and hyphens.")
                .Must(x => !x.Contains(" ")).WithMessage("Company domain cannot contain spaces.");

            RuleFor(x => x.Email)
                .NotEmpty().WithMessage("Email address is required.")
                .EmailAddress().WithMessage("A valid email address is required.");

            RuleFor(x => x.Password)
                .NotEmpty().WithMessage("Password is required.")
                .MinimumLength(8).WithMessage("Password must be at least 8 characters long.")
                .Matches("[A-Z]").WithMessage("Password must contain at least one uppercase letter.")
                .Matches("[a-z]").WithMessage("Password must contain at least one lowercase letter.")
                .Matches("[0-9]").WithMessage("Password must contain at least one number.")
                .Matches("[^a-zA-Z0-9]").WithMessage("Password must contain at least one special character.");
        }
    }
}
