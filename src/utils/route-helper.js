import router from '@/router/index.js'

/**
 * Resolve route by name with params
 * @param {string} name - Route name
 * @param {object|string|number} params - Route parameters
 * @returns {string} Resolved path
 */
export function resolve_route_name(name, params = {}) {
  try {
    const resolved = router.resolve({ name, params })
    return resolved.path
  } catch (error) {
    console.warn(`Route "${name}" not found:`, error)
    return '/'
  }
}

/**
 * Navigate to a route by name
 * @param {string} name - Route name
 * @param {object|string|number} params - Route parameters
 */
export function navigate_to_route(name, params = {}) {
  try {
    router.push({ name, params })
  } catch (error) {
    console.warn(`Failed to navigate to route "${name}":`, error)
  }
}

