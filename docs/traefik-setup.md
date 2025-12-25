# Traefik Integration Setup for SVMesh

This document provides detailed instructions for integrating SVMesh with an existing Traefik reverse proxy running on a separate machine.

## Overview

Traefik is a modern reverse proxy that provides:

- **Automatic SSL/TLS with Let's Encrypt**
- **Dynamic configuration via Docker labels**
- **Load balancing**
- **Middleware support for security headers**
- **Dashboard for monitoring**
- **Automatic service discovery**

This setup assumes you already have Traefik running on a separate machine with a shared Docker network.

## Prerequisites

- Traefik proxy running on a separate machine
- Docker and Docker Compose installed on both machines
- Domain DNS pointing to your Traefik server
- Traefik configured with:
  - Docker provider enabled
  - External `traefik` network created
  - Let's Encrypt certificate resolver configured (optional but recommended)

## Architecture

```
Internet
    ↓
Traefik Server (separate machine)
    ↓ (Docker network or overlay)
SVMesh Application
    ↓
Nginx → ASP.NET Core App
```

## Setup Options

### Option 1: Docker Swarm or Overlay Network (Recommended for Separate Machines)

If your Traefik server and application server are on separate machines, use Docker Swarm mode with an overlay network.

#### On Traefik Server:

1. **Initialize Swarm** (if not already done):

```bash
docker swarm init --advertise-addr <TRAEFIK_SERVER_IP>
```

2. **Create overlay network**:

```bash
docker network create --driver=overlay --attachable traefik
```

3. **Get join token**:

```bash
docker swarm join-token worker
```

#### On Application Server (SVMesh):

1. **Join the swarm**:

```bash
# Use the token from previous step
docker swarm join --token <TOKEN> <TRAEFIK_SERVER_IP>:2377
```

2. **Verify network access**:

```bash
docker network ls | grep traefik
```

### Option 2: Same Machine Setup

If Traefik and SVMesh are on the same machine, simply ensure the external network exists:

```bash
# Create the network if it doesn't exist
docker network create traefik
```

## Configuration Steps

### 1. Prepare Environment Variables

Create or update your `.env` file:

```bash
# Domain configuration
DOMAIN=your-domain.com

# Traefik configuration
TRAEFIK_NETWORK=traefik
CERT_RESOLVER=letsencrypt

# Optional: Additional settings
ASPNETCORE_ENVIRONMENT=Production
```

**Key Variables:**

- `DOMAIN`: Your full domain name (e.g., `app.example.com`)
- `TRAEFIK_NETWORK`: The external Traefik network name (default: `traefik`)
- `CERT_RESOLVER`: The name of your Traefik certificate resolver (default: `letsencrypt`)

### 2. Verify Traefik Configuration

Ensure your Traefik instance has the following configuration (typically in `traefik.yml` or via command line):

```yaml
# Traefik static configuration example
entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: traefik
```

### 3. Deploy SVMesh

Deploy the application using the Traefik-specific compose file:

```bash
# Navigate to project directory
cd /path/to/SVMesh

# Pull latest images
docker-compose -f docker-compose.traefik.yml pull

# Start services
docker-compose -f docker-compose.traefik.yml up -d

# View logs
docker-compose -f docker-compose.traefik.yml logs -f
```

### 4. Verify Deployment

1. **Check container status**:

```bash
docker-compose -f docker-compose.traefik.yml ps
```

2. **Check Traefik dashboard** (if enabled):

   - Navigate to your Traefik dashboard
   - Look for the `svmesh` service
   - Verify SSL certificate status

3. **Test the application**:

```bash
# Test HTTP redirect
curl -I http://your-domain.com

# Test HTTPS
curl -I https://your-domain.com
```

4. **Verify SSL certificate**:

```bash
curl -vI https://your-domain.com 2>&1 | grep -i "SSL certificate"
```

## Traefik Labels Explained

