#!/bin/bash

# Cloudflare Tunnel Setup Script for SVMesh
# This script helps you configure Cloudflare Tunnel integration

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_info() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

echo "🌐 SVMesh Cloudflare Tunnel Setup"
echo "=================================="

# Check if .env file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found, creating from template..."
    cp .env.example .env
fi

# Guide user through setup
print_info "To complete the Cloudflare Tunnel setup, follow these steps:"
echo ""
print_info "1. Log in to Cloudflare Dashboard: https://one.dash.cloudflare.com/"
echo ""
print_info "2. Navigate to Zero Trust > Access > Tunnels"
echo ""
print_info "3. Create a new tunnel:"
echo "   - Click 'Create a tunnel'"
echo "   - Choose 'Cloudflared'"
echo "   - Give it a name (e.g., 'svmesh')"
echo "   - Install cloudflared connector (choose Docker)"
echo ""
print_info "4. Configure your tunnel:"
echo "   - Add a public hostname:"
echo "     • Subdomain: your-subdomain (or leave blank for root domain)"
echo "     • Domain: your-domain.com"
echo "     • Service Type: HTTP"
echo "     • URL: http://nginx:80"
echo ""
print_info "5. Copy the tunnel token from the Docker run command shown"
echo "   Example: cloudflared tunnel --no-autoupdate run --token eyJhIjoiN..."
echo "   Copy everything after '--token '"
echo ""
print_info "6. Edit the .env file and set your tunnel token:"
echo "   CLOUDFLARE_TUNNEL_TOKEN=your_actual_token_here"
echo "   DOMAIN=your-domain.com"
echo ""
print_info "7. Run the deployment:"
echo "   ./deploy.sh"
echo ""

print_warning "Important Notes:"
echo "• Your domain DNS must be managed by Cloudflare"
echo "• The tunnel creates a CNAME record automatically"
echo "• No port forwarding or SSL certificates needed!"
echo "• Access your app at: https://your-domain.com"

echo ""
print_status "Setup guide complete! Edit .env file and run ./deploy.sh"