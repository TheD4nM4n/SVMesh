# Multi-stage Docker build for SVMesh application
# Stage 1: Build the React frontend
FROM node:20-alpine as frontend-build

WORKDIR /app/client

# Copy only package files first for better layer caching
COPY svmesh.client/package*.json ./
RUN npm ci --prefer-offline --no-audit

# Copy only necessary source files (exclude node_modules, dist, etc.)
COPY svmesh.client/src ./src
COPY svmesh.client/public ./public
COPY svmesh.client/index.html ./
COPY svmesh.client/vite.config.ts ./
COPY svmesh.client/tsconfig*.json ./
COPY svmesh.client/eslint.config.js ./

# Build the application
RUN npm run build

# Stage 2: Build the .NET backend
FROM mcr.microsoft.com/dotnet/sdk:8.0-alpine AS backend-build
WORKDIR /app/SVMesh.Server

# Copy only project file for restore (better caching)
COPY SVMesh.Server/*.csproj ./

# Restore dependencies in a separate layer
RUN dotnet restore

# Copy only necessary source files
COPY SVMesh.Server/*.cs ./
COPY SVMesh.Server/*.json ./
COPY SVMesh.Server/Properties/ ./Properties/
COPY SVMesh.Server/Controllers/ ./Controllers/

# Copy the built frontend from the previous stage
COPY --from=frontend-build /app/client/dist ./wwwroot

# Build and publish the application
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