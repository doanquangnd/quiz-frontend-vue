<template>
  <div class="mobile-navigation">
    <!-- Mobile Header -->
    <header class="mobile-header">
      <div class="mobile-header-content">
        <!-- Logo/Brand -->
        <div class="mobile-brand">
          <router-link :to="resolve_route_name('dashboard')" class="brand-link">
            <img src="/logo-icon.svg" alt="Java Quiz" class="brand-icon" />
            <span class="brand-text">Java Quiz</span>
          </router-link>
        </div>

        <!-- Menu Toggle Button -->
        <button 
          class="mobile-menu-toggle"
          :class="{ active: isMenuOpen }"
          @click="toggleMenu"
          aria-label="Toggle menu"
          aria-expanded="isMenuOpen"
        >
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
          <span class="hamburger-line"></span>
        </button>
      </div>
    </header>

    <!-- Mobile Menu Overlay -->
    <div 
      class="mobile-menu-overlay"
      :class="{ active: isMenuOpen }"
      @click="closeMenu"
    ></div>

    <!-- Mobile Menu -->
    <nav 
      class="mobile-menu"
      :class="{ active: isMenuOpen }"
      role="navigation"
      aria-label="Main navigation"
    >
      <div class="mobile-menu-content">
        <!-- User Profile Section -->
        <div class="mobile-user-section" v-if="user">
          <div class="user-avatar">
            <img 
              :src="user.avatar_url || '/images/default-avatar.png'" 
              :alt="user.name"
              class="avatar-img"
            />
          </div>
          <div class="user-info">
            <h3 class="user-name">{{ user.name }}</h3>
            <p class="user-email">{{ user.email }}</p>
          </div>
        </div>

        <!-- Navigation Links -->
        <ul class="mobile-nav-list">
          <li class="mobile-nav-item">
            <router-link 
              :to="resolve_route_name('dashboard')" 
              class="mobile-nav-link"
              :class="{ active: route_obj.path === '/dashboard' }"
              @click="closeMenu"
            >
              <i class="fas fa-home nav-icon"></i>
              <span class="nav-text">{{ $t('navigation.dashboard') }}</span>
            </router-link>
          </li>

          <li class="mobile-nav-item">
            <router-link 
              :to="resolve_route_name('exams.index')" 
              class="mobile-nav-link"
              :class="{ active: route_obj.path.startsWith('/exams') }"
              @click="closeMenu"
            >
              <i class="fas fa-clipboard-list nav-icon"></i>
              <span class="nav-text">{{ $t('navigation.exams') }}</span>
            </router-link>
          </li>

          <li class="mobile-nav-item">
            <router-link 
              :to="resolve_route_name('documents.index')" 
              class="mobile-nav-link"
              :class="{ active: route_obj.path.startsWith('/documents') }"
              @click="closeMenu"
            >
              <i class="fas fa-file-alt nav-icon"></i>
              <span class="nav-text">{{ $t('navigation.documents') }}</span>
            </router-link>
          </li>

          <li class="mobile-nav-item">
            <router-link 
              :to="resolve_route_name('profile.show')" 
              class="mobile-nav-link"
              :class="{ active: route_obj.path.startsWith('/profile') }"
              @click="closeMenu"
            >
              <i class="fas fa-user nav-icon"></i>
              <span class="nav-text">{{ $t('navigation.profile') }}</span>
            </router-link>
          </li>

          <li class="mobile-nav-item">
            <router-link 
              :to="resolve_route_name('settings.typography')" 
              class="mobile-nav-link"
              :class="{ active: route_obj.path.startsWith('/settings') }"
              @click="closeMenu"
            >
              <i class="fas fa-cog nav-icon"></i>
              <span class="nav-text">{{ $t('navigation.settings') }}</span>
            </router-link>
          </li>
        </ul>

        <!-- Language Switcher -->
        <div class="mobile-language-section">
          <LanguageSwitcher />
        </div>

        <!-- Logout Button -->
        <div class="mobile-logout-section">
          <button 
            @click="logout"
            class="mobile-logout-btn"
            :disabled="isLoggingOut"
          >
            <i class="fas fa-sign-out-alt nav-icon"></i>
            <span class="nav-text">{{ $t('auth.logout') }}</span>
            <i v-if="isLoggingOut" class="fas fa-spinner fa-spin ml-2"></i>
          </button>
        </div>
      </div>
    </nav>

    <!-- Bottom Navigation (for main pages) -->
    <div class="mobile-bottom-nav" v-if="showBottomNav">
      <router-link 
        :to="resolve_route_name('dashboard')" 
        class="bottom-nav-item"
        :class="{ active: route_obj.path === '/dashboard' }"
      >
        <i class="fas fa-home bottom-nav-icon"></i>
        <span class="bottom-nav-text">{{ $t('navigation.dashboard') }}</span>
      </router-link>

      <router-link 
        :to="resolve_route_name('exams.index')" 
        class="bottom-nav-item"
        :class="{ active: route_obj.path.startsWith('/exams') }"
      >
        <i class="fas fa-clipboard-list bottom-nav-icon"></i>
        <span class="bottom-nav-text">{{ $t('navigation.exams') }}</span>
      </router-link>

      <router-link 
        :to="resolve_route_name('documents.index')" 
        class="bottom-nav-item"
        :class="{ active: route_obj.path.startsWith('/documents') }"
      >
        <i class="fas fa-file-alt bottom-nav-icon"></i>
        <span class="bottom-nav-text">{{ $t('navigation.documents') }}</span>
      </router-link>

      <router-link 
        :to="resolve_route_name('profile.show')" 
        class="bottom-nav-item"
        :class="{ active: route_obj.path.startsWith('/profile') }"
      >
        <i class="fas fa-user bottom-nav-icon"></i>
        <span class="bottom-nav-text">{{ $t('navigation.profile') }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { resolve_route_name } from '@/utils/route-helper.js'
import { useAuthStore } from '@/stores/auth.js'
import LanguageSwitcher from './LanguageSwitcher.vue'

const router = useRouter()
const route_obj = useRoute()
const authStore = useAuthStore()
const user = computed(() => authStore.user)

// Menu state
const isMenuOpen = ref(false)
const isLoggingOut = ref(false)

// Show bottom navigation on main pages
const showBottomNav = computed(() => {
  const mainPages = ['/dashboard', '/exams', '/documents', '/profile']
  return mainPages.some(path => route_obj.path.startsWith(path))
})

// Menu control
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
  document.body.classList.toggle('menu-open', isMenuOpen.value)
}

