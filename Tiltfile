# Tiltfile for local development of CRM Portal & E-commerce Microservices
# Dynamically switches orchestration based on the NODE_ENV environment variable:
# - NODE_ENV == 'production': Runs containerized inside Docker Compose.
# - Other (default): Runs natively on the host machine for ultra-fast local feedback loops.

node_env = os.getenv('NODE_ENV', 'development')

if node_env == 'production':
    # --- 1. Containerized Docker Orchestration (Production Mode) ---
    docker_build(
        'identity-service',
        './backend/services/Identity',
        dockerfile='./backend/services/Identity/Identity.Api/Dockerfile'
    )
    
    docker_build(
        'ecommerce-service',
        './backend/services/ECommerce',
        dockerfile='./backend/services/ECommerce/ECommerce.Api/Dockerfile'
    )
    
    docker_build(
        'api-gateway',
        './backend/api-gateway',
        dockerfile='./backend/api-gateway/Dockerfile'
    )
    
    docker_compose('docker-compose.yml')
else:
    # --- 2. Native Local Host Orchestration (Development Mode) ---
    # 1. Identity Api Service (Xác thực & RBAC)
    local_resource(
        'identity-service',
        cmd='dotnet build backend/services/Identity/Identity.sln',
        serve_cmd='dotnet run --project backend/services/Identity/Identity.Api/Identity.Api.csproj --no-build',
        deps=['backend/services/Identity'],
        ignore=['**/bin/**', '**/obj/**', '**/logs/**']
    )
    
    # 2. ECommerce Api Service (Catalog & Stripe checkout)
    local_resource(
        'ecommerce-service',
        cmd='dotnet build backend/services/ECommerce/ECommerce.sln',
        serve_cmd='dotnet run --project backend/services/ECommerce/ECommerce.Api/ECommerce.Api.csproj --no-build',
        deps=['backend/services/ECommerce'],
        ignore=['**/bin/**', '**/obj/**', '**/logs/**']
    )
    
    # 3. API Gateway Service (Yarp reverse proxy)
    local_resource(
        'api-gateway',
        cmd='dotnet build backend/api-gateway/api-gateway.csproj',
        serve_cmd='dotnet run --project backend/api-gateway/api-gateway.csproj --no-build',
        deps=['backend/api-gateway'],
        ignore=['**/bin/**', '**/obj/**', '**/logs/**']
    )
