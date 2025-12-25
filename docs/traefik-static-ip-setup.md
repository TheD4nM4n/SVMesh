# Traefik Static IP Setup for SVMesh

This guide shows how to configure Traefik (running on a separate machine) to proxy to your SVMesh application using a static IP address. **No Docker Swarm required.**

## Overview

In this setup:

- **Traefik Server**: Runs on one machine, handles HTTPS/SSL termination
- **SVMesh Server**: Runs on another machine, exposes nginx on a specific port
- **Connection**: Traefik proxies HTTP requests to SVMesh's IP:port

```
Internet → Traefik (Machine A) → SVMesh nginx:8081 (Machine B)
```

## Prerequisites

- Traefik running on a separate machine (Machine A)
- SVMesh will run on your machine (Machine B)
- Static IP address or hostname for Machine B that Machine A can reach
- Domain DNS pointing to Machine A (Traefik server)
- Firewall allowing traffic from Machine A to Machine B on your chosen port

## SVMesh Configuration

### 1. Configure Environment Variables

Edit your `.env` file:

```bash
# Domain name (must match what Traefik routes)
DOMAIN=svmesh.thed4nm4n.com

# Port to expose nginx on (Traefik will connect to this)
NGINX_PORT=8081

# Application Environment
ASPNETCORE_ENVIRONMENT=Production
```

**Key Variables:**

- `DOMAIN`: Your domain name (DNS should point to Traefik server)
- `NGINX_PORT`: Port to expose on your SVMesh machine (default: 8081)

### 2. Deploy SVMesh

```bash
# Navigate to project directory
cd /path/to/SVMesh

# Start services
docker-compose -f docker-compose.traefik.yml up -d

# Verify services are running
docker-compose -f docker-compose.traefik.yml ps

# Check logs
docker-compose -f docker-compose.traefik.yml logs -f
```

### 3. Verify Local Access

Test that nginx is accessible locally:

```bash
# From SVMesh machine
curl http://localhost:8081

# From another machine on the same network
curl http://<svmesh-server-ip>:8081
```

### 4. Configure Firewall

Allow traffic from your Traefik server:

#### UFW (Ubuntu/Debian)

```bash
# Allow from specific IP (recommended)
sudo ufw allow from <traefik-server-ip> to any port 8081

# Or allow from all (less secure)
sudo ufw allow 8081/tcp
```

#### Firewalld (RHEL/CentOS)

```bash
sudo firewall-cmd --permanent --add-port=8081/tcp
sudo firewall-cmd --reload
```

#### iptables

```bash
sudo iptables -A INPUT -p tcp --dport 8081 -s <traefik-server-ip> -j ACCEPT
```

## Traefik Configuration

On your Traefik server (Machine A), you need to configure Traefik to proxy to your SVMesh server.

### Option 1: File Provider (Recommended for External Services)

Create a configuration file for SVMesh:

#### traefik/config/svmesh.yml

```yaml
http:
  routers:
    svmesh:
      rule: "Host(`svmesh.thed4nm4n.com`)"
      entryPoints:
        - websecure
      service: svmesh
      tls:
        certResolver: letsencrypt

    svmesh-http:
      rule: "Host(`svmesh.thed4nm4n.com`)"
      entryPoints:
        - web
      middlewares:
        - redirect-to-https
      service: svmesh

  services:
    svmesh:
      loadBalancer:
        servers:
          - url: "http://<svmesh-server-ip>:8081"
        healthCheck:
          path: /health
          interval: 30s
          timeout: 10s

  middlewares:
    redirect-to-https:
      redirectScheme:
        scheme: https
        permanent: true
```

**Replace `<svmesh-server-ip>` with your SVMesh server's actual IP address.**

#### Enable File Provider in Traefik

Update your Traefik static configuration (`traefik.yml`):

```yaml
providers:
  docker:
    endpoint: "unix:///var/run/docker.sock"
    exposedByDefault: false

  file:
    directory: /config
    watch: true
```

Update your Traefik docker-compose.yml:

```yaml
services:
  traefik:
    image: traefik:latest
    # ... other config ...
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock:ro
      - ./traefik.yml:/traefik.yml:ro
      - ./config:/config:ro # Add this line
      - ./letsencrypt:/letsencrypt
```

Restart Traefik:

```bash
docker-compose restart traefik
```

### Option 2: Docker Labels with HTTP Service (Alternative)

If you prefer using Docker labels, create a dummy container on the Traefik server:

```yaml
services:
  svmesh-proxy:
    image: alpine
    command: tail -f /dev/null
    networks:
      - traefik
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.svmesh.rule=Host(`svmesh.thed4nm4n.com`)"
      - "traefik.http.routers.svmesh.entrypoints=websecure"
      - "traefik.http.routers.svmesh.tls=true"
      - "traefik.http.routers.svmesh.tls.certresolver=letsencrypt"
      - "traefik.http.services.svmesh.loadbalancer.server.url=http://<svmesh-server-ip>:8081"
```

## Testing

### 1. Test Local SVMesh Access

From the SVMesh machine:

```bash
curl http://localhost:8081
```

### 2. Test from Traefik Server

From the Traefik machine:

```bash
curl http://<svmesh-server-ip>:8081
```

### 3. Test via Domain

From any machine:

```bash
# Should redirect to HTTPS
curl -I http://svmesh.thed4nm4n.com

# Should return 200 OK with SSL
curl -I https://svmesh.thed4nm4n.com
```

## Troubleshooting

### SVMesh Not Accessible from Traefik

1. **Check if port is open**:

