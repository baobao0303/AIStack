# Tiltfile for local development of CRM Portal & E-commerce Microservices
# Orchestrates microservices with native hot-reloading for sub-second development feedback loops.

# 1. Identity Api Service (Xác thực & RBAC)
# Swagger: https://localhost:7136/swagger
local_resource(
    'identity-service',
    cmd='dotnet build backend/services/Identity/Identity.sln',
    serve_cmd='dotnet run --project backend/services/Identity/Identity.Api/Identity.Api.csproj --no-build',
    deps=['backend/services/Identity'],
    ignore=['**/bin/**', '**/obj/**', '**/logs/**']
)

# 2. ECommerce Api Service (Catalog & Stripe checkout)
# Swagger: https://localhost:7062/swagger
local_resource(
    'ecommerce-service',
    cmd='dotnet build backend/services/ECommerce/ECommerce.sln',
    serve_cmd='dotnet run --project backend/services/ECommerce/ECommerce.Api/ECommerce.Api.csproj --no-build',
    deps=['backend/services/ECommerce'],
    ignore=['**/bin/**', '**/obj/**', '**/logs/**']
)
