# 🚀 Bus Tracking System - Deployment Guide

## Deployment Options

### Option 1: Railway (Recommended - Easy & Free)

1. **Go to [Railway.app](https://railway.app)**
2. **Sign up/Login** with your GitHub account
3. **Click "New Project"** → **"Deploy from GitHub repo"**
4. **Select your repository**: `Bus-Tracking-Project/Bus_tracking_system_backend`
5. **Railway will auto-detect Docker** and start deployment
6. **Add Environment Variables**:
   ```
   NODE_ENV=production
   PORT=3000
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your-super-secret-jwt-key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASSWORD=your_app_password
   UPLOAD_PATH=/app/uploads/CommentImages
   ```
7. **Add PostgreSQL Database** (Railway will provide DATABASE_URL)
8. **Deploy!** Your app will be live at `https://your-app-name.railway.app`

### Option 2: Heroku

1. **Install Heroku CLI**
2. **Login**: `heroku login`
3. **Create app**: `heroku create your-bus-tracking-app`
4. **Add PostgreSQL**: `heroku addons:create heroku-postgresql:hobby-dev`
5. **Set environment variables**:
   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set JWT_SECRET=your-super-secret-jwt-key
   heroku config:set EMAIL_USER=your_email@gmail.com
   heroku config:set EMAIL_PASSWORD=your_app_password
   ```
6. **Deploy**: `git push heroku main`

### Option 3: DigitalOcean App Platform

1. **Go to [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)**
2. **Create App** → **GitHub** → **Select Repository**
3. **Configure**:
   - **Source**: `Bus-Tracking-Project/Bus_tracking_system_backend`
   - **Branch**: `main`
   - **Build Command**: `npm run build`
   - **Run Command**: `npm run start:prod`
4. **Add Database**: PostgreSQL addon
5. **Set Environment Variables**
6. **Deploy**

### Option 4: VPS Deployment (Advanced)

1. **Get a VPS** (DigitalOcean, AWS EC2, etc.)
2. **Install Docker** on the server
3. **Clone your repository**:
   ```bash
   git clone https://github.com/Bus-Tracking-Project/Bus_tracking_system_backend.git
   cd Bus_tracking_system_backend
   ```
4. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your production values
   ```
5. **Deploy with Docker Compose**:
   ```bash
   docker-compose up -d
   ```

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://username:password@host:port/database

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (for OTP)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password

# Server
PORT=3000
NODE_ENV=production

# Uploads
UPLOAD_PATH=/app/uploads/CommentImages
```

## Database Setup

### For Production:
1. **Create PostgreSQL database**
2. **Run migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

## Health Check

Your deployed app should respond to:
- `GET /health` - Health check endpoint
- `GET /api-docs` - API documentation (Swagger)

## Monitoring

- Check logs: `heroku logs --tail` (Heroku)
- Monitor performance in your hosting platform dashboard
- Set up error tracking (Sentry, etc.)

## Security Checklist

- [ ] Change default JWT secret
- [ ] Use strong database passwords
- [ ] Enable HTTPS (usually automatic on platforms)
- [ ] Set up proper CORS for your frontend domain
- [ ] Regular security updates

## Troubleshooting

### Common Issues:
1. **Database connection failed**: Check DATABASE_URL
2. **Permission denied**: Check file upload paths
3. **Port binding**: Ensure PORT environment variable is set
4. **Build failures**: Check Node.js version compatibility

### Logs to Check:
- Application logs
- Database connection logs
- File upload errors
- Email sending errors
