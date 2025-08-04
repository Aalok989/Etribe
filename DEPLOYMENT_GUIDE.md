# eTribe Deployment Guide

## Overview

This guide provides comprehensive instructions for deploying the eTribe application to various environments, from development to production.

## Prerequisites

### System Requirements
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 8.0.0 or higher
- **Git**: For version control
- **Web Server**: Nginx, Apache, or similar
- **SSL Certificate**: For HTTPS (production)

### Required Software
```bash
# Check Node.js version
node --version

# Check npm version
npm --version

# Check Git version
git --version
```

## Environment Setup

### 1. Development Environment

#### Clone Repository
```bash
git clone <repository-url>
cd etribe
```

#### Install Dependencies
```bash
npm install
```

#### Environment Variables
Create `.env.local` file in the root directory:
```env
# API Configuration
VITE_API_BASE_URL=https://api.etribes.ezcrm.site
VITE_CLIENT_SERVICE=your_client_service
VITE_AUTH_KEY=your_auth_key
VITE_RURL=your_rurl

# Development Settings
VITE_APP_ENV=development
VITE_DEBUG=true
```

#### Start Development Server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 2. Staging Environment

#### Environment Variables
Create `.env.staging` file:
```env
# API Configuration
VITE_API_BASE_URL=https://staging-api.etribes.ezcrm.site
VITE_CLIENT_SERVICE=staging_client_service
VITE_AUTH_KEY=staging_auth_key
VITE_RURL=staging_rurl

# Staging Settings
VITE_APP_ENV=staging
VITE_DEBUG=false
```

#### Build for Staging
```bash
npm run build:staging
```

### 3. Production Environment

#### Environment Variables
Create `.env.production` file:
```env
# API Configuration
VITE_API_BASE_URL=https://api.etribes.ezcrm.site
VITE_CLIENT_SERVICE=production_client_service
VITE_AUTH_KEY=production_auth_key
VITE_RURL=production_rurl

# Production Settings
VITE_APP_ENV=production
VITE_DEBUG=false
```

#### Build for Production
```bash
npm run build
```

## Build Configuration

### Vite Configuration
The project uses Vite for building. Key configuration in `vite.config.js`:

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false, // Disable for production
    minify: 'terser',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          utils: ['axios', 'react-toastify']
        }
      }
    }
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'https://api.etribes.ezcrm.site',
        changeOrigin: true,
        secure: true
      }
    }
  }
})
```

### Package.json Scripts
```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:staging": "vite build --mode staging",
    "build:production": "vite build --mode production",
    "preview": "vite preview",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix"
  }
}
```

## Deployment Methods

### 1. Static Hosting (Recommended)

#### Netlify Deployment
1. **Connect Repository**
   - Connect your Git repository to Netlify
   - Set build command: `npm run build`
   - Set publish directory: `dist`

2. **Environment Variables**
   - Go to Site settings > Environment variables
   - Add all required environment variables

3. **Build Settings**
   ```bash
   Build command: npm run build
   Publish directory: dist
   Node version: 18
   ```

#### Vercel Deployment
1. **Install Vercel CLI**
   ```bash
   npm i -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Environment Variables**
   - Add environment variables in Vercel dashboard
   - Or use `vercel env add` command

#### GitHub Pages
1. **Add GitHub Pages Script**
   ```json
   {
     "scripts": {
       "predeploy": "npm run build",
       "deploy": "gh-pages -d dist"
     }
   }
   ```

2. **Install gh-pages**
   ```bash
   npm install --save-dev gh-pages
   ```

3. **Deploy**
   ```bash
   npm run deploy
   ```

### 2. Traditional Web Server

