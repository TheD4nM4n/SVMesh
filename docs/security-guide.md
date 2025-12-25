# SVMesh Production Security Guide

This guide covers security best practices and configurations for deploying SVMesh in production environments.

## Security Overview

SVMesh implements multiple layers of security:

- **Container Security**: Multi-stage builds, non-root users, minimal attack surface
- **Network Security**: Reverse proxy, rate limiting, security headers
- **Application Security**: HTTPS enforcement, CORS, input validation
- **Infrastructure Security**: Firewall rules, monitoring, access controls

## Container Security

### Multi-stage Builds

SVMesh uses multi-stage Docker builds to minimize image size and attack surface:

```dockerfile
# Build stage - includes build tools and dependencies
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY ["SVMesh.Server/SVMesh.Server.csproj", "SVMesh.Server/"]
RUN dotnet restore "SVMesh.Server/SVMesh.Server.csproj"

# Runtime stage - only includes runtime and application
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS final
WORKDIR /app
COPY --from=build /app .
```

**Security Benefits:**

- Reduces image size by 60-80%
- Removes build tools and source code from final image
- Minimizes potential vulnerabilities

### Non-Root User Execution

Containers run as non-root users:

```dockerfile
# Create non-root user
RUN addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 --ingroup nodejs nextjs

# Switch to non-root user
USER nextjs
```

**Security Benefits:**

- Limits potential damage from container escape
- Prevents privilege escalation attacks
- Follows principle of least privilege

### Security Options

Docker Compose includes security configurations:

```yaml
services:
  svmesh-server:
    security_opt:
      - no-new-privileges:true
    cap_drop:
      - ALL
    cap_add:
      - NET_BIND_SERVICE # Only if needed for port binding
    read_only: true
    tmpfs:
      - /tmp
      - /var/run
```

**Configuration Details:**

- `no-new-privileges`: Prevents privilege escalation
- `cap_drop: ALL`: Removes all capabilities
- `read_only: true`: Makes filesystem read-only
- `tmpfs`: Provides writable temporary directories

### Health Checks

Containers include health monitoring:

```yaml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:5000/health"]
  interval: 30s
  timeout: 10s
  retries: 3
  start_period: 40s
```

## Network Security

### Nginx Reverse Proxy

Nginx provides SSL termination and security features:

```nginx
# Security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

# HSTS header (only over HTTPS)
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;

# Hide nginx version
server_tokens off;

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req zone=api burst=20 nodelay;
```

### SSL/TLS Configuration

**For Traditional Deployments:**

```nginx
# SSL protocols and ciphers
ssl_protocols TLSv1.2 TLSv1.3;
ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256;
ssl_prefer_server_ciphers off;

# SSL session settings
ssl_session_cache shared:SSL:10m;
ssl_session_timeout 10m;

# OCSP stapling
ssl_stapling on;
ssl_stapling_verify on;
```

**For Traefik Reverse Proxy:**

- SSL/TLS handled by Traefik with Let's Encrypt
- Automatic certificate management and renewal
- Modern TLS configuration by default

### CORS Configuration

Application-level CORS settings in `Program.cs`:

```csharp
builder.Services.AddCors(options =>
{
    options.AddPolicy("Production", policy =>
    {
        policy
            .WithOrigins(
                "https://your-domain.com",
                "https://www.your-domain.com"
            )
            .AllowAnyMethod()
            .AllowAnyHeader()
            .AllowCredentials();
    });
});
```

## Application Security

### HTTPS Enforcement

Force HTTPS in production:

```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseHttpsRedirection();
    app.UseHsts();
}
```

### Anti-Forgery Protection

Enable anti-forgery tokens:

```csharp
builder.Services.AddAntiforgery(options =>
{
    options.Cookie.SecurePolicy = CookieSecurePolicy.Always;
    options.Cookie.SameSite = SameSiteMode.Strict;
});
```

### Input Validation

Implement robust input validation:

```csharp
[HttpPost]
public async Task<IActionResult> UpdateContent([FromBody] UpdateContentRequest request)
{
    // Validate input
    if (!ModelState.IsValid)
    {
        return BadRequest(ModelState);
    }

    // Sanitize content
    var sanitizedContent = _htmlSanitizer.Sanitize(request.Content);

    // Process request...
}
```

### Error Handling

Secure error handling prevents information leakage:

```csharp
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

// Custom error handling
app.UseExceptionHandler(errorApp =>
{
    errorApp.Run(async context =>
    {
        context.Response.StatusCode = 500;
        context.Response.ContentType = "application/json";

        var response = new { error = "Internal server error" };
        await context.Response.WriteAsync(JsonSerializer.Serialize(response));
    });
});
```

## Infrastructure Security

### Server Hardening

**System Updates:**

```bash
# Keep system updated
sudo apt update && sudo apt upgrade -y

# Install security updates automatically
sudo apt install unattended-upgrades
sudo dpkg-reconfigure unattended-upgrades
```

**Firewall Configuration:**

```bash
# Configure UFW (Uncomplicated Firewall)
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Allow SSH (change 22 to your custom port if configured)
sudo ufw allow 22/tcp

# For traditional deployment (allow HTTP/HTTPS)
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# For Traefik deployment (allow from Traefik server only)
# Replace <traefik-server-ip> with your Traefik server's IP
sudo ufw allow from <traefik-server-ip> to any port 8081

# Enable firewall
sudo ufw enable

# Check status
sudo ufw status verbose
```

**SSH Hardening:**

