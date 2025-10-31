/**
 * Security Composable
 * 
 * Provides security utilities for Vue components:
 * - XSS protection (DOMPurify integration)
 * - Safe URL validation
 * - Secure redirect
 * - Safe localStorage
 */

import { ref } from 'vue';

/**
 * Check if DOMPurify is available
 */
const isDOMPurifyAvailable = () => {
    return typeof window !== 'undefined' && window.DOMPurify;
};

/**
 * Sanitize HTML to prevent XSS
 * 
 * @param {string} dirty - Untrusted HTML
 * @param {object} config - DOMPurify config
 * @returns {string} - Clean HTML
 */
export const sanitizeHtml = (dirty, config = {}) => {
    if (!dirty || typeof dirty !== 'string') {
        return '';
    }

    // If DOMPurify is available, use it
    if (isDOMPurifyAvailable()) {
        return window.DOMPurify.sanitize(dirty, {
            ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'u', 'p', 'br', 'span', 'a', 'code', 'pre'],
            ALLOWED_ATTR: ['href', 'class'],
            ALLOW_DATA_ATTR: false,
            ...config
        });
    }

    // Fallback: strip all HTML tags
    return dirty.replace(/<[^>]*>/g, '');
};

/**
 * Validate URL for safety
 * 
 * @param {string} url - URL to validate
 * @param {boolean} sameOriginOnly - Only allow same origin
 * @returns {boolean} - Is URL safe
 */
export const isSafeUrl = (url, sameOriginOnly = false) => {
    if (!url || typeof url !== 'string') {
        return false;
    }

    const trimmed = url.trim();

    // Check for dangerous protocols
    const dangerousProtocols = ['javascript:', 'data:', 'vbscript:', 'file:', 'about:'];
    const lowerUrl = trimmed.toLowerCase();
    
    for (const protocol of dangerousProtocols) {
        if (lowerUrl.startsWith(protocol)) {
            return false;
        }
    }

    // Allow relative URLs
    if (trimmed.startsWith('/') && !trimmed.startsWith('//')) {
        return true;
    }

    if (trimmed.startsWith('#') || trimmed.startsWith('?')) {
        return true;
    }

    // For absolute URLs, check same origin if required
    try {
        const urlObj = new URL(trimmed, window.location.origin);
        
        // Only allow http/https
        if (!['http:', 'https:'].includes(urlObj.protocol)) {
            return false;
        }

        if (sameOriginOnly) {
            return urlObj.origin === window.location.origin;
        }

        return true;
    } catch (e) {
        return false;
    }
};

/**
 * Safe redirect
 * 
 * @param {string} url - URL to redirect to
 * @param {boolean} sameOriginOnly - Only allow same origin
 */
export const safeRedirect = (url, sameOriginOnly = true) => {
    if (!isSafeUrl(url, sameOriginOnly)) {
        console.warn('Unsafe redirect blocked:', url);
        // Redirect to home instead
        window.location.href = '/';
        return;
    }

    window.location.href = url;
};

/**
 * Secure localStorage wrapper
 */
export const secureStorage = {
    /**
     * Get item from localStorage
     * 
     * @param {string} key
     * @param {any} defaultValue
     * @returns {any}
     */
    get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            if (item === null) {
                return defaultValue;
            }
            return JSON.parse(item);
        } catch (e) {
            console.error('Error reading from localStorage:', e);
            return defaultValue;
        }
    },

    /**
     * Set item in localStorage
     * 
     * @param {string} key
     * @param {any} value
     * @returns {boolean} - Success
     */
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Error writing to localStorage:', e);
            return false;
        }
    },

    /**
     * Remove item from localStorage
     * 
     * @param {string} key
     */
    remove(key) {
        try {
            localStorage.removeItem(key);
        } catch (e) {
            console.error('Error removing from localStorage:', e);
        }
    },

    /**
     * Clear all items (use with caution)
     */
    clear() {
        try {
            localStorage.clear();
        } catch (e) {
            console.error('Error clearing localStorage:', e);
        }
    }
};

/**
 * Remove console logs in production
 */
export const setupProductionLogger = () => {
    if (import.meta.env.PROD) {
        // Override console methods in production
        console.log = () => {};
        console.debug = () => {};
        console.info = () => {};
        
        // Keep error and warn for critical issues
        // console.error = () => {};
        // console.warn = () => {};
    }
};

/**
 * Main composable
 */
export const useSecurity = () => {
    const isProduction = ref(import.meta.env.PROD);

    return {
        // XSS Protection
        sanitizeHtml,
        
        // URL Security
        isSafeUrl,
        safeRedirect,
        
        // Storage Security
        secureStorage,
        
        // Environment
        isProduction,
        
        // Logger
        setupProductionLogger,
    };
};

export default useSecurity;

