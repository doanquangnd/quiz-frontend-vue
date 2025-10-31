import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth.js'

const routes = [
  // Public Routes
  {
    path: '/',
    name: 'welcome',
    component: () => import('@/pages/Welcome.vue'),
    meta: { requiresAuth: false },
  },
  {
    path: '/signin',
    name: 'signin',
    component: () => import('@/pages/Auth/SignIn.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('@/pages/Auth/SignUp.vue'),
    meta: { requiresAuth: false, guestOnly: true },
  },
  {
    path: '/thank-you',
    name: 'thank-you',
    component: () => import('@/pages/Auth/ThankYouPage.vue'),
    meta: { requiresAuth: false },
  },

  // Protected Routes (Requires Authentication)
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('@/pages/Dashboard/Dashboard.vue'),
    meta: { requiresAuth: true, title: 'Dashboard' },
  },

  // Documents Routes
  {
    path: '/documents',
    name: 'documents.index',
    component: () => import('@/pages/Documents/Index.vue'),
    meta: { requiresAuth: true, title: 'Tài liệu' },
  },
  {
    path: '/documents/history',
    name: 'documents.history',
    component: () => import('@/pages/Documents/History.vue'),
    meta: { requiresAuth: true, title: 'Lịch sử học tập' },
  },
  {
    path: '/documents/category/:categoryId',
    name: 'documents.category',
    component: () => import('@/pages/Documents/Category.vue'),
    meta: { requiresAuth: true, title: 'Danh mục tài liệu' },
  },
  {
    path: '/documents/category/:categoryId/practice',
    name: 'documents.category.practice',
    component: () => import('@/pages/Documents/Practice.vue'),
    meta: { requiresAuth: true, title: 'Luyện tập' },
  },
  {
    path: '/documents/progress/:progressId',
    name: 'documents.progress.details',
    component: () => import('@/pages/Documents/ProgressDetails.vue'),
    meta: { requiresAuth: true, title: 'Chi tiết tiến độ' },
  },
  {
    path: '/documents/:documentSlug',
    name: 'documents.show',
    component: () => import('@/pages/Documents/Show.vue'),
    meta: { requiresAuth: true, title: 'Chi tiết tài liệu' },
  },

  // Exams Routes
  {
    path: '/exams',
    name: 'exams.index',
    component: () => import('@/pages/Exams/Index.vue'),
    meta: { requiresAuth: true, title: 'Bài thi' },
  },
  {
    path: '/exams/:examSlug',
    name: 'exams.show',
    component: () => import('@/pages/Exams/Show.vue'),
    meta: { requiresAuth: true, title: 'Chi tiết bài thi' },
  },
  {
    path: '/exams/:examSlug/quiz',
    name: 'exams.quiz',
    component: () => import('@/pages/Exams/Quiz.vue'),
    meta: { requiresAuth: true, title: 'Làm bài thi' },
  },
  {
    path: '/exams/:examSlug/history',
    name: 'exams.history',
    component: () => import('@/pages/Exams/History.vue'),
    meta: { requiresAuth: true, title: 'Lịch sử thi' },
  },
  {
    path: '/exams/:examSlug/attempts/:attemptId',
    name: 'exams.attempt.details',
    component: () => import('@/pages/Exams/AttemptDetails.vue'),
    meta: { requiresAuth: true, title: 'Chi tiết lần thi' },
  },

  // Profile & Settings
  {
    path: '/profile',
    name: 'profile.show',
    component: () => import('@/pages/Profile/Show.vue'),
    meta: { requiresAuth: true, title: 'Hồ sơ cá nhân' },
  },
  {
    path: '/settings/typography',
    name: 'settings.typography',
    component: () => import('@/pages/Settings/Typography.vue'),
    meta: { requiresAuth: true, title: 'Cài đặt hiển thị' },
  },

  // Gamification Routes
  {
    path: '/achievements',
    name: 'achievements.index',
    component: () => import('@/pages/Achievements/Index.vue'),
    meta: { requiresAuth: true, title: 'Thành tích' },
  },
  {
    path: '/leaderboard',
    name: 'leaderboard.index',
    component: () => import('@/pages/Leaderboard/Index.vue'),
    meta: { requiresAuth: true, title: 'Bảng xếp hạng' },
  },

  // 404 Not Found
  {
    path: '/:pathMatch(.*)*',
    name: 'not-found',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 }
  },
})

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth_store = useAuthStore()

  // Kiểm tra xem route có yêu cầu authentication không
  const requires_auth = to.matched.some((record) => record.meta.requiresAuth)
  const guest_only = to.matched.some((record) => record.meta.guestOnly)

  // Nếu chưa check auth và có token, check auth status
  if (!auth_store.user && localStorage.getItem('access_token')) {
    try {
      await auth_store.check_auth()
    } catch (error) {
      // Auth check failed, will be handled by redirect logic below
    }
  }

  const is_authenticated = auth_store.is_authenticated

  // Route yêu cầu auth nhưng user chưa đăng nhập
  if (requires_auth && !is_authenticated) {
    next({
      name: 'signin',
      query: { redirect: to.fullPath },
    })
    return
  }

  // Route chỉ dành cho guest (signin/signup) nhưng user đã đăng nhập
  if (guest_only && is_authenticated) {
    next({ name: 'dashboard' })
    return
  }

  // Set page title from route meta
  if (to.meta.title) {
    document.title = `${to.meta.title} - Java Bronze Quiz`
  }

  // Cho phép điều hướng
  next()
})

export default router


