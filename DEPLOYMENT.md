# Hướng dẫn Deploy - Java Bronze Quiz Frontend

Tài liệu hướng dẫn chi tiết về cách deploy ứng dụng Frontend Vue 3 SPA lên các platform khác nhau.

---

## Mục lục

1. [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
2. [Chuẩn bị](#chuẩn-bị)
3. [Deploy trên Vercel](#deploy-trên-vercel)
4. [Deploy trên Netlify](#deploy-trên-netlify)
5. [Deploy trên VPS/Dedicated Server](#deploy-trên-vpsdedicated-server)
6. [Environment Variables](#environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## Yêu cầu hệ thống

### Build dependencies
- Node.js >= 18.x
- npm >= 9.x hoặc yarn >= 1.22.x

### Production requirements
- Web server: Nginx, Apache, hoặc bất kỳ static file server
- SSL Certificate (khuyến nghị HTTPS cho production)
- Domain name (optional nhưng khuyến nghị)

### Backend requirements
- Laravel Backend API đã được deploy và hoạt động
- CORS được cấu hình đúng cho frontend domain

---

## Chuẩn bị

### 1. Kiểm tra code

Trước khi deploy, đảm bảo code đã sẵn sàng:

```bash
# Kiểm tra git status
git status

# Kiểm tra không có uncommitted changes
git diff

# Test build locally
npm run build

# Test production build
npm run preview
```

### 2. Tag version

Khuyến nghị tạo git tag cho mỗi deployment:

```bash
# Tạo tag
git tag -a v1.0.0 -m "Production release v1.0.0"

# Push tag
git push origin v1.0.0
```

### 3. Test production build

```bash
# Build production
npm run build

# Preview production build
npm run preview --port 4173

# Mở browser và test
# http://localhost:4173
```

---

## Deploy trên Vercel

Vercel là platform được khuyến nghị cho Vue.js SPA với JAMstack architecture.

### Ưu điểm
- Automatic HTTPS
- Global CDN
- Zero-config deployment
- Auto deployments từ Git
- Free tier cho dự án nhỏ

### Bước 1: Tạo Vercel Account

1. Truy cập [vercel.com](https://vercel.com)
2. Đăng ký bằng GitHub/GitLab/Bitbucket

### Bước 2: Import Project

1. Click **"Add New..."** → **"Project"**
2. Import repository từ GitHub/GitLab
3. Select repository `quiz-frontend-vue`

### Bước 3: Cấu hình Build

**Framework Preset:** Vite

**Build Command:**
```bash
npm run build
```

**Output Directory:**
```
dist
```

**Install Command:**
```bash
npm install
```

### Bước 4: Cấu hình Environment Variables

Click **"Environment Variables"** và thêm:

| Key | Value | Environment |
|-----|-------|-------------|
| `VITE_API_BASE_URL` | `https://api.yourdomain.com` | Production, Preview |
| `VITE_APP_NAME` | `Java Bronze Quiz` | Production, Preview |
| `VITE_ENABLE_ACHIEVEMENTS` | `true` | Production, Preview |
| `VITE_ENABLE_LEADERBOARD` | `true` | Production, Preview |

**Lưu ý:** 
- Production: dùng cho domain chính
- Preview: dùng cho preview deployments
- Development: dùng cho local development (optional)

### Bước 5: Custom Domain (Optional)

1. Vào **Settings** → **Domains**
2. Add custom domain: `app.yourdomain.com`
3. Follow instructions để cấu hình DNS

### Bước 6: Deploy

Click **"Deploy"** và chờ deploy hoàn tất.

**Deploy URL:** `https://quiz-frontend-vue.vercel.app`

### Bước 7: Auto Deploy từ Git

Vercel tự động deploy mỗi khi:
- Push lên `main` branch → Production deployment
- Push lên các branches khác → Preview deployment
- Tạo Pull Request → Preview deployment

---

## Deploy trên Netlify

Netlify là platform tuyệt vời khác cho static sites với Git-based workflow.

### Bước 1: Tạo Netlify Account

1. Truy cập [netlify.com](https://netlify.com)
2. Đăng ký bằng GitHub/GitLab/Bitbucket

### Bước 2: Create New Site

1. Click **"Add new site"** → **"Import an existing project"**
2. Chọn repository

### Bước 3: Cấu hình Build Settings

**Build command:**
```bash
npm run build
```

**Publish directory:**
```
dist
```

**Base directory:** (để trống)

### Bước 4: Environment Variables

Vào **Site settings** → **Environment variables** và thêm:

| Key | Value | Scope |
|-----|-------|-------|
| `VITE_API_BASE_URL` | `https://api.yourdomain.com` | Production, Deploy previews |
| `VITE_APP_NAME` | `Java Bronze Quiz` | Production, Deploy previews |
| `VITE_ENABLE_ACHIEVEMENTS` | `true` | Production, Deploy previews |
| `VITE_ENABLE_LEADERBOARD` | `true` | Production, Deploy previews |

### Bước 5: Redirect Rules

Tạo file `public/_redirects` (hoặc `netlify.toml`):

```bash
# public/_redirects
/*    /index.html   200
```

Hoặc cấu hình trong `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Bước 6: Deploy

Click **"Deploy site"**.

**Deploy URL:** `https://random-name-123.netlify.app`

### Bước 7: Custom Domain

1. Domain settings → Add custom domain
2. Cấu hình DNS theo hướng dẫn

---

## Deploy trên VPS/Dedicated Server

Nếu bạn có VPS hoặc dedicated server, có thể deploy theo cách truyền thống.

### Bước 1: Setup Server

#### Cài đặt Node.js

```bash
# Ubuntu/Debian
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version
npm --version
```

#### Cài đặt Nginx

```bash
sudo apt update
sudo apt install nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Bước 2: Build Application

```bash
# Clone repository
git clone https://github.com/yourusername/quiz-frontend-vue.git
cd quiz-frontend-vue

# Install dependencies
npm install

# Build for production
npm run build
```

### Bước 3: Cấu hình Nginx

Tạo configuration file:

```bash
sudo nano /etc/nginx/sites-available/quiz-frontend
```

Nội dung:

```nginx
server {
    listen 80;
    listen [::]:80;
    
    server_name app.yourdomain.com;
    
    root /var/www/quiz-frontend/dist;
    index index.html;
    
    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json application/javascript;
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    
    # SPA fallback
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache static assets
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Disable cache for index.html
    location = /index.html {
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }
}
```

Enable site:

```bash
sudo ln -s /etc/nginx/sites-available/quiz-frontend /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

### Bước 4: Copy Build Files

```bash
# Create directory
sudo mkdir -p /var/www/quiz-frontend

# Copy build files
sudo cp -r dist/* /var/www/quiz-frontend/

# Set permissions
sudo chown -R www-data:www-data /var/www/quiz-frontend
```

### Bước 5: SSL với Let's Encrypt

```bash
# Install Certbot
sudo apt install certbot python3-certbot-nginx

# Obtain certificate
sudo certbot --nginx -d app.yourdomain.com

# Auto-renewal (đã tự động setup)
sudo certbot renew --dry-run
```

### Bước 6: Auto Deployment Script

Tạo script `deploy.sh`:

```bash
#!/bin/bash

# Configuration
REPO_URL="https://github.com/yourusername/quiz-frontend-vue.git"
DEPLOY_DIR="/var/www/quiz-frontend"
BUILD_DIR="/tmp/quiz-frontend-build"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}Starting deployment...${NC}"

# Clone fresh code
echo -e "${YELLOW}Cloning repository...${NC}"
rm -rf $BUILD_DIR
git clone $REPO_URL $BUILD_DIR

# Build
echo -e "${YELLOW}Building application...${NC}"
cd $BUILD_DIR
npm install
npm run build

# Backup current deployment
echo -e "${YELLOW}Backing up current deployment...${NC}"
sudo cp -r $DEPLOY_DIR $DEPLOY_DIR.backup.$(date +%Y%m%d_%H%M%S)

# Deploy
echo -e "${YELLOW}Deploying...${NC}"
sudo rm -rf $DEPLOY_DIR/*
sudo cp -r $BUILD_DIR/dist/* $DEPLOY_DIR/

# Set permissions
sudo chown -R www-data:www-data $DEPLOY_DIR

# Cleanup
rm -rf $BUILD_DIR

echo -e "${GREEN}Deployment completed!${NC}"
```

Make executable:

```bash
chmod +x deploy.sh
```

Run deployment:

```bash
./deploy.sh
```

---

## Environment Variables

### Development

File `.env` (không commit):

```env
VITE_API_BASE_URL=http://java-quiz.test
VITE_APP_NAME=Java Bronze Quiz
VITE_ENABLE_ACHIEVEMENTS=true
VITE_ENABLE_LEADERBOARD=true
```

### Production

Set trong platform deployment settings:

```env
VITE_API_BASE_URL=https://api.yourdomain.com
VITE_APP_NAME=Java Bronze Quiz
VITE_ENABLE_ACHIEVEMENTS=true
VITE_ENABLE_LEADERBOARD=true
```

**Lưu ý quan trọng:**
- Tất cả biến môi trường phải có prefix `VITE_`
- Sau khi thay đổi environment variables trên Vercel/Netlify, cần **redeploy**
- Biến môi trường được **embed vào bundle** khi build, không thể thay đổi runtime

---

## Troubleshooting

### Build fails trên Vercel/Netlify

**Lỗi:** `Module not found` hoặc `Cannot resolve dependency`

**Giải pháp:**
1. Đảm bảo `node_modules` không bị ignore trong `.gitignore`
2. Check `package-lock.json` tồn tại
3. Force install trong build command:
   ```bash
   rm -rf node_modules && npm ci && npm run build
   ```

### CORS errors

**Lỗi:** `Access-Control-Allow-Origin` errors

**Giải pháp:**
1. Check Laravel backend CORS configuration
2. Đảm bảo frontend URL được whitelist:
   ```php
   // config/cors.php
   'allowed_origins' => [
       'https://app.yourdomain.com',
       'https://*.vercel.app',
       'https://*.netlify.app'
   ]
   ```

### 404 trên refresh page

**Lỗi:** Trang chính load nhưng refresh bị 404

**Giải pháp:**
- Vercel: Tự động xử lý, không cần config
- Netlify: Tạo `public/_redirects` file
- Nginx: Cấu hình fallback trong config

### Environment variables không hoạt động

**Lỗi:** Biến môi trường vẫn trả về `undefined`

**Giải pháp:**
1. Đảm bảo prefix `VITE_`
2. Restart development server sau khi đổi `.env`
3. Clear cache và rebuild
4. Check có typo trong tên biến

### Authentication không hoạt động

**Lỗi:** Redirect loop hoặc không lưu token

**Giải pháp:**
1. Check `localStorage` có bị block không
2. Đảm bảo HTTPS trong production
3. Check SameSite cookie settings (không cần vì dùng JWT header)
4. Verify API endpoints trả về đúng format

### Build size quá lớn

**Lỗi:** Bundle size > 500KB

**Giải pháp:**
```bash
# Analyze bundle
npm run build -- --analyze

# Optimize dependencies
# Check và remove unused dependencies
# Consider code splitting cho routes lớn
```

---

## Best Practices

### Security

1. ✅ Luôn dùng HTTPS trong production
2. ✅ Set security headers (XSS protection, frame options)
3. ✅ Sanitize user input trước khi hiển thị
4. ✅ Không expose sensitive data trong frontend code
5. ✅ Regular dependency updates

### Performance

1. ✅ Enable Gzip/Brotli compression
2. ✅ Optimize images (WebP, lazy loading)
3. ✅ Code splitting cho routes
4. ✅ Lazy load heavy components
5. ✅ Cache static assets

### Monitoring

1. ✅ Setup error tracking (Sentry, Bugsnag)
2. ✅ Monitor API response times
3. ✅ Track Core Web Vitals
4. ✅ Alert cho deployment failures
5. ✅ Logging cho debug

### CI/CD

1. ✅ Automated tests trước khi deploy
2. ✅ Preview deployments cho PRs
3. ✅ Rollback capability
4. ✅ Blue-green deployments (optional)
5. ✅ Post-deploy smoke tests

---

## Checklist Trước Khi Deploy

- [ ] Code đã được test thoroughly
- [ ] All linter errors fixed
- [ ] Build production thành công locally
- [ ] Environment variables configured đúng
- [ ] Backend API accessible từ production domain
- [ ] CORS configured đúng
- [ ] SSL certificate setup
- [ ] Custom domain configured
- [ ] Error tracking setup
- [ ] Monitoring & alerts configured
- [ ] Documentation updated
- [ ] Backup strategy in place

---

## Support

Nếu gặp vấn đề khi deploy:

1. Check [Troubleshooting](#troubleshooting) section
2. Review [README.md](README.md)
3. Check logs trên deployment platform
4. Contact team development

---

## Liên kết hữu ích

- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html)
- [Vercel Documentation](https://vercel.com/docs)
- [Netlify Documentation](https://docs.netlify.com/)
- [Vue.js Deployment Guide](https://vuejs.org/guide/best-practices/production-deployment.html)

---

**Last updated:** 2024
**Version:** 1.0.0

