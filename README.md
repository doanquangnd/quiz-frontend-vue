# Java Bronze Quiz - Frontend SPA (Vue 3)

Frontend SPA application cho hệ thống Java Bronze Quiz, được tách biệt khỏi Laravel backend và sử dụng REST API.

## Công nghệ sử dụng

- **Vue 3** - Progressive JavaScript Framework
- **Vue Router** - Official router for Vue.js
- **Pinia** - State management
- **Axios** - HTTP client
- **Vite** - Frontend build tool
- **i18n** - Internationalization (en, ja, vi)
- **Soft UI Dashboard** - UI Theme

## Cài đặt

### 1. Clone và cài đặt dependencies

```bash
git clone https://github.com/yourusername/quiz-frontend-vue.git
cd quiz-frontend-vue
npm install
```

### 2. Cấu hình môi trường

Tạo file `.env` từ `env.example`:

```bash
cp env.example .env
```

Cập nhật `VITE_API_BASE_URL` để trỏ đến Laravel backend:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### 3. Chạy development server

```bash
npm run dev
```

Ứng dụng sẽ chạy tại `http://localhost:5174`

### 4. Build cho production

```bash
npm run build
```

File build sẽ được tạo trong thư mục `dist/`

## Cấu trúc thư mục

```
quiz-frontend-vue/
├── DEPLOYMENT.md          # Deployment documentation
├── env.example            # Environment variables example
├── src/
│   ├── api/                  # API clients
│   │   └── http-client.js    # Axios instance với token handling
│   ├── assets/               # Static assets
│   ├── components/           # Vue components
│   │   ├── Auth/            # Authentication components
│   │   ├── Quiz/            # Quiz components
│   │   ├── Shared/          # Shared/reusable components
│   │   └── Toast.vue        # Toast notification component
│   ├── composables/          # Vue composables
│   │   ├── useAuth.js       # Authentication composable
│   │   ├── useToast.js      # Toast notification composable
│   │   └── ...
│   ├── layouts/             # Layout components
│   ├── pages/               # Page components
│   │   ├── Auth/           # Login, Register, etc.
│   │   ├── Dashboard/      # Dashboard pages
│   │   ├── Documents/      # Document pages
│   │   ├── Exams/          # Exam pages
│   │   └── ...
│   ├── router/              # Vue Router configuration
│   │   └── index.js         # Routes với navigation guard
│   ├── stores/              # Pinia stores
│   │   ├── auth.js          # Auth state management
│   │   ├── toast.js         # Toast state management
│   │   └── app.js           # App global state
│   ├── styles/              # Global styles
│   ├── translations/        # i18n translations
│   │   ├── en.js
│   │   ├── ja.js
│   │   └── vi.js
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── public/                  # Public static files
├── index.html               # HTML template
├── vite.config.js          # Vite configuration
├── package.json            # Dependencies
└── env.example             # Environment variables example
```

## Authentication Flow

### 1. Login
```javascript
import { useAuth } from '@/composables/useAuth'

const { login, is_loading, error } = useAuth()

const handleLogin = async () => {
  const result = await login({
    email: 'user@example.com',
    password: 'password'
  })
  
  if (result.success) {
    // Redirect to dashboard
    router.push({ name: 'dashboard' })
  }
}
```

### 2. Logout
```javascript
const { logout } = useAuth()

const handleLogout = async () => {
  await logout()
  // Automatically redirected to /signin
}
```

### 3. Check Authentication
```javascript
const { is_authenticated, user } = useAuth()

// Trong component
if (is_authenticated.value) {
  console.log('User:', user.value.name)
}
```

## API Usage

### Sử dụng HTTP Client

```javascript
import { http } from '@/api/http-client'

// GET request
const { data } = await http.get('/api/documents')

// POST request
const { data } = await http.post('/api/exams/start', {
  exam_id: 1
})

// PUT request
const { data } = await http.put('/api/profile', userData)

// DELETE request
await http.delete('/api/documents/1')
```

