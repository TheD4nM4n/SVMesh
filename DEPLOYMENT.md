# SVMesh Docker Security Guide

## 🔐 Secure Public Deployment Guide

This guide will help you deploy your SVMesh application securely to the public internet.

## Quick Start

### Option A: Cloudflare Tunnel (Recommended)

1. **Set up Cloudflare Tunnel:**

   ```bash
   ./setup-tunnel.sh
   ```

2. **Follow the setup guide to get your tunnel token**

3. **Deploy with tunnel:**
   ```bash
   ./deploy.sh
   ```

### Option B: Traditional SSL Deployment

1. **Deploy the application:**

   ```bash
   ./deploy.sh
   ```

2. **Set up SSL certificates (required for production):**

   ```bash
   # Option 1: Using Certbot (Let's Encrypt) - Recommended
   sudo apt update && sudo apt install certbot
   sudo certbot certonly --standalone -d your-domain.com
   sudo cp /etc/letsencrypt/live/your-domain.com/fullchain.pem ssl/
   sudo cp /etc/letsencrypt/live/your-domain.com/privkey.pem ssl/

   # Option 2: Using existing certificates
   cp your-certificate.pem ssl/fullchain.pem
   cp your-private-key.pem ssl/privkey.pem
   ```

3. **Update domain configuration:**
   - Edit `nginx.conf` and replace `localhost` with your domain
   - Edit `SVMesh.Server/Program.cs` and update CORS origins

## Security Features Implemented

### 🛡️ Container Security

- **Multi-stage builds** for smaller, secure images
- **Non-root user** execution
- **Read-only file systems** where possible
- **Dropped capabilities** (principle of least privilege)
- **Security options** enabled
- **Health checks** for monitoring

### 🌐 Network Security

- **Nginx reverse proxy** for SSL termination
- **Rate limiting** to prevent abuse
- **Security headers** (HSTS, CSP, XSS protection)
- **CORS configuration** for API security
- **Hidden server tokens**

### 🔒 Application Security

- **HTTPS enforcement** in production
- **Anti-forgery tokens**
- **Input validation** and sanitization
- **Secure cookie settings**
- **Exception handling** without information leakage

## Production Checklist

### Before Deployment

- [ ] Update domain names in `nginx.conf`
- [ ] Update CORS origins in `Program.cs`
- [ ] Obtain SSL certificates
- [ ] Configure DNS to point to your server
- [ ] Set up firewall rules

### Server Security

```bash
# 1. Update system packages
sudo apt update && sudo apt upgrade -y

# 2. Configure firewall (UFW example)
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow ssh
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable

# 3. Install fail2ban for intrusion prevention
sudo apt install fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban

# 4. Set up automatic security updates
sudo apt install unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades
```

### SSL Certificate Automation

```bash
# Add to crontab for automatic renewal
sudo crontab -e
# Add this line:
# 0 12 * * * /usr/bin/certbot renew --quiet && docker-compose restart nginx
```

## Monitoring and Maintenance

### View Logs

```bash
# Application logs
docker-compose logs -f svmesh-app

# Nginx logs
docker-compose logs -f nginx

# System logs
tail -f logs/access.log
tail -f logs/error.log
```

### Health Monitoring

```bash
# Check application health
curl -f http://localhost/health

# Monitor container status
docker-compose ps

# Resource usage
docker stats
```

### Updates

```bash
# Update application
git pull
./deploy.sh

# Update base images
docker-compose pull
docker-compose up -d --build
```

## Security Considerations

### Network Security

1. **Use HTTPS only** - HTTP should redirect to HTTPS
2. **Configure proper CORS** - Only allow trusted origins
3. **Rate limiting** - Prevent brute force attacks
4. **DDoS protection** - Consider Cloudflare or similar

### System Security

1. **Regular updates** - Keep OS and Docker updated
2. **User permissions** - Never run as root
3. **File permissions** - Restrict access to sensitive files
4. **Network isolation** - Use Docker networks

### Application Security

1. **Input validation** - Sanitize all user inputs
2. **Authentication** - Implement proper auth if needed
3. **Session management** - Secure session handling
4. **Error handling** - Don't expose sensitive information

## Troubleshooting

### Common Issues

**Container won't start:**

```bash
docker-compose logs svmesh-app
```

**SSL certificate issues:**

```bash
# Check certificate validity
openssl x509 -in ssl/fullchain.pem -text -noout
```

**Permission denied:**

```bash
# Fix file permissions
sudo chown -R $USER:$USER .
```

**Port already in use:**

```bash
# Find what's using the port
sudo netstat -tulpn | grep :80
sudo netstat -tulpn | grep :443
```

## Advanced Configuration

### Load Balancing

For high availability, consider multiple instances:

```yaml
# In docker-compose.yml
svmesh-app:
  deploy:
    replicas: 3
```

### Database Integration

Add a database service to your docker-compose.yml:

```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_DB: svmesh
    POSTGRES_USER: svmesh_user
    POSTGRES_PASSWORD: secure_password
  volumes:
    - postgres_data:/var/lib/postgresql/data
```

### Backup Strategy

```bash
#!/bin/bash
# backup.sh
docker-compose exec postgres pg_dump -U svmesh_user svmesh > backup_$(date +%Y%m%d).sql
```

## Support

For issues or questions:

1. Check logs first: `docker-compose logs`
2. Review security settings
3. Verify SSL certificate configuration
4. Test network connectivity

Remember: Security is an ongoing process, not a one-time setup!
