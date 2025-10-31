import { ref } from 'vue'

const turnstileRef = ref(null)

export function registerTurnstile(widgetInstance) {
  turnstileRef.value = widgetInstance
}

export function unregisterTurnstile() {
  turnstileRef.value = null
}

export function reset() {
  if (turnstileRef.value) {
    turnstileRef.value.reset()
  } else {
    window.dispatchEvent(new Event('reset-turnstile'))
  }
}

export function getToken() {
  return turnstileRef.value ? turnstileRef.value.getToken() : ''
}
