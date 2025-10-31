# TODO - Frontend SPA tách khỏi Laravel (JWT/Sanctum)

## Backend Laravel
- [x] Cấu hình CORS trên Laravel cho domain FE, bật headers/auth
- [x] Chuyển sang JWT (thay vì Sanctum) - framework independent
- [x] Tạo AuthController với JWT endpoints: `/api/auth/login`, `/api/auth/register`, `/api/auth/me`, `/api/auth/refresh`, `/api/auth/logout`
- [x] Cấu hình routes API với auth:api middleware
- [x] Cập nhật User model implement JWTSubject
- [x] Cấu hình JWT guard trong config/auth.php
- [x] Cài đặt JWT package: `composer require php-open-source-saver/jwt-auth`
- [x] Generate JWT secret: `php artisan jwt:secret`
- [ ] Test các API endpoints với Postman/Insomnia

## Frontend Vue SPA
- [x] Kiểm tra và cập nhật router trỏ đúng trang đã copy
- [x] Đăng ký i18n plugin và nạp bộ dịch en/ja/vi
- [x] Xác nhận alias @ và cấu hình Vite hoạt động
- [x] Thiết lập Axios client dùng Bearer token từ localStorage
- [x] Cấu hình ENV FE: `VITE_API_BASE_URL` theo môi trường
- [x] Đồng bộ hoá Axios: dùng duy nhất `src/api/http-client.js` (đã loại bỏ CSRF interceptor)
- [x] Cập nhật http-client.js để xử lý 401/token refresh tự động
- [x] Cập nhật auth store với các actions: login, register, logout, fetch_user, check_auth
- [x] Thêm navigation guard cho router (bảo vệ routes cần auth)
- [x] Tạo composable useAuth để persist auth state
- [x] Thêm UI xử lý lỗi thống nhất (Toast notifications)
- [x] Tích hợp Toast component vào App.vue
- [x] Cập nhật SignIn.vue để sử dụng auth store mới
- [x] Cập nhật SignUp.vue để sử dụng auth store mới
- [x] Tạo shims/inertia.js compatibility layer (Head, Link, route helper)
- [x] Thay thế 22+ imports từ @inertiajs/vue3 sang @/shims/inertia.js
- [x] Fix tất cả <a> tags trong Auth pages và AppLayout thành <router-link>
- [x] Tạo API endpoints cho Documents, Exams, Profile (18 endpoints)
- [x] Tạo Frontend Services (DocumentService, ExamService, ProfileService, DashboardService)
- [x] Migrate 3 core pages fetch data từ API (Documents, Exams, Dashboard)
- [ ] Thay thế mọi call Inertia bằng REST API trong remaining 16 pages
- [ ] Kiểm tra và chỉnh lại asset paths (fonts/images/css) trong Vue
- [ ] Thiết lập cấu hình build/deploy FE tách biệt

## Testing & Deployment
- [ ] Test login/logout flow
- [ ] Test token refresh mechanism
- [ ] Test protected routes
- [ ] Test error handling (401, 403, 500, network errors)
- [x] Tạo file env.example cho Frontend
- [x] Viết hướng dẫn deploy Frontend (Vercel/Netlify/VPS)
- [ ] Viết hướng dẫn deploy Backend (Laravel)

## Ghi chú quan trọng
- **Hệ thống xác thực**: JWT (Framework-independent, có thể migrate sang Spring Boot)
- **Base URL API**: Lấy từ biến môi trường `VITE_API_BASE_URL`
- **Axios Client**: Dùng `src/api/http-client.js` để tự động đính kèm `Authorization: Bearer {token}`
- **Token Refresh**: Tự động refresh token khi nhận 401, queue các request đang chờ
- **Toast Notifications**: Đã tích hợp để hiển thị lỗi mạng, 403, và các thông báo khác
- **Router Guard**: Tự động redirect về /signin nếu chưa đăng nhập và cố truy cập protected route
- **Portable**: JWT cho phép thay backend (Laravel → Spring Boot) mà không cần đổi Frontend

## Các file đã tạo/cập nhật

### Backend
- `app/Http/Controllers/Api/AuthController.php` - Authentication controller
- `routes/api.php` - API routes với auth endpoints
- `config/sanctum.php` - Sanctum configuration
- `app/Models/User.php` - Added HasApiTokens trait

### Frontend
- `quiz-filament-vue/src/api/http-client.js` - Axios client với token refresh
- `quiz-filament-vue/src/stores/auth.js` - Auth state management
- `quiz-filament-vue/src/composables/useAuth.js` - Auth composable
- `quiz-filament-vue/src/router/index.js` - Router với navigation guard
- `quiz-filament-vue/src/App.vue` - Added Toast component
- `quiz-filament-vue/src/composables/useProgressSync.js` - Updated to use http-client

### Đã xóa (không cần thiết)
- `quiz-filament-vue/src/utils/axiosInterceptor.js` - Replaced by http-client.js
- `quiz-filament-vue/src/utils/csrfManager.js` - Không cần CSRF với Bearer token
