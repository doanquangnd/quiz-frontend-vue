<template>
    <li class="nav-item dropdown pe-2 d-flex align-items-center">
        <a
            href="javascript:;"
            class="avatar avatar-sm border rounded-circle d-flex align-items-center justify-content-center cursor-pointer"
            id="languageDropdown"
            @click="toggleMenu"
        >
            <span class="flag-icon cursor-pointer fs-5" :class="flagIcon"></span>
        </a>
        <ul
            class="dropdown-menu dropdown-menu-end px-2 py-2 me-sm-n4"
            :class="{ show: showMenu }"
            aria-labelledby="languageDropdown"
            style="min-width: 160px;"
        >
            <li v-for="(name, code) in languages" :key="code">
                <a
                    class="dropdown-item border-radius-md d-flex align-items-center py-2"
                    href="javascript:;"
                    @click="switchLanguage(code)"
                    :class="{ 'bg-light': code === locale }"
                >
                    <span class="flag-icon me-3" :class="getFlagIcon(code)"></span>
                    <span class="text-sm">{{ name }}</span>
                    <i
                        v-if="code === locale"
                        class="fa fa-check text-success ms-auto"
                    ></i>
                </a>
            </li>
        </ul>
    </li>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useTranslation } from '@/composables/useTranslation'
import { useSeo, SEO_CONFIGS } from '@/composables/useSeo.js'
import { SEO_CONFIGS_EN } from '@/composables/useSeo.en.js'
import { SEO_CONFIGS_JA } from '@/composables/useSeo.ja.js'

// Composables
const route = useRoute()
const { t, locale, setLocale } = useTranslation()
const { update_seo } = useSeo()

// State
const showMenu = ref(false)

// Languages data
const languages = {
    'vi': 'Tiếng Việt',
    'en': 'English',
    'ja': '日本語'
}

// Route to SEO config mapping
const get_seo_config_for_route = (lang, route_name) => {
    // Select configs based on language
    let configs
    if (lang === 'en') {
        configs = SEO_CONFIGS_EN
    } else if (lang === 'ja') {
        configs = SEO_CONFIGS_JA
    } else {
        configs = SEO_CONFIGS // Vietnamese (default)
    }
    
    // Map route names to SEO configs
    const route_map = {
        'signin': configs.signin,
        'signup': configs.signup,
        'dashboard': configs.dashboard,
        'documents': configs.documents,
        'documents-index': configs.documents,
        'leaderboard': configs.leaderboard,
        'achievements': configs.achievements,
        'profile': configs.profile,
    }
    
    return route_map[route_name] || configs.home
}

// Methods
const toggleMenu = () => {
    showMenu.value = !showMenu.value
}

const getFlagIcon = (code) => {
    if (code === 'vi') {
        return 'flag-icon-vn'
    } else if (code === 'en') {
        return 'flag-icon-uk'
    } else if (code === 'ja') {
        return 'flag-icon-jp'
    }
    return 'flag-icon-vn'
}

const switchLanguage = (newLocale) => {
    if (newLocale === locale.value) return
    
    // Change language
    setLocale(newLocale)
    
    // Update SEO for current page
    const seo_config = get_seo_config_for_route(newLocale, route.name)
    if (seo_config) {
        update_seo(seo_config)
    }
    
    // Close menu
    showMenu.value = false
}

// Computed
const flagIcon = computed(() => {
    return getFlagIcon(locale.value)
})

// Watch language changes from other sources
watch(() => locale.value, (new_lang) => {
    const seo_config = get_seo_config_for_route(new_lang, route.name)
    if (seo_config) {
        update_seo(seo_config)
    }
})

// Close dropdown when clicking outside
onMounted(() => {
    document.addEventListener("click", (e) => {
        const languageDropdown = document.getElementById("languageDropdown")
        if (
            languageDropdown &&
            !languageDropdown.contains(e.target) &&
            !e.target.closest(".dropdown-menu")
        ) {
            showMenu.value = false
        }
    })
})
</script>