```bash
# From Traefik server
telnet <svmesh-server-ip> 8081
# or
nc -zv <svmesh-server-ip> 8081
```

2. **Check firewall rules**:

```bash
# On SVMesh server
sudo ufw status
# or
sudo firewall-cmd --list-all
```

3. **Check Docker port binding**:

```bash
# On SVMesh server
docker port svmesh-nginx
# Should show: 80/tcp -> 0.0.0.0:8081
```

### SSL Certificate Issues

1. **Check Traefik logs**:

```bash
docker logs traefik 2>&1 | grep -i svmesh
```

2. **Verify DNS points to Traefik server**:

```bash
dig +short svmesh.thed4nm4n.com
# Should return Traefik server's public IP
```

3. **Check Let's Encrypt rate limits**: Let's Encrypt has rate limits. Use staging environment for testing.

### Connection Timeout

1. **Check network connectivity**:

```bash
# From Traefik server
ping <svmesh-server-ip>
```

2. **Check if nginx is responding**:

```bash
# On SVMesh server
docker-compose -f docker-compose.traefik.yml logs nginx
```

3. **Verify health check**:

```bash
# On SVMesh server
curl http://localhost:8081/health
```

### 502 Bad Gateway

This usually means Traefik can't reach SVMesh:

1. **Verify SVMesh is running**:

```bash
docker-compose -f docker-compose.traefik.yml ps
```

2. **Check nginx logs**:

```bash
docker-compose -f docker-compose.traefik.yml logs nginx
```

3. **Test direct connection**:

```bash
# From Traefik server
curl -v http://<svmesh-server-ip>:8081
```

## Security Considerations

### 1. Firewall Rules

Only allow traffic from your Traefik server:

```bash
# Replace with your Traefik server's IP
sudo ufw allow from <traefik-server-ip> to any port 8081
```

### 2. Use VPN or Private Network

For better security, consider:

- **WireGuard VPN** between servers
- **Private network** (like VPC in cloud providers)
- **Tailscale** for easy mesh networking

### 3. Authentication

Consider adding authentication middleware in Traefik:

```yaml
http:
  routers:
    svmesh:
      # ... other config ...
      middlewares:
        - basic-auth

  middlewares:
    basic-auth:
      basicAuth:
        users:
          - "user:$apr1$H6uskkkW$IgXLP6ewTrSuBkTrqE8wj/"
```

Generate password hash:

```bash
htpasswd -nb user password
```

### 4. Rate Limiting

Add rate limiting in Traefik:

```yaml
http:
  routers:
    svmesh:
      middlewares:
        - rate-limit

  middlewares:
    rate-limit:
      rateLimit:
        average: 100
        burst: 50
```

## Advantages of Static IP Setup

✅ **Simpler Setup**: No Docker Swarm complexity  
✅ **Better Isolation**: Services run on separate machines  
✅ **Flexible**: Easy to move or change servers  
✅ **No Shared Docker Daemon**: Better security

## Disadvantages

❌ **Manual IP Management**: Need to update config if IP changes  
❌ **Network Dependency**: Requires stable network connection  
❌ **Firewall Configuration**: Manual firewall rules needed

## Alternative: Dynamic DNS

If your SVMesh server doesn't have a static IP, use Dynamic DNS:

1. **Set up DDNS** (e.g., DuckDNS, No-IP):

```bash
# Example: DuckDNS
curl "https://www.duckdns.org/update?domains=mysvmesh&token=YOUR_TOKEN"
```

2. **Update Traefik config** to use hostname instead of IP:

```yaml
services:
  svmesh:
    loadBalancer:
      servers:
        - url: "http://mysvmesh.duckdns.org:8081"
```

## Updates and Maintenance

### Update SVMesh

```bash
# Pull latest images
docker-compose -f docker-compose.traefik.yml pull

# Recreate containers
docker-compose -f docker-compose.traefik.yml up -d --force-recreate

# Clean up
docker image prune -f
```

### Monitor Logs

```bash
# Real-time logs
docker-compose -f docker-compose.traefik.yml logs -f

# Last 100 lines
docker-compose -f docker-compose.traefik.yml logs --tail=100
```

### Restart Services

```bash
# Restart all
docker-compose -f docker-compose.traefik.yml restart

# Restart specific service
docker-compose -f docker-compose.traefik.yml restart nginx
```

## Complete Example

### SVMesh Server (192.168.1.100)

**.env**

```bash
DOMAIN=svmesh.example.com
NGINX_PORT=8081
ASPNETCORE_ENVIRONMENT=Production
```

**Deploy:**

```bash
docker-compose -f docker-compose.traefik.yml up -d
sudo ufw allow from 192.168.1.50 to any port 8081
```

### Traefik Server (192.168.1.50)

**config/svmesh.yml**

```yaml
http:
  routers:
    svmesh:
      rule: "Host(`svmesh.example.com`)"
      entryPoints:
        - websecure
      service: svmesh
      tls:
        certResolver: letsencrypt

  services:
    svmesh:
      loadBalancer:
        servers:
          - url: "http://192.168.1.100:8081"
        healthCheck:
          path: /health
          interval: 30s
```

**Restart Traefik:**

```bash
docker-compose restart traefik
```

**Test:**

```bash
curl https://svmesh.example.com
```

## Support

For issues specific to:

- **SVMesh**: Check application logs and [SVMesh documentation](../README.md)
- **Traefik**: See [Traefik Documentation](https://doc.traefik.io/traefik/)
- **Network/Firewall**: Consult your OS firewall documentation