The `docker-compose.traefik.yml` file uses the following Traefik labels:

### Basic Configuration

```yaml
traefik.enable=true
```

Enables Traefik for this container.

### Network Configuration

```yaml
traefik.docker.network=traefik
```

Specifies which Docker network Traefik should use to communicate with this service.

### Router Configuration

```yaml
traefik.http.routers.svmesh.rule=Host(`your-domain.com`)
traefik.http.routers.svmesh.entrypoints=websecure
traefik.http.routers.svmesh.tls=true
traefik.http.routers.svmesh.tls.certresolver=letsencrypt
```

- Defines routing rule based on hostname
- Uses HTTPS entrypoint
- Enables TLS
- Specifies certificate resolver

### Service Configuration

```yaml
traefik.http.services.svmesh.loadbalancer.server.port=80
```

Tells Traefik which port to use on the container.

### Middleware Configuration

```yaml
traefik.http.middlewares.svmesh-security.headers.stsSeconds=31536000
traefik.http.middlewares.svmesh-security.headers.stsIncludeSubdomains=true
```

Adds security headers like HSTS (HTTP Strict Transport Security).

## Advanced Configuration

### Custom Middleware

You can add additional Traefik middleware for enhanced functionality:

#### Rate Limiting

```yaml
labels:
  - "traefik.http.middlewares.svmesh-ratelimit.ratelimit.average=100"
  - "traefik.http.middlewares.svmesh-ratelimit.ratelimit.burst=50"
  - "traefik.http.routers.svmesh.middlewares=svmesh-security,svmesh-ratelimit"
```

#### IP Whitelist

```yaml
labels:
  - "traefik.http.middlewares.svmesh-ipwhitelist.ipwhitelist.sourcerange=192.168.1.0/24,10.0.0.0/8"
  - "traefik.http.routers.svmesh.middlewares=svmesh-security,svmesh-ipwhitelist"
```

#### Basic Auth

```yaml
labels:
  - "traefik.http.middlewares.svmesh-auth.basicauth.users=user:$$apr1$$password$$hash"
  - "traefik.http.routers.svmesh.middlewares=svmesh-security,svmesh-auth"
```

### Multiple Domains

To serve the application on multiple domains:

```yaml
labels:
  - "traefik.http.routers.svmesh.rule=Host(`domain1.com`) || Host(`domain2.com`) || Host(`www.domain1.com`)"
```

### Path-Based Routing

To serve on a specific path:

```yaml
labels:
  - "traefik.http.routers.svmesh.rule=Host(`example.com`) && PathPrefix(`/svmesh`)"
  - "traefik.http.middlewares.svmesh-stripprefix.stripprefix.prefixes=/svmesh"
  - "traefik.http.routers.svmesh.middlewares=svmesh-stripprefix"
```

## Monitoring and Maintenance

### View Logs

```bash
# All services
docker-compose -f docker-compose.traefik.yml logs -f

# Specific service
docker-compose -f docker-compose.traefik.yml logs -f nginx
docker-compose -f docker-compose.traefik.yml logs -f svmesh-app
```

### Health Checks

The application includes a health check endpoint:

```bash
# Check health
curl https://your-domain.com/health
```

### Update Application

```bash
# Pull latest images
docker-compose -f docker-compose.traefik.yml pull

# Recreate containers
docker-compose -f docker-compose.traefik.yml up -d --force-recreate

# Clean up old images
docker image prune -f
```

### Restart Services

```bash
# Restart all services
docker-compose -f docker-compose.traefik.yml restart

# Restart specific service
docker-compose -f docker-compose.traefik.yml restart nginx
```

## Troubleshooting

### Service Not Accessible

1. **Verify Traefik can reach the container**:

```bash
# Check if container is on the traefik network
docker network inspect traefik
```

2. **Check Traefik logs**:

```bash
docker logs traefik
```

3. **Verify DNS**:

