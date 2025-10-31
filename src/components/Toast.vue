<template>
  <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1055;">
    <transition-group name="toast" tag="div">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="toast show shadow-lg"
        :class="getToastClass(toast.type)"
        role="alert"
        aria-live="assertive"
        aria-atomic="true"
      >
        <div class="toast-header d-flex align-items-center">
          <i :class="getIconClass(toast.type)" class="me-2 fs-5"></i>
          <strong class="me-auto fw-semibold fs-6">{{ toast.title || getDefaultTitle(toast.type) }}</strong>
          <small class="fw-medium">{{ formatTime(toast.createdAt) }}</small>
          <button
            type="button"
            class="btn-close ms-2"
            aria-label="Close"
            @click="removeToast(toast.id)"
          ></button>
        </div>
        <div class="toast-body">
          <div v-if="toast.message" class="mb-2">{{ toast.message }}</div>

          <!-- Action buttons -->
          <div v-if="toast.actions && toast.actions.length" class="d-flex flex-wrap gap-2 mt-1">
            <button
              v-for="action in toast.actions"
              :key="action.label"
              :class="action.class || 'btn btn-sm btn-outline-secondary'"
              @click="handleAction(action, toast.id)"
            >
              {{ action.label }}
            </button>
          </div>
        </div>

        <!-- Progress bar -->
        <div
          v-if="!toast.persistent && toast.duration > 0"
          class="toast-progress"
          :style="{ animationDuration: `${toast.duration}ms` }"
        ></div>
      </div>
    </transition-group>
  </div>
</template>

<script setup>
import { useToastStore } from '@/stores/toast.js'

const toastStore = useToastStore()
const toasts = toastStore.toasts

const removeToast = (id) => toastStore.remove(id)

const handleAction = (action, toastId) => {
  if (action.action) action.action(toastId)
}

const getToastClass = (type) => ({
  success: 'toast-success',
  error: 'toast-error',
  warning: 'toast-warning',
  info: 'toast-info',
  confirm: 'toast-confirm'
}[type] || 'toast-info')

const getIconClass = (type) => ({
  success: 'fas fa-check-circle text-success',
  error: 'fas fa-exclamation-circle text-danger',
  warning: 'fas fa-exclamation-triangle text-warning',
  info: 'fas fa-info-circle text-info',
  confirm: 'fas fa-question-circle text-primary'
}[type] || 'fas fa-info-circle text-info')

const getDefaultTitle = (type) => ({
  success: 'Success',
  error: 'Error',
  warning: 'Warning',
  info: 'Info',
  confirm: 'Confirm'
}[type] || 'Info')

const formatTime = (createdAt) => {
  if (!createdAt) return ''
  const now = new Date()
  const created = new Date(createdAt)
  const diff = now - created

  if (diff < 1000) return 'Just now'
  if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`
  if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`
  return created.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>

</style>
