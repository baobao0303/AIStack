# Tiltfile for local development of CRM Portal & E-commerce Microservices
# Orchestrates microservices inside containerized Docker environments with Tilt & Docker Compose.

# 1. Register Docker Builds
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

# 2. Load and Orchestrate Docker Compose Services
docker_compose('docker-compose.yml')
