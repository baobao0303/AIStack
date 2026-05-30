# Tiltfile for local development of CRM Portal & E-commerce Microservices
# Orchestrates microservices with native hot-reloading (dotnet watch) for sub-second development feedback loops.

# 1. Identity Api Service (Xác thực & RBAC)
# Swagger: https://localhost:7136/swagger
local_resource(
    'identity-service',
    cmd='dotnet watch run --project backend/services/Identity/Identity.Api/Identity.Api.csproj',
    deps=['backend/services/Identity']
)

# 2. ECommerce Api Service (Catalog & Stripe checkout)
# Swagger: https://localhost:7062/swagger
local_resource(
    'ecommerce-service',
    cmd='dotnet watch run --project backend/services/ECommerce/ECommerce.Api/ECommerce.Api.csproj',
    deps=['backend/services/ECommerce']
)
