import { defineStore } from 'pinia'

export const useAppStore = defineStore('app', {
  state: () => ({
    hideConfigButton: false,
    isPinned: true,
    isTransparent: '',
    isRTL: false,
    color: '',
    isNavFixed: false,
    isAbsolute: false,
    showNavs: true,
    showSidenav: true,
    showNavbar: true,
    showFooter: true,
    showMain: true,
    navbarFixed: 'position-sticky blur shadow-blur left-auto top-1 z-index-sticky px-0 mx-4',
    absolute: 'position-absolute px-4 mx-0 w-100 z-index-2',
    bootstrap: 'bootstrap/dist/css/bootstrap.min.css',
    locale: localStorage.getItem('locale') || 'vi', // Load from localStorage
  }),

  getters: {
    navClasses: (state) => ({
      'position-sticky blur shadow-blur mt-4 left-auto top-1 z-index-sticky': state.isNavFixed,
      'position-absolute px-4 mx-0 w-100 z-index-2': state.isAbsolute,
      'px-0 mx-4 mt-4': !state.isAbsolute,
    })
  },

  actions: {
    /**
     * Set locale và lưu vào localStorage
     */
    setLocale(locale) {
      this.locale = locale
      localStorage.setItem('locale', locale)
    },
    
    navbarMinimize() {
      const sidenav_show = document.querySelector('.g-sidenav-show')
      if (sidenav_show?.classList.contains('g-sidenav-hidden')) {
        sidenav_show.classList.remove('g-sidenav-hidden')
        sidenav_show.classList.add('g-sidenav-pinned')
        this.isPinned = true
      } else if (sidenav_show) {
        sidenav_show.classList.add('g-sidenav-hidden')
        sidenav_show.classList.remove('g-sidenav-pinned')
        this.isPinned = false
      }
    },

    sidebarType(payload) {
      this.isTransparent = payload
    },

    cardBackground(payload) {
      this.color = payload
    },

    navbarFixed() {
      this.isNavFixed = !this.isNavFixed
    },

    toggleEveryDisplay() {
      this.showNavbar = !this.showNavbar
      this.showSidenav = !this.showSidenav
      this.showFooter = !this.showFooter
    },

    toggleHideConfig() {
      this.hideConfigButton = !this.hideConfigButton
    },

    toggleSidebarColor(payload) {
      this.sidebarType(payload)
    },

    setCardBackground(payload) {
      this.cardBackground(payload)
    },

    // Initialize app
    initialize() {
      this.isTransparent = 'bg-transparent'
    }
  }
})
