# SVMesh

The upcoming website for the Susquehanna Valley Mesh, serving the centeral Pennsylvania region.

### Technology Stack

**Frontend:**

- React 19 with TypeScript
- Material-UI (MUI) for components and styling
- React Router for navigation
- Vite for build tooling and development
- React Markdown for content rendering

**Backend:**

- ASP.NET Core 8.0
- Swagger/OpenAPI for API documentation
- Built-in health checks
- CORS and security middleware

**Infrastructure:**

- Docker containers for all services
- Nginx reverse proxy with security headers
- Support for SSL/TLS termination
- Traefik reverse proxy integration
- Multi-stage Docker builds for optimization

## 📋 Prerequisites

- **Docker** (20.10+)
- **Docker Compose** (2.0+)
- **Node.js** (18+) - for local development
- **.NET 8.0 SDK** - for local development
- **Domain name** - for production deployments

## 🚀 Quick Start

### Development

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd svmesh
   ```

2. **Start development environment**

   ```bash
   # Option 1: Using Docker Compose for development (recommended)
   docker-compose -f docker-compose.dev.yml up

   # Option 2: Run components separately for active development
   # Terminal 1 - Backend
   cd SVMesh.Server && dotnet run

   # Terminal 2 - Frontend
   cd svmesh.client && npm run dev

   # Option 3: Production-like environment
   docker-compose up
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000
   - API Documentation: http://localhost:5000/swagger

### Production Deployment

For production deployments, see our comprehensive documentation:

- **[📚 Deployment Guide](docs/deployment-guide.md)** - Complete deployment instructions
- **[🌐 Traefik Setup Guide](docs/traefik-static-ip-setup.md)** - Reverse proxy deployment
- **[🔒 Security Guide](docs/security-guide.md)** - Security best practices

## 📁 Project Structure

```
svmesh/
├── docs/                          # Comprehensive documentation
│   ├── deployment-guide.md        # Production deployment guide
│   ├── traefik-static-ip-setup.md # Traefik reverse proxy setup
│   └── security-guide.md          # Security best practices
├── SVMesh.Server/                 # ASP.NET Core backend
│   ├── Controllers/               # API controllers
│   ├── Properties/                # Launch settings
│   ├── Program.cs                 # Application entry point
│   └── *.csproj                   # Project configuration
├── svmesh.client/                 # React frontend
│   ├── src/                       # Source code
│   │   ├── components/            # Reusable components
│   │   ├── pages/                 # Page components
│   │   ├── layouts/               # Layout components
│   │   └── utils/                 # Utility functions
│   ├── public/                    # Static assets
│   └── package.json               # NPM dependencies
├── docker-compose.yml             # Production containers
├── Dockerfile                     # Multi-stage build
├── nginx.conf                     # Nginx configuration
├── nginx.conf.traefik             # Traefik-optimized config
├── traefik-config-example.yml     # Example Traefik config
└── README.md                      # This file
```

## 🔧 Configuration

### Environment Variables

Create a `.env` file for production configuration:

```bash
# Domain Configuration
DOMAIN=your-domain.com

# Nginx Port (for Traefik to connect to)
NGINX_PORT=8081

# Application settings
ASPNETCORE_ENVIRONMENT=Production

# Database (if using)
# DATABASE_URL=your_database_url
```

### Application Settings

Key configuration files:

- `SVMesh.Server/appsettings.json` - Backend configuration
- `svmesh.client/vite.config.ts` - Frontend build configuration
- `docker-compose.yml` - Container orchestration
- `nginx.conf` - Reverse proxy settings

## 🛠️ Development

### Local Development Setup

1. **Install dependencies**

   ```bash
   # Backend dependencies
   cd SVMesh.Server
   dotnet restore

   # Frontend dependencies
   cd ../svmesh.client
   npm install
   ```

2. **Run in development mode**

   ```bash
   # Terminal 1 - Backend
   cd SVMesh.Server
   dotnet run

   # Terminal 2 - Frontend
   cd svmesh.client
   npm run dev
   ```

3. **Build for production**

   ```bash
   # Build all containers
   docker-compose build

   # Run production build locally
   docker-compose up
   ```

### Code Style and Linting

```bash
# Frontend linting
cd svmesh.client
npm run lint

# Format code (if prettier is configured)
npm run format
```

## 📊 Monitoring and Maintenance

### Health Checks

The application includes built-in health monitoring:

```bash
# Check application health
curl http://localhost:5000/health

# Monitor container health
docker-compose ps

# View logs
docker-compose logs -f
```

### Log Management

Logs are available through Docker Compose:

```bash
# View all logs
docker-compose logs

# Follow specific service logs
docker-compose logs -f svmesh-server
docker-compose logs -f nginx
```

### Updates and Maintenance

```bash
# Update to latest version
git pull
docker-compose build --no-cache
docker-compose up -d

# Backup data (customize for your needs)
docker-compose exec postgres pg_dump -U user database > backup.sql
```

## 🔒 Security

SVMesh implements multiple security layers:

- **Container Security**: Non-root users, minimal images, security options
- **Network Security**: Reverse proxy, rate limiting, security headers
- **Application Security**: HTTPS enforcement, CORS, input validation
- **Infrastructure**: Firewall rules, monitoring, access controls

For detailed security information, see the [Security Guide](docs/security-guide.md).

## 🚀 Deployment Options

### Traefik Reverse Proxy (Recommended)

- ✅ Automatic SSL/TLS with Let's Encrypt
- ✅ Modern reverse proxy with dynamic configuration
- ✅ Built-in load balancing
- ✅ Middleware support for security headers
- ✅ Works on separate machines (no Docker Swarm needed)

See: [Traefik Static IP Setup Guide](docs/traefik-static-ip-setup.md)

### Traditional HTTPS

- ✅ Full control over SSL certificates
- ✅ Standard hosting approach
- ✅ Works with any DNS provider
- ❗ Requires firewall configuration
- ❗ Manual SSL certificate management

See: [Deployment Guide](docs/deployment-guide.md)

## 📖 Documentation

Comprehensive documentation is available in the `docs/` directory:

- **[📚 docs/README.md](docs/README.md)** - Documentation overview
- **[🚀 Deployment Guide](docs/deployment-guide.md)** - Production deployment
- **[🌐 Traefik Setup Guide](docs/traefik-static-ip-setup.md)** - Reverse proxy setup
- **[🔒 Security Guide](docs/security-guide.md)** - Security best practices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test your changes thoroughly
5. Submit a pull request

### Development Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Update documentation for new features
- Test both development and production builds
- Ensure security best practices are followed

## 📝 Changelog

See individual component changelogs:

- [Server Changelog](SVMesh.Server/CHANGELOG.md)
- [Client Changelog](svmesh.client/CHANGELOG.md)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

- **Documentation**: Check the `docs/` directory for detailed guides
- **Issues**: Create a GitHub issue for bugs or feature requests
- **Security**: For security issues, please follow responsible disclosure practices

## 🙏 Acknowledgments

- Built with [ASP.NET Core](https://docs.microsoft.com/en-us/aspnet/core/)
- Frontend powered by [React](https://reactjs.org/) and [Material-UI](https://mui.com/)
- Containerization with [Docker](https://www.docker.com/)
- Reverse proxy with [Traefik](https://traefik.io/)

---

**SVMesh** - Modern, Secure, Scalable Web Applications
