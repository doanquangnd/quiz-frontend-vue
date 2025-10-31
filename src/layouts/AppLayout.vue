<template>
    <div class="g-sidenav-show bg-gray-100">
        <!-- Sidenav -->
        <aside
            class="sidenav navbar navbar-vertical navbar-expand-xs border-0 border-radius-xl my-3 fixed-start ms-3 bg-white"
            id="sidenav-main"
        >
            <div class="sidenav-header">
                <i
                    class="fas fa-times p-3 cursor-pointer text-secondary opacity-5 position-absolute end-0 top-0 d-none d-xl-none"
                    aria-hidden="true"
                    id="iconSidenav"
                ></i>
                <router-link :to="resolve_route_name('dashboard')" class="navbar-brand m-0">
                    <div class="d-flex align-items-center">
                        <Logo class="h-10 sm:h-8 md:h-10" />
                    </div>
                </router-link>
            </div>
            <hr class="horizontal dark mt-0" />
            <div
                class="collapse navbar-collapse w-auto h-auto"
                id="sidenav-collapse-main"
            >
                <ul class="navbar-nav">
                    <li class="nav-item">
                        <router-link
                            :to="resolve_route_name('dashboard')"
                            class="nav-link"
                            :class="{ active: isActive('dashboard') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="ni ni-tv-2 text-primary text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('my_dashboard') }}</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            :to="resolve_route_name('documents.index')"
                            class="nav-link"
                            :class="{ active: isActive('documents') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="ni ni-books text-warning text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('my_documents') }}</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            :to="resolve_route_name('exams.index')"
                            class="nav-link"
                            :class="{ active: isActive('exams') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="ni ni-paper-diploma text-success text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('my_exams') }}</span>
                        </router-link>
                    </li>
                    <li v-if="isEnableAchievements" class="nav-item">
                        <router-link
                            :to="resolve_route_name('achievements.index')"
                            class="nav-link"
                            :class="{ active: isActive('achievements') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="ni ni-trophy text-warning text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('achievements') }}</span>
                        </router-link>
                    </li>
                    <li v-if="isEnableLeaderboard" class="nav-item">
                        <router-link
                            :to="resolve_route_name('leaderboard.index')"
                            class="nav-link"
                            :class="{ active: isActive('leaderboard') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="ni ni-chart-bar-32 text-info text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('leaderboard') }}</span>
                        </router-link>
                    </li>
                    <li class="nav-item">
                        <router-link
                            :to="resolve_route_name('settings.typography')"
                            class="nav-link"
                            :class="{ active: isActive('settings') }"
                        >
                            <div
                                class="icon icon-shape icon-sm shadow border-radius-md bg-white text-center me-2 d-flex align-items-center justify-content-center"
                            >
                                <i
                                    class="fas fa-cog text-secondary text-sm opacity-10"
                                ></i>
                            </div>
                            <span class="nav-link-text ms-1">{{ $t('settings') }}</span>
                        </router-link>
                    </li>
                </ul>
            </div>
        </aside>

        <!-- Main Content -->
        <main
            class="main-content position-relative max-height-vh-100 h-100 border-radius-lg"
        >
            <!-- Navbar -->
            <nav
                class="navbar navbar-main navbar-expand-lg px-0 mx-4 shadow-none border-radius-xl"
                id="navbarBlur"
            >
                <div class="container-fluid py-1 px-3">
                    <nav aria-label="breadcrumb">
                        <ol
                            class="breadcrumb bg-transparent mb-0 pb-0 pt-1 px-0 me-sm-6 me-5"
                        >
                            <li class="breadcrumb-item text-sm">
                                <a
                                    class="opacity-5 text-dark"
                                    href="javascript:;"
                                    >Pages</a
                                >
                            </li>
                            <li
                                class="breadcrumb-item text-sm text-dark active"
                                aria-current="page"
                            >
                                {{ currentPageName }}
                            </li>
                        </ol>
                        <h6 class="font-weight-bolder mb-0">
                            {{ currentPageName }}
                        </h6>
                    </nav>
                    <div
                        class="collapse navbar-collapse mt-sm-0 mt-2 me-md-0 me-sm-4"
                        id="navbar"
                    >
                        <div
                            class="ms-md-auto pe-md-3 d-flex align-items-center"
                        >
                        </div>
                        <ul class="navbar-nav justify-content-end">
                            <!-- Language Switcher -->
                            <LanguageSwitcher 
                                :showLanguageMenu="showLanguageMenu"
                                @update:showLanguageMenu="showLanguageMenu = $event"
                                @toggleLanguageMenu="toggleLanguageMenu"
                            />
                            <!-- Dark Mode Dropdown -->
                            <li
                                class="nav-item dropdown pe-2 d-flex align-items-center ms-2 me-2"
                            >
                                <a
                                    href="javascript:;"
                                    class="avatar avatar-sm border rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                                    id="dropdownMenuTheme"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    @click="toggleThemeMenu"
                                >
                                    <i
                                        :class="themeIcon"
                                        class="cursor-pointer fs-5"
                                    ></i>
                                </a>
                                <ul
                                    class="dropdown-menu dropdown-menu-end px-2 py-2 me-sm-n4"
                                    :class="{ show: showThemeMenu }"
                                    aria-labelledby="dropdownMenuTheme"
                                    style="min-width: 160px;"
                                >
                                    <li>
                                        <a
                                            class="dropdown-item border-radius-md d-flex align-items-center py-2"
                                            href="javascript:;"
                                            @click="setTheme('light')"
                                            :class="{ 'bg-light': darkModePreference === 'light' }"
                                        >
                                            <i class="fa fa-sun text-warning me-3"></i>
                                            <span class="text-sm">{{ $t('light_mode') }}</span>
                                            <i
                                                v-if="darkModePreference === 'light'"
                                                class="fa fa-check text-success ms-auto"
                                            ></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            class="dropdown-item border-radius-md d-flex align-items-center py-2"
                                            href="javascript:;"
                                            @click="setTheme('dark')"
                                            :class="{ 'bg-light': darkModePreference === 'dark' }"
                                        >
                                            <i class="fa fa-moon text-primary me-3"></i>
                                            <span class="text-sm">{{ $t('dark_mode') }}</span>
                                            <i
                                                v-if="darkModePreference === 'dark'"
                                                class="fa fa-check text-success ms-auto"
                                            ></i>
                                        </a>
                                    </li>
                                    <li>
                                        <a
                                            class="dropdown-item border-radius-md d-flex align-items-center py-2"
                                            href="javascript:;"
                                            @click="setTheme('system')"
                                            :class="{ 'bg-light': darkModePreference === 'system' }"
                                        >
                                            <i class="fa fa-desktop text-info me-3"></i>
                                            <span class="text-sm">{{ $t('system_mode') }}</span>
                                            <i
                                                v-if="darkModePreference === 'system'"
                                                class="fa fa-check text-success ms-auto"
                                            ></i>
                                        </a>
                                    </li>
                                </ul>
                            </li>
                            <!-- User Dropdown -->
                            <li
                                class="nav-item dropdown pe-2 d-flex align-items-center"
                            >
                                <a
                                    href="javascript:;"
                                    class="nav-link text-body p-0"
                                    id="dropdownMenuUser"
                                    data-bs-toggle="dropdown"
                                    aria-expanded="false"
                                    @click="toggleUserMenu"
                                >
                                    <div
                                        class="avatar avatar-sm bg-gradient-primary rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
                                    >
                                        <span
                                            class="text-white text-xs font-weight-bold"
                                            >{{ getInitials(authUser?.name) }}</span
                                        >
                                    </div>
                                </a>
                                <ul
                                    class="dropdown-menu dropdown-menu-end px-2 py-3 me-sm-n4"
                                    :class="{ show: showUserMenu }"
                                    aria-labelledby="dropdownMenuUser"
                                >
                                    <!-- User Info Section -->
                                    <li class="px-2 pb-2">
                                        <div class="d-flex align-items-center">
                                            <div
                                                class="avatar avatar-sm bg-gradient-primary rounded-circle me-3"
                                            >
                                                <span
                                                    class="text-white text-xs font-weight-bold"
                                                    >{{ getInitials(authUser?.name) }}</span
                                                >
                                            </div>
                                            <div class="d-flex flex-column">
                                                <h6
                                                    class="mb-0 text-dark font-weight-bold"
                                                >
                                                    {{ authUser?.name || 'User' }}
                                                </h6>
                                                <p
                                                    class="text-xs text-secondary mb-0"
                                                >
                                                    {{ authUser?.email || 'user@example.com' }}
                                                </p>
                                                <span
                                                    class="badge badge-sm bg-gradient-info"
                                                    >{{ authUser?.role || 'Student' }}</span
                                                >
                                            </div>
                                        </div>
                                    </li>
                                    <li><hr class="horizontal dark my-2" /></li>

                                    <!-- Menu Items -->
                                    <li>
                                        <router-link
                                            :to="resolve_route_name('profile.show')"
                                            class="dropdown-item border-radius-md"
                                        >
                                            <div
                                                class="d-flex align-items-center py-1"
                                            >
                                                <i
                                                    class="fa fa-graduation-cap text-dark me-3"
                                                ></i>
                                                <h6
                                                    class="text-sm font-weight-normal mb-0"
                                                >
                                                    {{ $t('my_profile') }}
                                                </h6>
                                            </div>
                                        </router-link>
                                    </li>

                                    <li><hr class="horizontal dark my-2" /></li>

                                    <li>
                                        <button
                                            class="dropdown-item border-radius-md d-flex align-items-center justify-content-between py-1 w-100"
                                            @click="logout"
                                            style="border: none; background: none;"
                                        >
                                            <div
                                                class="d-flex align-items-center py-1"
                                            >
                                                <i
                                                    class="fa fa-sign-out-alt text-dark me-3"
                                                ></i>
                                                <h6
                                                    class="text-sm font-weight-normal mb-0"
                                                >
                                                    {{ $t('logout') }}
                                                </h6>
                                            </div>
                                        </button>
                                    </li>
                                </ul>
                            </li>

                            <!-- Mobile Menu Toggle -->
                            <li
                                class="nav-item d-xl-none ps-3 d-flex align-items-center"
                            >
                                <a
                                    href="#"
                                    @click="toggleSidebar"
                                    class="p-0 nav-link text-body"
                                    id="iconNavbarSidenav"
                                >
                                    <div class="sidenav-toggler-inner">
                                        <i class="sidenav-toggler-line"></i>
                                        <i class="sidenav-toggler-line"></i>
                                        <i class="sidenav-toggler-line"></i>
                                    </div>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <!-- Page Content -->
            <div class="container-fluid py-4">
                <slot />

                <!-- Toast Container -->
                <Toast />
            </div>
            <!-- Footer -->
            <footer class="footer pt-3">
                <div class="container-fluid">
                    <div
                        class="row align-items-center justify-content-lg-between"
                    >
                        <div class="col-lg-6 mb-lg-0 mb-4">
                            <div
                                class="copyright text-center text-sm text-muted text-lg-start"
                            >
                                © {{ new Date().getFullYear() }}, made with Love
                                <i class="fa fa-heart"></i> by <a href="https://github.com/doanquangnd" target="_blank">Java Quiz</a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </main>

        <!-- Gamification Notifications -->
        <NotificationManager />
    </div>
