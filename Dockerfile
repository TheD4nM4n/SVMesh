# Multi-stage Docker build for SVMesh application
# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-build

# Install build tools globally to avoid Alpine permission issues
RUN npm install -g typescript vite

WORKDIR /app/client

# Copy package files and install dependencies (including dev dependencies for build)
COPY svmesh.client/package*.json ./
RUN npm ci

# Copy source code and build
COPY svmesh.client/ ./
RUN tsc -b && vite build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS backend-build
WORKDIR /app

# Copy project files (excluding .esproj to avoid npm build in backend)
COPY SVMesh.Server/*.csproj ./SVMesh.Server/

# Restore dependencies
WORKDIR /app/SVMesh.Server
RUN dotnet restore

# Copy backend source code only
WORKDIR /app
COPY SVMesh.Server/ ./SVMesh.Server/

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/client/dist ./SVMesh.Server/wwwroot

# Remove the project reference to the frontend project to avoid npm build
RUN sed -i '/<ProjectReference.*svmesh.client.*esproj>/,/<\/ProjectReference>/d' ./SVMesh.Server/SVMesh.Server.csproj

# Build and publish the application
WORKDIR /app/SVMesh.Server
RUN dotnet publish -c Release -o /app/publish --no-restore

# Stage 3: Runtime image
FROM mcr.microsoft.com/dotnet/aspnet:8.0-alpine AS runtime

# Install curl for health check (must be done as root)
RUN apk add --no-cache curl

# Create a non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set up the application directory
WORKDIR /app
COPY --from=backend-build /app/publish .

# Change ownership of the app directory to the non-root user
RUN chown -R appuser:appgroup /app

# Switch to non-root user
USER appuser

# Expose port (use non-privileged port)
EXPOSE 8080

# Health check (check root endpoint since /health might not be implemented)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:8080/ || exit 1

# Set environment variables for production
ENV ASPNETCORE_ENVIRONMENT=Production
ENV ASPNETCORE_URLS=http://+:8080

ENTRYPOINT ["dotnet", "SVMesh.Server.dll"]