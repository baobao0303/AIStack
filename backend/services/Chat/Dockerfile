FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy csproj files
COPY ["backend/services/Chat/Chat.Api/Chat.Api.csproj", "backend/services/Chat/Chat.Api/"]
COPY ["backend/shared/Shared/Shared.csproj", "backend/shared/Shared/"]

# Restore packages
RUN dotnet restore "backend/services/Chat/Chat.Api/Chat.Api.csproj"

# Copy source trees
COPY ["backend/services/Chat/Chat.Api/", "backend/services/Chat/Chat.Api/"]
COPY ["backend/shared/Shared/", "backend/shared/Shared/"]

# Build Release binaries
WORKDIR "/src/backend/services/Chat/Chat.Api"
RUN dotnet build "Chat.Api.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Chat.Api.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Final runtime image assembly
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Chat.Api.dll"]
