#!/bin/bash

# SVMesh Docker Deployment Script
# This script builds and deploys the SVMesh application securely

set -e

echo "🚀 Starting SVMesh Docker deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p ssl logs

# Build the application
print_status "Building Docker images..."
docker-compose build --no-cache

# Check for Cloudflare Tunnel configuration
if [ -f ".env" ] && grep -q "CLOUDFLARE_TUNNEL_TOKEN=" .env && ! grep -q "your_tunnel_token_here" .env; then
    print_status "Cloudflare Tunnel configuration detected - using tunnel mode"
    TUNNEL_MODE=true
    
    # Use Cloudflare-optimized nginx config
    if [ -f "nginx-cloudflare.conf" ]; then
        print_status "Using Cloudflare-optimized nginx configuration"
        cp nginx-cloudflare.conf nginx.conf.tunnel
        # Update docker-compose to use the tunnel config
        sed -i 's|./nginx.conf:/etc/nginx/nginx.conf:ro|./nginx.conf.tunnel:/etc/nginx/nginx.conf:ro|' docker-compose.yml
    fi
else
    print_warning "No Cloudflare Tunnel token found in .env file"
    print_warning "For Cloudflare Tunnel deployment, run: ./setup-tunnel.sh"
    TUNNEL_MODE=false
    
    # Create necessary directories for standard deployment
    mkdir -p ssl logs
fi

# Security check: Ensure we're not running as root in production
print_status "Performing security checks..."
if [ "$(id -u)" = "0" ]; then
    print_warning "Running as root. Consider creating a dedicated user for production deployment."
fi

# SSL Certificate setup (skip for Cloudflare Tunnel mode)
if [ "$TUNNEL_MODE" = "true" ]; then
    print_status "Cloudflare Tunnel mode: SSL handled by Cloudflare, no local certificates needed"
else
    if [ ! -f "ssl/fullchain.pem" ] || [ ! -f "ssl/privkey.pem" ]; then
        print_warning "SSL certificates not found in ssl/ directory."
        echo "For production deployment, you need SSL certificates."
        echo "Options:"
        echo "1. Use Let's Encrypt: certbot certonly --standalone -d your-domain.com"
        echo "2. Use existing certificates: Place fullchain.pem and privkey.pem in ssl/ directory"
        echo "3. Continue without SSL (NOT recommended for production)"
        echo
        read -p "Continue without SSL? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_error "Deployment cancelled. Please set up SSL certificates first."
            exit 1
        fi
    fi
fi

# Start the services
print_status "Starting SVMesh services..."
docker-compose up -d

# Wait for services to be ready
print_status "Waiting for services to start..."
sleep 10

# Health check
print_status "Performing health check..."
if [ "$TUNNEL_MODE" = "true" ]; then
    # For tunnel mode, check internal nginx directly
    if docker exec svmesh-nginx curl -f http://localhost/ > /dev/null 2>&1; then
        print_status "✅ SVMesh is running successfully!"
        echo
        echo "🌐 Application Access:"
        echo "   - Via Cloudflare Tunnel: Check your Cloudflare dashboard for the public URL"
        echo "   - Local testing: docker exec svmesh-nginx curl -s http://localhost/"
    else
        print_error "Health check failed. Check logs with: docker-compose logs"
        exit 1
    fi
else
    if curl -f http://localhost/health > /dev/null 2>&1; then
        print_status "✅ SVMesh is running successfully!"
        echo
        echo "🌐 Application URLs:"
        echo "   - HTTP: http://localhost"
        if [ -f "ssl/fullchain.pem" ]; then
            echo "   - HTTPS: https://localhost"
        fi
    else
        print_error "Health check failed. Check logs with: docker-compose logs"
        exit 1
    fi
fi

echo
echo "📊 Management Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart: docker-compose restart"
echo "   - Update: ./deploy.sh"

echo
if [ "$TUNNEL_MODE" = "true" ]; then
    print_status "🔒 Security Reminders (Cloudflare Tunnel):"
    echo "   1. SSL/TLS is handled automatically by Cloudflare"
    echo "   2. No firewall ports need to be opened (tunnel handles connectivity)"
    echo "   3. Configure Cloudflare security rules in your dashboard"
    echo "   4. Regularly update Docker images"
    echo "   5. Monitor logs for suspicious activity"
    echo "   6. Review Cloudflare Access policies if using Zero Trust"
else
    print_status "🔒 Security Reminders:"
    echo "   1. Update your domain in nginx.conf and Program.cs"
    echo "   2. Set up SSL certificates for HTTPS"
    echo "   3. Configure firewall to only allow ports 80 and 443"
    echo "   4. Regularly update Docker images"
    echo "   5. Monitor logs for suspicious activity"
    echo "   6. Consider setting up fail2ban for additional protection"
fi

print_status "Deployment completed successfully! 🎉"