</template>

<script setup>
import { useAppStore } from "@/stores/app";
import { useAuthStore } from "@/stores/auth";
import { useDarkMode } from "@/composables/useDarkMode";
import { useTypographySettings } from "@/composables/useTypographySettings";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { resolve_route_name } from '@/utils/route-helper.js'
import LanguageSwitcher from "@/components/LanguageSwitcher.vue";
import Logo from "@/components/Logo.vue";
import NotificationManager from "@/components/Gamification/NotificationManager.vue";
import Toast from "@/components/Toast.vue";

const props = defineProps({
    breadcrumb: {
        type: String,
        default: ''
    }
});

const appStore = useAppStore();
const auth_store = useAuthStore();
const route = useRoute();
const router = useRouter();
const showUserMenu = ref(false);
const showThemeMenu = ref(false);
const showLanguageMenu = ref(false);
const { isDarkMode, darkModePreference, toggleDarkMode, setDarkModePreference, initializeDarkMode } = useDarkMode();
const { cssVariables } = useTypographySettings(); // Initialize typography settings
const isEnableAchievements = import.meta.env.VITE_ENABLE_ACHIEVEMENTS === 'true';
const isEnableLeaderboard = import.meta.env.VITE_ENABLE_LEADERBOARD === 'true';


// Get current page name from URL
const currentPageName = computed(() => {
    const path = window.location.pathname;
    if (path.includes("documents")) return "Tài liệu";
    if (path.includes("exams")) return "Đề thi";
    if (path.includes("dashboard")) return "Dashboard";
    if (path.includes("quiz")) return "Làm bài";
    if (path.includes("profile")) return "Hồ sơ";
    if (path.includes("achievements")) return "Thành tựu";
    if (path.includes("leaderboard")) return "Bảng xếp hạng";
    if (path.includes("settings")) return "Cài đặt";
    return "Home";
});

