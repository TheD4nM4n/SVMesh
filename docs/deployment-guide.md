# SVMesh Deployment Guide

This guide provides step-by-step instructions for deploying SVMesh to production environments.

## Prerequisites

- Docker and Docker Compose installed
- Domain name (for public deployments)
- Traefik instance (recommended) or SSL certificates for traditional deployment

## Deployment Options

### Option A: Traefik Reverse Proxy (Recommended)

For Traefik deployments with automatic SSL/TLS, see the dedicated guide:

**➡️ [Traefik Static IP Setup Guide](traefik-static-ip-setup.md)**

This option provides:

- ✅ Automatic SSL/TLS with Let's Encrypt
- ✅ Modern reverse proxy with dynamic configuration
- ✅ No Docker Swarm required (static IP setup)
- ✅ Built-in load balancing and middleware support
- ✅ Easy integration with existing Traefik instances

### Option B: Traditional SSL Deployment

For deployments without Traefik, you'll need to manage SSL certificates and firewall configuration manually.

#### Prerequisites

- SSL certificates (Let's Encrypt or custom)
- Domain pointing to your server
- Firewall properly configured

#### Setup Steps

1. **Prepare SSL certificates**

   **Option 1: Let's Encrypt (Recommended)**

   ```bash
   # Install certbot
   sudo apt update && sudo apt install certbot

   # Obtain certificates
   sudo certbot certonly --standalone -d your-domain.com

   # Copy certificates
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/
   ```

   **Option 2: Custom certificates**

   ```bash
   # Place your certificates in the ssl directory
   cp your-certificate.pem ssl/fullchain.pem
   cp your-private-key.pem ssl/privkey.pem
   ```

2. **Update configuration files**

   **nginx.conf**: Replace `localhost` with your domain name

   **SVMesh.Server/Program.cs**: Update CORS origins to include your domain

3. **Deploy application**

   ```bash
   # Create directories
   mkdir -p ssl logs

   # Build images
   docker-compose build --no-cache

   # Start services
   docker-compose up -d

   # Wait for services
   sleep 10
   ```

4. **Verify deployment**

   ```bash
   # Test HTTP endpoint
   curl -f http://localhost/health

   # Test HTTPS endpoint (if SSL configured)
   curl -f https://localhost/health
   ```

## Post-Deployment Tasks

### Health Monitoring

```bash
# View real-time logs
docker-compose logs -f

# Check container status
docker-compose ps

# Restart services
docker-compose restart

# Stop services
docker-compose down
```

### Security Checklist

**For Traefik deployments:**

- [ ] SSL/TLS configured via Let's Encrypt
- [ ] Firewall allows Traefik server to connect
- [ ] Review Traefik middleware configuration
- [ ] Regularly update Docker images
- [ ] Monitor logs for suspicious activity

**For traditional deployments:**

- [ ] Update domain names in `nginx.conf`
- [ ] Update CORS origins in `Program.cs`
- [ ] SSL certificates properly configured
- [ ] DNS pointing to your server
- [ ] Firewall configured (ports 80, 443 only)
- [ ] Consider fail2ban for additional protection
- [ ] Regularly update SSL certificates
- [ ] Monitor logs for suspicious activity

### Updating the Application

```bash
# Pull latest changes
git pull

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Troubleshooting

**Common Issues:**

1. **SSL Certificate errors (traditional deployment)**

   ```bash
   # Check certificate validity
   openssl x509 -in ssl/fullchain.pem -text -noout

   # Renew Let's Encrypt certificate
   sudo certbot renew
   ```

2. **Service not responding**

   ```bash
   # Check container logs
   docker-compose logs nginx
   docker-compose logs svmesh-app

   # Restart services
   docker-compose restart
   ```

3. **Traefik connectivity issues**
   - Verify nginx is accessible on configured port
   - Check firewall rules allow Traefik to connect
   - Review Traefik logs for routing errors
   - Ensure domain DNS points to Traefik server

## Environment Variables

Required environment variables in `.env` file:

```bash
# Domain Configuration
DOMAIN=your-domain.com

# Nginx Port (for Traefik to connect to)
NGINX_PORT=8081

# Application settings
ASPNETCORE_ENVIRONMENT=Production

# Database settings (if using)
# DATABASE_URL=your_database_url_here
```

## Important Notes

- **Traefik Setup**: For Traefik reverse proxy deployment, see [Traefik Static IP Setup Guide](traefik-static-ip-setup.md)
- **DNS Configuration**: Ensure your domain DNS points to your Traefik server (if using) or your application server
- **Firewall Rules**: Configure appropriate firewall rules based on your deployment method
- **Monitoring**: Always monitor application logs and performance after deployment
