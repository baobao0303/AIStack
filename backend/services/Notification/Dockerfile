FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR /src

# Copy project definition files
COPY ["backend/services/Notification/Notification.Service/Notification.Service.csproj", "backend/services/Notification/Notification.Service/"]
COPY ["backend/shared/Shared/Shared.csproj", "backend/shared/Shared/"]

# Restore dependencies
RUN dotnet restore "backend/services/Notification/Notification.Service/Notification.Service.csproj"

# Copy full source trees
COPY ["backend/services/Notification/Notification.Service/", "backend/services/Notification/Notification.Service/"]
COPY ["backend/shared/Shared/", "backend/shared/Shared/"]

# Compile Release binary
WORKDIR "/src/backend/services/Notification/Notification.Service"
RUN dotnet build "Notification.Service.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "Notification.Service.csproj" -c Release -o /app/publish /p:UseAppHost=false

# Assemble final runtime container using ASP.NET 6 Runtime base
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "Notification.Service.dll"]
