# Architectural Decision Record (ADR): 0010 CRM CI/CD Pipeline

- **Date**: 2026-05-30
- **Status**: Accepted
- **Context**: High-risk, enterprise-grade distributed systems need automated pipeline gates to maintain code quality, verify security vulnerabilities, and handle automated blue-green deployments to staging and production without manual developer action.

---

## 1. CI/CD Architecture Flow

We use **GitHub Actions** as our primary orchestration server, dividing pipelines into two distinct flows: **Frontend (Next.js)** deploying directly to **Vercel**, and **Backend Services (.NET 8)** deploying to a **Kubernetes cluster (Amazon EKS)**.

```text
                +---------------------+
                | Developer Push/PR   |
                +----------+----------+
                           |
                           v
                +----------+----------+
                |    GitHub Actions   |
                +----+-----------+----+
                     |           |
       (Frontend)    |           | (Backend Services)
                     v           v
          +----------+---+   +---+----------+
          | Vercel CI    |   | .NET 8 CI    |
          | - Lint/Format|   | - xUnit Tests|
          | - Build Test |   | - Security Sc|
          +----------+---+   +---+----------+
                     |           |
 (On Merge: Main)    |           | (Docker Build & Push)
                     v           v
          +----------+---+   +---+----------+
          | Deploy to    |   | Amazon ECR   |
          | Vercel       |   +---+----------+
          | (Production) |       | (Helm Upgrade)
          +--------------+       v
                             +---+----------+
                             | Amazon EKS   |
                             | (K8s Cluster)|
                             +--------------+
```

---

## 2. CI Pipeline Specifications

### 2.1 Backend CI Workflow (.NET 8)
- **Trigger**: Every Pull Request and commit pushed to `main` and `develop` branches.
- **Jobs**:
  1. **Restore & Build**: Restores NuGet dependencies and compiles the source code with warnings treated as errors.
  2. **Test**: Runs the complete unit and integration test suite (`dotnet test`) using **xUnit** and generates coverage reports.
  3. **Security Scan**: Runs **Trivy** to scan Docker bases and **SonarQube** to check for static code vulnerabilities.
  4. **Docker Packaging**: Performs multi-stage Docker builds. The final image is minimal, containing only the runtime binaries (Alpine-based, ~200MB):
     ```dockerfile
     # Multi-stage build for Identity Service
     FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS build
     WORKDIR /src
     COPY ["Identity.csproj", "./"]
     RUN dotnet restore
     COPY . .
     RUN dotnet publish -c Release -o /app

     FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine
     WORKDIR /app
     COPY --from=build /app .
     ENTRYPOINT ["dotnet", "Identity.dll"]
     ```

### 2.2 Frontend CI Workflow (Next.js 15)
- **Trigger**: Runs under Vercel's native integration.
- **Jobs**:
  1. **Lint**: Runs ESLint and Prettier formatting checks.
  2. **Typecheck**: Validates TypeScript bindings (`tsc --noEmit`).
  3. **Build Check**: Executes `next build` to verify server-side compilation success before creating preview deployments.

---

## 3. CD Deployment Strategy

### 3.1 Next.js Vercel CD
- **Preview Deployments**: For every Pull Request, Vercel creates an isolated, secure deployment link for immediate manual QA verification.
- **Production Deployments**: Automatically triggers on successful merge into `main` branch, completing zero-downtime rollouts.

### 3.2 Backend Kubernetes CD
- **Container Registry**: Compiled Docker images are pushed to **Amazon Elastic Container Registry (ECR)** tagged with the commit SHA and `latest`.
- **Orchestration Deployment**: Helm charts are applied to the **Amazon EKS** cluster:
  ```bash
  helm upgrade --install identity-service ./charts/identity-service \
    --namespace production \
    --set image.tag=${{ github.sha }} \
    --values ./charts/identity-service/values-prod.yaml
  ```
- **Deployment Strategy**: **Rolling Update** ensuring at least 2 replica pods remain healthy at any point during rotation.

---

## 4. Consequences

### Positive
- **Guaranteed Code Quality**: No developer can merge code that fails compilation, breaks a unit test, or carries a high-risk security warning.
- **Zero-Downtime Releases**: Kubernetes rolling updates and Vercel edge routers guarantee users experience no service interruptions during deploy tasks.
- **Total Traceability**: ECR images and Kubernetes workloads are tagged with exact git commits.

### Tradeoffs
- **Infrastructure Costs**: Managed Kubernetes clusters, container registries, and continuous runners add persistent hosting fees.
- **Pipeline Time**: Running thorough tests, Trivy scans, and building multi-container images can take 5 to 10 minutes per commit.