### Token Handling

HTTP client tự động:
- Đính kèm Bearer token vào mọi request
- Refresh token khi nhận 401 Unauthorized
- Queue các request đang chờ khi refresh token
- Redirect về /signin khi refresh token thất bại

## Toast Notifications

### Sử dụng Toast

```javascript
import { useToastStore } from '@/stores/toast'

const toast = useToastStore()

// Success notification
toast.success('Đăng nhập thành công!')

// Error notification
toast.error('Có lỗi xảy ra!')

// Warning notification
toast.warning('Vui lòng kiểm tra lại thông tin')

// Info notification
toast.info('Hệ thống sẽ bảo trì vào 2h sáng')

// Confirm dialog
toast.confirm('Bạn có chắc muốn xóa?', {
  onConfirm: () => {
    // Handle confirm
  }
})
```

## Router Guards

### Protected Routes

Routes có `meta.requiresAuth = true` sẽ yêu cầu authentication:

```javascript
{
  path: '/dashboard',
  name: 'dashboard',
  component: Dashboard,
  meta: { requiresAuth: true }
}
```

### Guest Only Routes

Routes có `meta.guestOnly = true` chỉ cho phép user chưa đăng nhập:

```javascript
{
  path: '/signin',
  name: 'signin',
  component: SignIn,
  meta: { guestOnly: true }
}
```

## Internationalization (i18n)

### Sử dụng trong component

```javascript
import { useTranslation } from '@/composables/useTranslation'

const { t, locale, setLocale } = useTranslation()

// Get translation
const greeting = t('common.greeting')

// Change language
setLocale('ja') // 'en', 'ja', 'vi'
```

### Thêm translation mới

Cập nhật files trong `src/translations/`:
- `en.js` - English
- `ja.js` - Japanese
- `vi.js` - Vietnamese

## Development

### Hot Module Replacement (HMR)

Vite hỗ trợ HMR, thay đổi code sẽ tự động cập nhật mà không cần reload page.

### Build Production

```bash
npm run build
```

## Deployment

📖 **Xem hướng dẫn chi tiết:** [DEPLOYMENT.md](DEPLOYMENT.md)

### Vercel

1. Push code lên GitHub
2. Import project trên Vercel
3. Cấu hình environment variables:
   - `VITE_API_BASE_URL=https://api.yourdomain.com`
   - `VITE_APP_NAME=Java Bronze Quiz`
   - `VITE_ENABLE_ACHIEVEMENTS=true` (optional)
   - `VITE_ENABLE_LEADERBOARD=true` (optional)
4. Deploy

### Netlify

1. Push code lên GitHub
2. Import project trên Netlify
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Cấu hình environment variables (giống Vercel)

### Build tự động

```bash
npm run build
```

Deploy thư mục `dist/` lên web server (Nginx, Apache, etc.)

## Troubleshooting

### CORS Issues

Đảm bảo Laravel backend đã cấu hình CORS đúng trong `config/cors.php`:

```php
'paths' => ['api/*'],
'allowed_origins' => ['http://localhost:5173'],
'supports_credentials' => false,
```

### 401 Unauthorized

- Kiểm tra token có được lưu trong localStorage không
- Kiểm tra API endpoint `/api/auth/me` có hoạt động không
- Xóa token và đăng nhập lại

### Network Error

- Kiểm tra `VITE_API_BASE_URL` trong `.env`
- Kiểm tra Laravel backend có đang chạy không
- Kiểm tra firewall/network settings

### Environment Variables không hoạt động

- **Lưu ý quan trọng**: Tất cả biến môi trường phải có prefix `VITE_` để Vite có thể expose chúng
- Sau khi thay đổi `.env`, phải **restart development server**
- Biến môi trường được embed vào bundle khi build, không thể thay đổi runtime

## Support

Nếu gặp vấn đề, vui lòng tạo issue hoặc liên hệ team phát triển.

## License

MIT License