const closeMenu = () => {
  isMenuOpen.value = false
  document.body.classList.remove('menu-open')
}

// Logout
const logout = async () => {
  isLoggingOut.value = true
  try {
    await authStore.logout()
    router.push('/signin')
  } catch (error) {
    console.error('Logout error:', error)
  } finally {
    isLoggingOut.value = false
  }
}

// Handle escape key
const handleEscape = (event) => {
  if (event.key === 'Escape' && isMenuOpen.value) {
    closeMenu()
  }
}

// Handle orientation change
const handleOrientationChange = () => {
  if (isMenuOpen.value) {
    closeMenu()
  }
}

// Handle resize
const handleResize = () => {
  if (window.innerWidth >= 768 && isMenuOpen.value) {
    closeMenu()
  }
}

onMounted(() => {
  document.addEventListener('keydown', handleEscape)
  window.addEventListener('orientationchange', handleOrientationChange)
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape)
  window.removeEventListener('orientationchange', handleOrientationChange)
  window.removeEventListener('resize', handleResize)
  document.body.classList.remove('menu-open')
})
</script>

<style scoped>
/* Mobile Navigation Styles */
.mobile-navigation {
  position: relative;
}

/* Mobile Header */
.mobile-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: var(--bg-primary);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--shadow-sm);
}

.mobile-header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  min-height: 60px;
}

.mobile-brand {
  flex: 1;
}

.brand-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: var(--text-primary);
}

.brand-icon {
  width: 32px;
  height: 32px;
  margin-right: var(--space-sm);
}

.brand-text {
  font-size: var(--font-size-lg);
  font-weight: 600;
  color: var(--text-primary);
}

/* Menu Toggle Button */
.mobile-menu-toggle {
  position: relative;
  width: 44px;
  height: 44px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 4px;
  transition: all var(--transition-fast);
}

.mobile-menu-toggle:focus {
  outline: 2px solid var(--primary-color);
  outline-offset: 2px;
}

