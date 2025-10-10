
# 🐳 Docker Deployment Guide

This guide explains how to deploy the Bus Tracking System using Docker.

## 📋 Prerequisites

- Docker Engine 20.10+
- Docker Compose 2.0+
- At least 2GB RAM available
- Ports 3000, 5432, 6379 available (or modify in docker-compose.yml)

## 🚀 Quick Start

### 1. Production Deployment

```bash
# Clone the repository
git clone <your-repo-url>
cd bus_tracking_system

# Create environment file
cp .env.production.example .env.production
# Edit .env.production with your actual values

# Build and start all services
docker-compose up -d

# Check logs
docker-compose logs -f app
```

### 2. Development Setup

```bash
# Start development services (database, redis, adminer)
docker-compose -f docker-compose.dev.yml up -d

# Run the application locally
npm install
npm run start:dev
```

## 🔧 Configuration

### Environment Variables

Create a `.env.production` file with the following variables:

```env
# Application
NODE_ENV=production
PORT=3000

# Database
DATABASE_URL=postgresql://postgres:your_secure_password@postgres:5432/bus_tracking

# JWT Configuration
JWT_SECRET=your-super-secure-jwt-secret-key

# Email Configuration
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Clerk Authentication
CLERK_API_KEY=your-clerk-api-key
CLERK_URL=https://api.clerk.com/v1
```

### Database Setup

The PostgreSQL database will be automatically initialized. You can access it via:

- **Host:** localhost
- **Port:** 5432
- **Database:** bus_tracking
- **Username:** postgres
- **Password:** postgres123 (change in production!)

## 📊 Services

### Production Services

| Service | Port | Description |
|---------|------|-------------|
| **app** | 3000 | Bus Tracking API |
| **postgres** | 5432 | PostgreSQL Database |
| **redis** | 6379 | Redis Cache |

### Development Services

| Service | Port | Description |
|---------|------|-------------|
| **postgres** | 5433 | PostgreSQL Database (dev) |
| **redis** | 6380 | Redis Cache (dev) |
| **adminer** | 8080 | Database Admin Interface |

## 🛠️ Commands

### Production Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# View logs
docker-compose logs -f app

# Restart a service
docker-compose restart app

# Scale the application
docker-compose up -d --scale app=3

# Update and restart
docker-compose pull
docker-compose up -d
```

### Development Commands

```bash
# Start development services
docker-compose -f docker-compose.dev.yml up -d

# Stop development services
docker-compose -f docker-compose.dev.yml down

# Access database admin
open http://localhost:8080
```

## 🔍 Health Checks

The application includes health check endpoints:

- **Health Check:** `GET /health`
- **API Documentation:** `GET /api-docs`

## 📁 Volumes

### Production Volumes

- `postgres_data`: PostgreSQL data persistence
- `redis_data`: Redis data persistence
- `./uploads`: File uploads directory

### Development Volumes

- `postgres_dev_data`: Development PostgreSQL data
- `redis_dev_data`: Development Redis data

## 🔒 Security Considerations

### Production Security

1. **Change default passwords** in environment variables
2. **Use strong JWT secrets** (32+ characters)
3. **Enable SSL/TLS** with reverse proxy (nginx/traefik)
4. **Restrict database access** to application only
5. **Use secrets management** for sensitive data

### Example with Nginx Reverse Proxy

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Port conflicts:** Change ports in docker-compose.yml
2. **Permission issues:** Check file permissions for uploads directory
3. **Database connection:** Verify DATABASE_URL format
4. **Memory issues:** Increase Docker memory limits

### Debug Commands

```bash
# Check container status
docker-compose ps

# View container logs
docker-compose logs app

# Access container shell
docker-compose exec app sh

# Check database connection
docker-compose exec postgres psql -U postgres -d bus_tracking
```

## 📈 Monitoring

### Health Monitoring

```bash
# Check application health
curl http://localhost:3000/health

# Check database health
docker-compose exec postgres pg_isready -U postgres

# Check Redis health
docker-compose exec redis redis-cli ping
```

### Log Monitoring

```bash
# Follow all logs
docker-compose logs -f

# Follow specific service logs
docker-compose logs -f app

# View last 100 lines
docker-compose logs --tail=100 app
```

## 🔄 Updates

### Application Updates

```bash
# Pull latest changes
git pull origin main

# Rebuild and restart
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

### Database Migrations

```bash
# Run migrations (if needed)
docker-compose exec app npm run db:migrate
```

## 📞 Support

For issues or questions:

1. Check the logs: `docker-compose logs -f`
2. Verify environment variables
3. Check Docker and Docker Compose versions
4. Review the troubleshooting section above

---

**Happy Deploying! 🚀**