<style scoped>
.flag-icon {
    width: 24px;
    height: 18px;
    display: inline-block;
    border-radius: 3px;
    background-size: cover;
    background-position: center;
    border: 1px solid rgba(0, 0, 0, 0.1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.flag-icon-vn {
  background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTUuMiAzOC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NS4yIDM4LjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiNEQTI1MUQ7fSAuc3Qxe2ZpbGw6I0ZGRkYwMDt9PC9zdHlsZT48Zz48cGF0aCBjbGFzcz0ic3QwIiBkPSJNMy4wMSwwaDQ5LjE3YzEuNjYsMC4wMSwzLjAxLDEuMzcsMy4wMSwzLjAzdjMyLjMzYzAsMS42Ni0xLjM1LDMuMDItMy4wMSwzLjAzSDMuMDEgQzEuMzUsMzguMzksMCwzNy4wMywwLDM1LjM3VjMuMDNDMCwxLjM3LDEuMzUsMC4wMSwzLjAxLDBMMy4wMSwweiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yNy42LDExLjUybC0yLjM3LDcuM2w0Ljg3LDEuNThMMjcuNiwxMS41MkwyNy42LDExLjUyeiBNMjcuNiwxMS41MkwyNy42LDExLjUyTDI3LjYsMTEuNTJMMjcuNiwxMS41MnoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjcuNiwxMS41MmwyLjM3LDcuM2wtNC44NywxLjU4TDI3LjYsMTEuNTJMMjcuNiwxMS41MnogTTI3LjYsMTEuNTJMMjcuNiwxMS41MkwyNy42LDExLjUyTDI3LjYsMTEuNTJ6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTM0LjksMTYuODNoLTcuNjh2NS4xMkwzNC45LDE2LjgzTDM0LjksMTYuODN6IE0zNC45LDE2LjgzTDM0LjksMTYuODNMMzQuOSwxNi44M0wzNC45LDE2LjgzeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zNC45LDE2LjgzbC02LjIxLDQuNTFsLTMuMDEtNC4xNEwzNC45LDE2LjgzTDM0LjksMTYuODN6IE0zNC45LDE2LjgzTDM0LjksMTYuODNMMzQuOSwxNi44M0wzNC45LDE2LjgzeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0zMi4xMSwyNS40MWwtMi4zNy03LjNsLTQuODcsMS41OEwzMi4xMSwyNS40MUwzMi4xMSwyNS40MXogTTMyLjExLDI1LjQxTDMyLjExLDI1LjQxTDMyLjExLDI1LjQxIEwzMi4xMSwyNS40MXoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMzIuMTEsMjUuNDFMMjUuOSwyMC45bDMuMDEtNC4xNEwzMi4xMSwyNS40MUwzMi4xMSwyNS40MXogTTMyLjExLDI1LjQxTDMyLjExLDI1LjQxTDMyLjExLDI1LjQxTDMyLjExLDI1LjQxIHoiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAuMywxNi44M2g3LjY4djUuMTJMMjAuMywxNi44M0wyMC4zLDE2LjgzeiBNMjAuMywxNi44M0wyMC4zLDE2LjgzTDIwLjMsMTYuODNMMjAuMywxNi44M3oiLz48cGF0aCBjbGFzcz0ic3QxIiBkPSJNMjAuMywxNi44M2w2LjIxLDQuNTFsMy4wMS00LjE0TDIwLjMsMTYuODNMMjAuMywxNi44M3ogTTIwLjMsMTYuODNMMjAuMywxNi44M0wyMC4zLDE2LjgzTDIwLjMsMTYuODN6Ii8+PHBhdGggY2xhc3M9InN0MSIgZD0iTTIzLjA5LDI1LjQxbDIuMzctNy4zbDQuODcsMS41OEwyMy4wOSwyNS40MUwyMy4wOSwyNS40MXogTTIzLjA5LDI1LjQxTDIzLjA5LDI1LjQxTDIzLjA5LDI1LjQxTDIzLjA5LDI1LjQxeiIvPjxwYXRoIGNsYXNzPSJzdDEiIGQ9Ik0yMy4wOSwyNS40MWw2LjIxLTQuNTFsLTMuMDEtNC4xNEwyMy4wOSwyNS40MUwyMy4wOSwyNS40MXogTTIzLjA5LDI1LjQxTDIzLjA5LDI1LjQxTDIzLjA5LDI1LjQxIEwyMy4wOSwyNS40MXoiLz48L2c+PC9zdmc+");
}
.flag-icon-uk {
    background-image: url("data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IiB2aWV3Qm94PSIwIDAgNTUuMiAzOC40IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1NS4yIDM4LjQiIHhtbDpzcGFjZT0icHJlc2VydmUiPjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI+LnN0MHtmaWxsOiNGRUZFRkU7fSAuc3Qxe2ZpbGw6I0M4MTAyRTt9IC5zdDJ7ZmlsbDojMDEyMTY5O308L3N0eWxlPjxnPjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik0yLjg3LDM4LjRoNDkuNDZjMS41OS0wLjA5LDIuODctMS40MiwyLjg3LTMuMDNWMy4wM2MwLTEuNjYtMS4zNS0zLjAyLTMuMDEtMy4wM0gzLjAxIEMxLjM1LDAuMDEsMCwxLjM3LDAsMy4wM3YzMi4zM0MwLDM2Ljk4LDEuMjgsMzguMzEsMi44NywzOC40TDIuODcsMzguNHoiLz48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjIzLjc0LDIzLjAzIDIzLjc0LDM4LjQgMzEuNDIsMzguNCAzMS40MiwyMy4wMyA1NS4yLDIzLjAzIDU1LjIsMTUuMzUgMzEuNDIsMTUuMzUgMzEuNDIsMCAyMy43NCwwIDIzLjc0LDE1LjM1IDAsMTUuMzUgMCwyMy4wMyAyMy43NCwyMy4wMyIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMy45OCwxMi40M1YwaDE4LjIzYzEuMjYsMC4wMiwyLjM0LDAuODEsMi43OCwxLjkyTDMzLjk4LDEyLjQzTDMzLjk4LDEyLjQzeiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0zMy45OCwyNS45N1YzOC40aDE4LjM1YzEuMjEtMC4wNywyLjIzLTAuODUsMi42Ni0xLjkyTDMzLjk4LDI1Ljk3TDMzLjk4LDI1Ljk3eiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMS4xOCwyNS45N1YzOC40SDIuODdjLTEuMjEtMC4wNy0yLjI0LTAuODUtMi42Ni0xLjk0TDIxLjE4LDI1Ljk3TDIxLjE4LDI1Ljk3eiIvPjxwYXRoIGNsYXNzPSJzdDIiIGQ9Ik0yMS4xOCwxMi40M1YwSDIuOTlDMS43MywwLjAyLDAuNjQsMC44MiwwLjIxLDEuOTRMMjEuMTgsMTIuNDNMMjEuMTgsMTIuNDN6Ii8+PHBvbHlnb24gY2xhc3M9InN0MiIgcG9pbnRzPSIwLDEyLjggNy42NSwxMi44IDAsOC45NyAwLDEyLjgiLz48cG9seWdvbiBjbGFzcz0ic3QyIiBwb2ludHM9IjU1LjIsMTIuOCA0Ny41MSwxMi44IDU1LjIsOC45NSA1NS4yLDEyLjgiLz48cG9seWdvbiBjbGFzcz0ic3QyIiBwb2ludHM9IjU1LjIsMjUuNiA0Ny41MSwyNS42IDU1LjIsMjkuNDUgNTUuMiwyNS42Ii8+PHBvbHlnb24gY2xhc3M9InN0MiIgcG9pbnRzPSIwLDI1LjYgNy42NSwyNS42IDAsMjkuNDMgMCwyNS42Ii8+PHBvbHlnb24gY2xhc3M9InN0MSIgcG9pbnRzPSI1NS4yLDMuMjUgMzYuMTUsMTIuOCA0MC40MSwxMi44IDU1LjIsNS40IDU1LjIsMy4yNSIvPjxwb2x5Z29uIGNsYXNzPSJzdDEiIHBvaW50cz0iMTkuMDEsMjUuNiAxNC43NSwyNS42IDAsMzIuOTggMCwzNS4xMyAxOS4wNSwyNS42IDE5LjAxLDI1LjYiLz48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjEwLjUyLDEyLjgxIDE0Ljc4LDEyLjgxIDAsNS40MSAwLDcuNTUgMTAuNTIsMTIuODEiLz48cG9seWdvbiBjbGFzcz0ic3QxIiBwb2ludHM9IjQ0LjYzLDI1LjU5IDQwLjM3LDI1LjU5IDU1LjIsMzMuMDIgNTUuMiwzMC44OCA0NC42MywyNS41OSIvPjwvZz48L3N2Zz4=");
}

.flag-icon-jp {
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 3 2"><rect width="3" height="2" fill="%23ffffff"/><circle cx="1.5" cy="1" r="0.6" fill="%23bc002d"/></svg>');
}

/* Dark mode support */
.dark .flag-icon {
    border-color: rgba(255, 255, 255, 0.2);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
}

/* Hover effects */
.flag-icon:hover {
    transform: scale(1.05);
    transition: transform 0.2s ease;
}

/* Active state */
.dropdown-item.bg-light {
    background-color: #f8f9fa !important;
}

.dark .dropdown-item.bg-light {
    background-color: var(--dm-bg-tertiary) !important;
}
</style>