```bash
# Edit SSH configuration
sudo nano /etc/ssh/sshd_config

# Recommended settings:
# Port 2222                    # Change default port
# PermitRootLogin no          # Disable root login
# PasswordAuthentication no   # Use key-based auth only
# PubkeyAuthentication yes    # Enable key authentication
# MaxAuthTries 3              # Limit auth attempts

# Restart SSH service
sudo systemctl restart sshd
```

### Docker Security

**Docker Daemon Configuration:**

```json
# /etc/docker/daemon.json
{
  "live-restore": true,
  "userland-proxy": false,
  "no-new-privileges": true,
  "log-driver": "json-file",
  "log-opts": {
    "max-size": "10m",
    "max-file": "3"
  }
}
```

**Docker Compose Security:**

```yaml
# docker-compose.yml security settings
version: "3.8"

services:
  svmesh-server:
    # ... other settings
    restart: unless-stopped
    user: "1001:1001" # Non-root user
    read_only: true
    tmpfs:
      - /tmp:size=100M,noexec,nosuid,nodev
    security_opt:
      - no-new-privileges:true
      - apparmor:docker-default
    cap_drop:
      - ALL
    networks:
      - svmesh-internal

networks:
  svmesh-internal:
    driver: bridge
    internal: true # No external access
```

### Monitoring and Logging

**Log Management:**

```bash
# Configure log rotation
sudo nano /etc/logrotate.d/docker-compose

# Content:
/var/log/svmesh/*.log {
    daily
    rotate 14
    compress
    delaycompress
    missingok
    notifempty
    create 0644 docker docker
}
```

**Health Monitoring:**

```bash
#!/bin/bash
# health-check.sh

# Check container health
if ! docker-compose ps | grep -q "Up"; then
    echo "$(date): SVMesh containers not running" >> /var/log/svmesh/alerts.log
    # Send alert (email, Slack, etc.)
fi

# Check disk usage
DISK_USAGE=$(df / | awk 'NR==2 {print $5}' | sed 's/%//')
if [ $DISK_USAGE -gt 80 ]; then
    echo "$(date): High disk usage: ${DISK_USAGE}%" >> /var/log/svmesh/alerts.log
fi

# Check memory usage
MEMORY_USAGE=$(free | awk 'NR==2{printf "%.0f", $3*100/$2}')
if [ $MEMORY_USAGE -gt 85 ]; then
    echo "$(date): High memory usage: ${MEMORY_USAGE}%" >> /var/log/svmesh/alerts.log
fi
```

**Setup monitoring cron:**

```bash
# Add to crontab (crontab -e)
*/5 * * * * /path/to/health-check.sh
```

## Production Checklist

### Pre-Deployment Security

- [ ] **SSL certificates** configured (Let's Encrypt recommended)
- [ ] **Domain configuration** updated in nginx.conf
- [ ] **CORS origins** updated in Program.cs
- [ ] **Environment variables** properly configured
- [ ] **Secrets management** implemented (not in plain text files)
- [ ] **Database security** configured (if using database)

### Server Security

- [ ] **System updates** installed
- [ ] **Firewall** configured and enabled
- [ ] **SSH hardening** completed
- [ ] **Non-root user** created for application
- [ ] **Docker security** configurations applied
- [ ] **Log rotation** configured
- [ ] **Monitoring scripts** deployed

### Application Security

- [ ] **HTTPS enforcement** enabled
- [ ] **Security headers** configured
- [ ] **Rate limiting** implemented
- [ ] **Input validation** thorough
- [ ] **Error handling** secure (no information leakage)
- [ ] **Session security** configured
- [ ] **CORS policy** restrictive

### Ongoing Security

- [ ] **Regular updates** scheduled
- [ ] **Log monitoring** automated
- [ ] **Security scanning** scheduled
- [ ] **Backup procedures** tested
- [ ] **Incident response plan** documented
- [ ] **Access reviews** scheduled

## Incident Response

### Security Incident Checklist

1. **Immediate Response**

   - Isolate affected systems
   - Preserve evidence
   - Stop active threats

2. **Assessment**

   - Identify scope of breach
   - Determine what data was accessed
   - Document timeline of events

3. **Containment**

   - Patch vulnerabilities
   - Update access controls
   - Implement additional monitoring

4. **Recovery**

   - Restore from clean backups if needed
   - Validate system integrity
   - Gradually restore services

5. **Post-Incident**
   - Document lessons learned
   - Update security procedures
   - Implement preventive measures

### Emergency Procedures

**Immediate Shutdown:**

```bash
# Stop all services
docker-compose down

# If compromised, remove containers
docker-compose down --volumes --remove-orphans
```

**System Recovery:**

```bash
# Restore from backup
./restore-backup.sh

# Verify integrity
./verify-integrity.sh

# Start with enhanced monitoring
./deploy-secure.sh --enhanced-monitoring
```

## Security Tools and Resources

### Recommended Tools

- **Fail2ban**: Intrusion prevention
- **ClamAV**: Antivirus scanning
- **Lynis**: Security auditing
- **Docker Bench**: Docker security assessment
- **OWASP ZAP**: Web application security testing

### Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [ASP.NET Core Security](https://docs.microsoft.com/en-us/aspnet/core/security/)
- [Traefik Security Documentation](https://doc.traefik.io/traefik/https/tls/)

## Contact and Support

For security issues or questions:

- Create a GitHub issue (for non-sensitive matters)
- Email security contact (for sensitive vulnerabilities)
- Follow responsible disclosure practices