// Check if current route is active
const isActive = (routeName) => {
    return route.path.includes(routeName);
};

// Theme icon based on current preference
const themeIcon = computed(() => {
    if (darkModePreference.value === 'dark') {
        return 'fa fa-moon text-primary';
    } else if (darkModePreference.value === 'light') {
        return 'fa fa-sun text-warning';
    } else {
        return 'fa fa-moon text-info';
    }
});

// Toggle theme menu
const toggleThemeMenu = () => {
    showThemeMenu.value = !showThemeMenu.value;
    if (showThemeMenu.value) {
        showUserMenu.value = false;
        showLanguageMenu.value = false;
    }
};

// Toggle language menu
const toggleLanguageMenu = () => {
    showLanguageMenu.value = !showLanguageMenu.value;
    if (showLanguageMenu.value) {
        showUserMenu.value = false;
        showThemeMenu.value = false;
    }
};

// Set theme preference
const setTheme = (theme) => {
    setDarkModePreference(theme);
    showThemeMenu.value = false;
};

// Logout function
const logout = async () => {
    try {
        await auth_store.logout();
        router.push('/signin');
    } catch (error) {
        window.location.href = '/signin';
    }
};

// Safe auth data access
const authUser = computed(() => {
  return auth_store.user || null
})

const getInitials = (name) => {
  if (!name) return 'U'
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 2)
}
// Mobile sidenav toggle
const toggleSidenav = () => {
    const sidenav_show = document.querySelector(".g-sidenav-show");
      if (sidenav_show.classList.contains("g-sidenav-hidden")) {
        sidenav_show.classList.remove("g-sidenav-hidden");
        sidenav_show.classList.add("g-sidenav-pinned");
      } else {
        sidenav_show.classList.add("g-sidenav-hidden");
        sidenav_show.classList.remove("g-sidenav-pinned");
      }
};