.hamburger-line {
  width: 24px;
  height: 2px;
  background-color: var(--text-primary);
  transition: all var(--transition-fast);
  transform-origin: center;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.mobile-menu-toggle.active .hamburger-line:nth-child(2) {
  opacity: 0;
}

.mobile-menu-toggle.active .hamburger-line:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

/* Menu Overlay */
.mobile-menu-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1001;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-normal);
}

.mobile-menu-overlay.active {
  opacity: 1;
  visibility: visible;
}

/* Mobile Menu */
.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 280px;
  height: 100vh;
  background: var(--bg-primary);
  z-index: 1002;
  transition: right var(--transition-normal);
  overflow-y: auto;
  box-shadow: var(--shadow-xl);
}

.mobile-menu.active {
  right: 0;
}

.mobile-menu-content {
  padding: var(--space-lg);
}

/* User Section */
.mobile-user-section {
  display: flex;
  align-items: center;
  padding: var(--space-lg) 0;
  border-bottom: 1px solid var(--border-color);
  margin-bottom: var(--space-lg);
}

.user-avatar {
  margin-right: var(--space-md);
}

.avatar-img {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
}

.user-name {
  font-size: var(--font-size-lg);
  font-weight: 600;
  margin: 0 0 var(--space-xs) 0;
  color: var(--text-primary);
}

.user-email {
  font-size: var(--font-size-sm);
  color: var(--text-secondary);
  margin: 0;
}

/* Navigation List */
.mobile-nav-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.mobile-nav-item {
  margin-bottom: var(--space-xs);
}

.mobile-nav-link {
  display: flex;
  align-items: center;
  padding: var(--space-md);
  color: var(--text-primary);
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  min-height: 48px;
}

.mobile-nav-link:hover,
.mobile-nav-link.active {
  background: rgba(79, 70, 229, 0.1);
  color: var(--primary-color);
}

.nav-icon {
  width: 20px;
  margin-right: var(--space-md);
  text-align: center;
}

.nav-text {
  font-size: var(--font-size-base);
  font-weight: 500;
}

/* Language Section */
.mobile-language-section {
  padding: var(--space-lg) 0;
  border-top: 1px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  margin: var(--space-lg) 0;
}

/* Logout Section */
.mobile-logout-section {
  margin-top: var(--space-lg);
}

.mobile-logout-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: var(--space-md);
  background: none;
  border: none;
  color: var(--error-color);
  text-decoration: none;
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  min-height: 48px;
  font-size: var(--font-size-base);
  font-weight: 500;
}

.mobile-logout-btn:hover:not(:disabled) {
  background: rgba(239, 68, 68, 0.1);
}

.mobile-logout-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Bottom Navigation */
.mobile-bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: var(--bg-primary);
  border-top: 1px solid var(--border-color);
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  z-index: 999;
  display: flex;
  padding: var(--space-xs) 0;
  padding-bottom: calc(var(--space-xs) + env(safe-area-inset-bottom));
}

.bottom-nav-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: var(--space-sm);
  color: var(--text-secondary);
  text-decoration: none;
  transition: color var(--transition-fast);
  min-height: 60px;
  justify-content: center;
}

.bottom-nav-item:hover,
.bottom-nav-item.active {
  color: var(--primary-color);
}

.bottom-nav-icon {
  font-size: 20px;
  margin-bottom: var(--space-xs);
}

.bottom-nav-text {
  font-size: var(--font-size-xs);
  font-weight: 500;
  text-align: center;
}

/* Body scroll lock when menu is open */
body.menu-open {
  overflow: hidden;
}

/* Responsive adjustments */
@media (min-width: 768px) {
  .mobile-navigation {
    display: none;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .mobile-menu-overlay {
    background: rgba(0, 0, 0, 0.7);
  }
}

/* High contrast mode */
@media (prefers-contrast: high) {
  .mobile-menu {
    border-left: 2px solid var(--border-color);
  }
  
  .mobile-header {
    border-bottom: 2px solid var(--border-color);
  }
}

/* Reduced motion */
@media (prefers-reduced-motion: reduce) {
  .mobile-menu,
  .mobile-menu-overlay,
  .hamburger-line {
    transition: none;
  }
}
</style>