#### Nginx Configuration
Create `/etc/nginx/sites-available/etribe`:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name your-domain.com;

    ssl_certificate /path/to/certificate.crt;
    ssl_certificate_key /path/to/private.key;

    root /var/www/etribe/dist;
    index index.html;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Handle client-side routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy
    location /api/ {
        proxy_pass https://api.etribes.ezcrm.site/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

#### Apache Configuration
Create `/etc/apache2/sites-available/etribe.conf`:
```apache
<VirtualHost *:80>
    ServerName your-domain.com
    DocumentRoot /var/www/etribe/dist

    <Directory /var/www/etribe/dist>
        Options Indexes FollowSymLinks
        AllowOverride All
        Require all granted
    </Directory>

    # Handle client-side routing
    RewriteEngine On
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteRule ^(.*)$ /index.html [QSA,L]

    # Security headers
    Header always set X-Frame-Options "SAMEORIGIN"
    Header always set X-XSS-Protection "1; mode=block"
    Header always set X-Content-Type-Options "nosniff"
    Header always set Referrer-Policy "no-referrer-when-downgrade"

    # Gzip compression
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
</VirtualHost>
```

### 3. Docker Deployment

#### Dockerfile
Create `Dockerfile`:
```dockerfile
# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build application
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built application
COPY --from=build /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Expose port
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose
Create `docker-compose.yml`:
```yaml
version: '3.8'

services:
  etribe:
    build: .
    ports:
      - "80:80"
    environment:
      - NODE_ENV=production
    restart: unless-stopped
```

#### Build and Run
```bash
# Build Docker image
docker build -t etribe .

# Run with Docker Compose
docker-compose up -d
```

## Environment-Specific Configurations

### Development
```bash
# Start development server
npm run dev

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix
```

### Staging
```bash
# Build for staging
npm run build:staging

# Preview staging build
npm run preview
```

### Production
```bash
# Build for production
npm run build

# Test production build locally
npm run preview
```

## Security Considerations

### 1. Environment Variables
- Never commit `.env` files to version control
- Use different API keys for different environments
- Rotate API keys regularly

### 2. HTTPS
- Always use HTTPS in production
- Configure SSL certificates properly
- Use HSTS headers

### 3. Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" 
      content="default-src 'self'; 
               script-src 'self' 'unsafe-inline' 'unsafe-eval'; 
               style-src 'self' 'unsafe-inline'; 
               img-src 'self' data: https:; 
               connect-src 'self' https://api.etribes.ezcrm.site;">
```

### 4. Security Headers
```nginx
# Nginx security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "no-referrer-when-downgrade" always;
add_header Strict-Transport-Security "max-age=31536000; includeSubDomains" always;
```

## Performance Optimization

### 1. Build Optimization
```javascript
// vite.config.js
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          charts: ['recharts'],
          utils: ['axios', 'react-toastify']
        }
      }
    },
    chunkSizeWarningLimit: 1000
  }
})
```

### 2. Caching Strategy
```nginx
# Cache static assets
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}

# Cache HTML files
location ~* \.html$ {
    expires 1h;
    add_header Cache-Control "public, must-revalidate";
}
```

### 3. Compression
```nginx
# Enable gzip compression
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;
```

## Monitoring and Logging

### 1. Error Monitoring
```javascript
// Add error boundary
import { ErrorBoundary } from 'react-error-boundary';

function ErrorFallback({ error }) {
  return (
    <div role="alert">
      <h2>Something went wrong:</h2>
      <pre>{error.message}</pre>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      {/* Your app */}
    </ErrorBoundary>
  );
}
```

### 2. Performance Monitoring
```javascript
// Add performance monitoring
import { toast } from 'react-toastify';

// Monitor API response times
api.interceptors.response.use(
  (response) => {
    console.log(`API Response Time: ${Date.now() - response.config.startTime}ms`);
    return response;
  },
  (error) => {
    console.error('API Error:', error);
    return Promise.reject(error);
  }
);
```

### 3. Analytics
```javascript
// Add Google Analytics
import { useEffect } from 'react';

function useAnalytics() {
  useEffect(() => {
    // Initialize analytics
    gtag('config', 'GA_MEASUREMENT_ID');
  }, []);
}
```

## Troubleshooting

### Common Issues

#### 1. Build Failures
```bash
# Clear cache and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Clear Vite cache
rm -rf dist .vite
```

#### 2. Environment Variables Not Loading
```bash
# Check environment file exists
ls -la .env*

# Verify variable names start with VITE_
grep VITE_ .env.local
```

#### 3. API Connection Issues
```bash
# Test API connectivity
curl -I https://api.etribes.ezcrm.site

# Check CORS configuration
curl -H "Origin: https://your-domain.com" \
     -H "Access-Control-Request-Method: POST" \
     -H "Access-Control-Request-Headers: Content-Type" \
     -X OPTIONS https://api.etribes.ezcrm.site
```

#### 4. Routing Issues
```nginx
# Ensure proper routing configuration
location / {
    try_files $uri $uri/ /index.html;
}
```

### Debug Commands
```bash
# Check build output
npm run build && ls -la dist/

# Test production build
npm run preview

# Check for linting issues
npm run lint

# Analyze bundle size
npm install -g vite-bundle-analyzer
vite-bundle-analyzer dist/stats.html
```

## Deployment Checklist

### Pre-Deployment
- [ ] All tests passing
- [ ] Linting issues resolved
- [ ] Environment variables configured
- [ ] API endpoints verified
- [ ] Build successful locally

### Deployment
- [ ] Build for target environment
- [ ] Upload files to server
- [ ] Configure web server
- [ ] Set up SSL certificate
- [ ] Configure domain DNS

### Post-Deployment
- [ ] Test all functionality
- [ ] Verify API connectivity
- [ ] Check performance metrics
- [ ] Monitor error logs
- [ ] Update documentation

## Rollback Strategy

### Quick Rollback
```bash
# Revert to previous version
git checkout <previous-commit>
npm run build
# Deploy previous build
```

### Database Rollback
```sql
-- If database changes were made
-- Restore from backup or run rollback scripts
```

This deployment guide provides comprehensive instructions for deploying the eTribe application across different environments and platforms. 