// Toggle user dropdown menu
const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
    if (showUserMenu.value) {
        showThemeMenu.value = false;
        showLanguageMenu.value = false;
    }
};

onMounted(() => {
    // Initialize dark mode
    initializeDarkMode();

    // Initialize mobile toggle
    const toggleBtn = document.getElementById("iconNavbarSidenav");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", toggleSidenav);
    }

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
        const userDropdown = document.getElementById("dropdownMenuUser");
        const themeDropdown = document.getElementById("dropdownMenuTheme");
        const languageDropdown = document.getElementById("languageDropdown");
        
        if (
            userDropdown &&
            !userDropdown.contains(e.target) &&
            !e.target.closest(".dropdown-menu")
        ) {
            showUserMenu.value = false;
        }
        
        if (
            themeDropdown &&
            !themeDropdown.contains(e.target) &&
            !e.target.closest(".dropdown-menu")
        ) {
            showThemeMenu.value = false;
        }
        
        if (
            languageDropdown &&
            !languageDropdown.contains(e.target) &&
            !e.target.closest(".dropdown-menu")
        ) {
            showLanguageMenu.value = false;
        }
    });
});

// Watch for dark mode changes and apply to body
watch(isDarkMode, (newValue) => {
    const html = document.documentElement;
    const body = document.body;
    
    // Add transition class to disable transitions
    html.classList.add('theme-transitioning');
    body.classList.add('theme-transitioning');
    
    if (newValue) {
        html.classList.add('dark');
        html.setAttribute('data-bs-theme', 'dark');
        html.style.backgroundColor = '#16213e';
    } else {
        html.classList.remove('dark');
        html.setAttribute('data-bs-theme', 'light');
        html.style.backgroundColor = '#F8F9FA';
    }
    
    // Force reflow to ensure changes are applied
    html.offsetHeight;
    
    // Remove transition class after changes are applied
    requestAnimationFrame(() => {
        html.classList.remove('theme-transitioning');
        body.classList.remove('theme-transitioning');
    });
}, { immediate: true });
</script>