```bash
# Check DNS resolution
nslookup your-domain.com

# Check if DNS points to Traefik server
dig +short your-domain.com
```

### SSL Certificate Issues

1. **Check certificate resolver name**:

   - Ensure `CERT_RESOLVER` matches your Traefik configuration

2. **Verify Let's Encrypt rate limits**:

   - Let's Encrypt has rate limits (50 certificates per domain per week)
   - Use staging environment for testing

3. **Check Traefik ACME configuration**:

```bash
# View ACME storage
docker exec traefik cat /letsencrypt/acme.json
```

### Container Health Check Failing

1. **Check application logs**:

```bash
docker-compose -f docker-compose.traefik.yml logs svmesh-app
```

2. **Test health endpoint directly**:

```bash
# From within the container network
docker exec svmesh-nginx wget -qO- http://svmesh-app:8080/health
```

3. **Verify application is running**:

```bash
docker-compose -f docker-compose.traefik.yml ps
```

### Network Connectivity Issues (Separate Machines)

1. **Verify swarm status**:

```bash
docker node ls
```

2. **Check overlay network**:

```bash
docker network inspect traefik
```

3. **Test connectivity between nodes**:

```bash
# On application server
docker run --rm --network traefik alpine ping -c 4 <traefik-server-ip>
```

4. **Check firewall rules**:
   - Ensure ports 2377 (swarm management), 7946 (container network discovery), and 4789 (overlay network traffic) are open

## Security Best Practices

1. **Keep Traefik Updated**:

   - Regularly update Traefik to get security patches

2. **Use Strong SSL Configuration**:

   - Configure modern TLS versions (TLS 1.2+)
   - Use secure cipher suites

3. **Implement Rate Limiting**:

   - Both at Traefik level and nginx level

4. **Monitor Access Logs**:

   - Regularly review nginx and Traefik logs for suspicious activity

5. **Network Isolation**:

   - Use internal networks for service-to-service communication
   - Only expose necessary services to Traefik network

6. **Security Headers**:
   - The configuration includes common security headers
   - Consider adding Content-Security-Policy specific to your needs

## Performance Optimization

### Enable HTTP/2

Traefik enables HTTP/2 by default on HTTPS connections.

### Compression

nginx handles gzip compression. Traefik also supports compression middleware:

```yaml
labels:
  - "traefik.http.middlewares.svmesh-compress.compress=true"
  - "traefik.http.routers.svmesh.middlewares=svmesh-security,svmesh-compress"
```

### Caching

Consider using Traefik's forward auth or cache headers middleware for improved performance.

## Support and Resources

- [Traefik Documentation](https://doc.traefik.io/traefik/)
- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Swarm Documentation](https://docs.docker.com/engine/swarm/)
- [SVMesh GitHub Repository](your-repo-url)

## Example Complete Traefik Setup

For reference, here's a minimal Traefik setup on your proxy server:

### traefik/docker-compose.yml

```yaml
services:
  traefik:
    image: traefik:latest
    container_name: traefik
    restart: unless-stopped
    security_opt:
      - no-new-privileges:true
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./letsencrypt:/letsencrypt
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      # Dashboard (optional, secure it!)
      - "traefik.http.routers.dashboard.rule=Host(`traefik.your-domain.com`)"
      - "traefik.http.routers.dashboard.service=api@internal"
      - "traefik.http.routers.dashboard.entrypoints=websecure"
      - "traefik.http.routers.dashboard.tls.certresolver=letsencrypt"

networks:
  traefik:
    external: true
```

### traefik/traefik.yml

```yaml
api:
  dashboard: true

entryPoints:
  web:
    address: ":80"
    http:
      redirections:
        entryPoint:
          to: websecure
          scheme: https
  websecure:
    address: ":443"

certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web

providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false
    network: traefik

log:
  level: INFO

accessLog: {}
```

Create the network:

```bash
docker network create traefik
docker-compose up -d
```