<style scoped>
    /* Responsive sidenav */
    @media (max-width: 1199.98px) {
        .sidenav {
            transform: translateX(-100%);
            transition: transform 0.3s ease-in-out;
        }

        .g-sidenav-pinned .sidenav {
            transform: translateX(0);
        }

        .g-sidenav-hidden .sidenav {
            transform: translateX(-100%);
        }

        .main-content {
            margin-left: 0 !important;
        }
    }

    @media (min-width: 1200px) {
        .main-content {
            margin-left: 280px;
        }
    }

    /* Sidenav styles */
    .sidenav {
        width: 280px;
        min-height: 100vh;
        background: white;
        box-shadow: 0 0.25rem 1rem rgba(0, 0, 0, 0.15);
    }

    /* Active nav item */
    .nav-link.active {
        background-color: rgba(255, 255, 255, 0.1);
        border-radius: 0.5rem;
    }

    .nav-link.active .icon {
        background: linear-gradient(310deg, #7928ca, #ff0080) !important;
    }

    .nav-link.active .icon i {
        color: white !important;
    }

    /* Navbar blur effect */
    #navbarBlur {
        backdrop-filter: saturate(200%) blur(30px);
        background-color: rgba(255, 255, 255, 0.8);
        z-index: 9 !important;
    }

    /* User avatar styles */
    .avatar {
        width: 36px;
        height: 36px;
        cursor: pointer;
        transition: all 0.2s ease-in-out;
    }

    .avatar:hover {
        transform: scale(1.05);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
    }

    /* Dropdown menu styles */
    .dropdown-menu {
        min-width: 280px;
        box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15);
        border: 0;
        margin-top: 0.5rem;
    }

    .dropdown-item {
        transition: all 0.2s ease-in-out;
    }

    .dropdown-item:hover {
        background-color: rgba(0, 0, 0, 0.05);
        transform: translateX(4px);
    }

    .dropdown-item h6 {
        color: #344767;
        margin: 0;
    }

    .dropdown-item i {
        color: #67748e;
    }

    /* Badge styles */
    .badge {
        font-size: 0.65rem;
        padding: 0.25rem 0.5rem;
    }

    /* Form switch styles */
    .form-check-input {
        width: 2rem;
        height: 1rem;
    }

    .form-check-input:checked {
        background-color: #7928ca;
        border-color: #7928ca;
    }

    /* Select dropdown styles */
    .form-select {
        font-size: 0.875rem;
        padding: 0.25rem 0.5rem;
    }

    /* User info section */
    .dropdown-menu li:first-child {
        background-color: rgba(0, 0, 0, 0.02);
        border-radius: 0.5rem;
        margin-bottom: 0.5rem;
    }

    /* Notification badge */
    .position-relative .badge {
        font-size: 0.5rem !important;
        padding: 0.15rem 0.3rem;
        min-width: 1rem;
        height: 1rem;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .page-fade-enter-active,
    .page-fade-leave-active {
        transition: opacity 0.5s ease, transform 0.5s ease;
    }

    .page-fade-enter-from,
    .page-fade-leave-to {
        opacity: 0;
        transform: translateY(20px);
    }
</style>
