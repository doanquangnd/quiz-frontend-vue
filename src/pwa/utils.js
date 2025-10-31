// PWA Utility Functions
export class PWAUtils {
    /**
     * Check if the app is running as PWA
     */
    static isPWA() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true ||
               document.referrer.includes('android-app://');
    }
    
    /**
     * Check if the device is mobile
     */
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    
    /**
     * Check if the device supports touch
     */
    static isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
    
    /**
     * Get device type
     */
    static getDeviceType() {
        if (this.isMobile()) {
            return 'mobile';
        } else if (window.innerWidth < 1024) {
            return 'tablet';
        } else {
            return 'desktop';
        }
    }
    
    /**
     * Check if offline storage is available
     */
    static isOfflineStorageAvailable() {
        return 'indexedDB' in window && 'localStorage' in window;
    }
    
    /**
     * Get available storage quota
     */
    static async getStorageQuota() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            try {
                const estimate = await navigator.storage.estimate();
                return {
                    quota: estimate.quota,
                    usage: estimate.usage,
                    available: estimate.quota - estimate.usage,
                    percentage: (estimate.usage / estimate.quota) * 100
                };
            } catch (error) {
                console.error('Failed to get storage quota:', error);
                return null;
            }
        }
        return null;
    }
    
    /**
     * Request persistent storage
     */
    static async requestPersistentStorage() {
        if ('storage' in navigator && 'persist' in navigator.storage) {
            try {
                const persistent = await navigator.storage.persist();
                console.log('Persistent storage granted:', persistent);
                return persistent;
            } catch (error) {
                console.error('Failed to request persistent storage:', error);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Check if persistent storage is granted
     */
    static async isPersistentStorage() {
        if ('storage' in navigator && 'persisted' in navigator.storage) {
            try {
                const persisted = await navigator.storage.persisted();
                return persisted;
            } catch (error) {
                console.error('Failed to check persistent storage:', error);
                return false;
            }
        }
        return false;
    }
    
    /**
     * Get connection information
     */
    static getConnectionInfo() {
        if ('connection' in navigator) {
            const connection = navigator.connection;
            return {
                effectiveType: connection.effectiveType,
                downlink: connection.downlink,
                rtt: connection.rtt,
                saveData: connection.saveData,
                type: connection.type
            };
        }
        return null;
    }
    
    /**
     * Check if save data mode is enabled
     */
    static isSaveDataMode() {
        if ('connection' in navigator) {
            return navigator.connection.saveData;
        }
        return false;
    }
    
    /**
     * Check if connection is slow
     */
    static isSlowConnection() {
        const connectionInfo = this.getConnectionInfo();
        if (connectionInfo) {
            return connectionInfo.effectiveType === 'slow-2g' || 
                   connectionInfo.effectiveType === '2g' ||
                   connectionInfo.downlink < 1;
        }
        return false;
    }
    
    /**
     * Get battery information
     */
    static async getBatteryInfo() {
        if ('getBattery' in navigator) {
            try {
                const battery = await navigator.getBattery();
                return {
                    charging: battery.charging,
                    chargingTime: battery.chargingTime,
                    dischargingTime: battery.dischargingTime,
                    level: battery.level,
                    percentage: Math.round(battery.level * 100)
                };
            } catch (error) {
                console.error('Failed to get battery info:', error);
                return null;
            }
        }
        return null;
    }
    
    /**
     * Check if device is low on battery
     */
    static async isLowBattery(threshold = 20) {
        const batteryInfo = await this.getBatteryInfo();
        if (batteryInfo) {
            return batteryInfo.percentage <= threshold && !batteryInfo.charging;
        }
        return false;
    }
    
    /**
     * Get device capabilities
     */
    static getDeviceCapabilities() {
        return {
            isPWA: this.isPWA(),
            isMobile: this.isMobile(),
            isTouch: this.isTouchDevice(),
            deviceType: this.getDeviceType(),
            hasOfflineStorage: this.isOfflineStorageAvailable(),
            connectionInfo: this.getConnectionInfo(),
            isSaveDataMode: this.isSaveDataMode(),
            isSlowConnection: this.isSlowConnection(),
            userAgent: navigator.userAgent,
            platform: navigator.platform,
            language: navigator.language,
            languages: navigator.languages
        };
    }
    
    /**
     * Optimize images based on device capabilities
     */
    static optimizeImageUrl(url, options = {}) {
        const capabilities = this.getDeviceCapabilities();
        const { width, height, quality = 80 } = options;
        
        // If slow connection or save data mode, use lower quality
        if (capabilities.isSlowConnection || capabilities.isSaveDataMode) {
            quality = Math.max(quality - 20, 40);
        }
        
        // If mobile, use smaller dimensions
        if (capabilities.isMobile && (width || height)) {
            const scale = 0.7;
            if (width) width *= scale;
            if (height) height *= scale;
        }
        
        // Add query parameters for optimization
        const params = new URLSearchParams();
        if (width) params.set('w', Math.round(width));
        if (height) params.set('h', Math.round(height));
        params.set('q', quality);
        params.set('f', 'webp'); // Prefer WebP format
        
        return `${url}?${params.toString()}`;
    }
    
    /**
     * Preload critical resources
     */
    static preloadResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.href = resource.url;
            link.as = resource.type || 'fetch';
            
            if (resource.crossorigin) {
                link.crossOrigin = resource.crossorigin;
            }
            
            if (resource.media) {
                link.media = resource.media;
            }
            
            document.head.appendChild(link);
        });
    }
    
    /**
     * Lazy load images
     */
    static lazyLoadImages() {
        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        const src = img.dataset.src;
                        
                        if (src) {
                            img.src = this.optimizeImageUrl(src, {
                                width: img.dataset.width,
                                height: img.dataset.height,
                                quality: img.dataset.quality
                            });
                            img.classList.remove('lazy');
                            observer.unobserve(img);
                        }
                    }
                });
            });
            
            // Observe all lazy images
            document.querySelectorAll('img[data-src]').forEach(img => {
                imageObserver.observe(img);
            });
        } else {
            // Fallback for browsers without IntersectionObserver
            document.querySelectorAll('img[data-src]').forEach(img => {
                const src = img.dataset.src;
                if (src) {
                    img.src = this.optimizeImageUrl(src, {
                        width: img.dataset.width,
                        height: img.dataset.height,
                        quality: img.dataset.quality
                    });
                    img.classList.remove('lazy');
                }
            });
        }
    }
    
    /**
     * Show install prompt
     */
    static showInstallPrompt() {
        if (window.pwaManager && window.pwaManager.installButton) {
            // Show install button if available
            return;
        }
        
        // Create custom install prompt
        const prompt = document.createElement('div');
        prompt.className = 'pwa-install-prompt';
        prompt.innerHTML = `
            <div class="pwa-install-prompt-content">
                <div class="pwa-install-prompt-icon">📱</div>
                <div class="pwa-install-prompt-text">
                    <h3>Cài đặt Java Quiz</h3>
                    <p>Để có trải nghiệm tốt hơn, hãy cài đặt ứng dụng trên thiết bị của bạn.</p>
                </div>
                <div class="pwa-install-prompt-actions">
                    <button class="pwa-install-btn" onclick="pwaUtils.installApp()">
                        Cài đặt
                    </button>
                    <button class="pwa-cancel-btn" onclick="pwaUtils.hideInstallPrompt()">
                        Không, cảm ơn
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        prompt.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
            animation: fadeIn 0.3s ease-out;
        `;
        
        document.body.appendChild(prompt);
        
        // Store reference
        this.installPrompt = prompt;
    }
    
    /**
     * Hide install prompt
     */
    static hideInstallPrompt() {
        if (this.installPrompt) {
            this.installPrompt.style.animation = 'fadeOut 0.3s ease-in';
            setTimeout(() => {
                this.installPrompt.remove();
                this.installPrompt = null;
            }, 300);
        }
    }
    
    /**
     * Install app
     */
    static installApp() {
        if (window.pwaManager) {
            window.pwaManager.installApp();
        }
        this.hideInstallPrompt();
    }
    
    /**
     * Share content
     */
    static async shareContent(data) {
        if (navigator.share) {
            try {
                await navigator.share(data);
                return true;
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error('Share failed:', error);
                }
                return false;
            }
        } else {
            // Fallback to clipboard
            return this.fallbackShare(data);
        }
    }
    
    /**
     * Fallback share method
     */
    static async fallbackShare(data) {
        try {
            const text = `${data.title}\n${data.text}\n${data.url || ''}`;
            await navigator.clipboard.writeText(text);
            
            // Show notification
            if (window.pwaManager) {
                window.pwaManager.showNotification('Đã sao chép vào clipboard', 'success');
            }
            
            return true;
        } catch (error) {
            console.error('Fallback share failed:', error);
            return false;
        }
    }
    
    /**
     * Add to home screen
     */
    static showAddToHomeScreen() {
        if (this.isMobile() && !this.isPWA()) {
            const prompt = document.createElement('div');
            prompt.className = 'pwa-add-to-home-prompt';
            prompt.innerHTML = `
                <div class="pwa-add-to-home-content">
                    <div class="pwa-add-to-home-icon">📱</div>
                    <div class="pwa-add-to-home-text">
                        <h4>Thêm vào màn hình chính</h4>
                        <p>Nhấn vào menu trình duyệt và chọn "Thêm vào màn hình chính"</p>
                    </div>
                    <button class="pwa-close-btn" onclick="pwaUtils.hideAddToHomePrompt()">
                        ✕
                    </button>
                </div>
            `;
            
            // Add styles
            prompt.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 20px;
                right: 20px;
                background: white;
                border-radius: 12px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                z-index: 10000;
                animation: slideInUp 0.3s ease-out;
            `;
            
            document.body.appendChild(prompt);
            
            // Auto hide after 10 seconds
            setTimeout(() => {
                this.hideAddToHomePrompt();
            }, 10000);
            
            this.addToHomePrompt = prompt;
        }
    }
    
    /**
     * Hide add to home screen prompt
     */
    static hideAddToHomePrompt() {
        if (this.addToHomePrompt) {
            this.addToHomePrompt.style.animation = 'slideOutDown 0.3s ease-in';
            setTimeout(() => {
                this.addToHomePrompt.remove();
                this.addToHomePrompt = null;
            }, 300);
        }
    }
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    
    @keyframes fadeOut {
        from { opacity: 1; }
        to { opacity: 0; }
    }
    
    @keyframes slideInUp {
        from {
            transform: translateY(100%);
            opacity: 0;
        }
        to {
            transform: translateY(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutDown {
        from {
            transform: translateY(0);
            opacity: 1;
        }
        to {
            transform: translateY(100%);
            opacity: 0;
        }
    }
    
    .pwa-install-prompt-content {
        background: white;
        border-radius: 16px;
        padding: 24px;
        max-width: 400px;
        margin: 20px;
        text-align: center;
    }
    
    .pwa-install-prompt-icon {
        font-size: 48px;
        margin-bottom: 16px;
    }
    
    .pwa-install-prompt-text h3 {
        margin: 0 0 8px 0;
        color: #1f2937;
        font-size: 20px;
    }
    
    .pwa-install-prompt-text p {
        margin: 0 0 20px 0;
        color: #6b7280;
        line-height: 1.5;
    }
    
    .pwa-install-prompt-actions {
        display: flex;
        gap: 12px;
        justify-content: center;
    }
    
    .pwa-install-btn, .pwa-cancel-btn {
        padding: 12px 24px;
        border: none;
        border-radius: 8px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s ease;
    }
    
    .pwa-install-btn {
        background: #3b82f6;
        color: white;
    }
    
    .pwa-install-btn:hover {
        background: #2563eb;
    }
    
    .pwa-cancel-btn {
        background: #e5e7eb;
        color: #374151;
    }
    
    .pwa-cancel-btn:hover {
        background: #d1d5db;
    }
    
    .pwa-add-to-home-content {
        display: flex;
        align-items: center;
        padding: 16px;
        gap: 12px;
    }
    
    .pwa-add-to-home-icon {
        font-size: 24px;
        flex-shrink: 0;
    }
    
    .pwa-add-to-home-text {
        flex: 1;
    }
    
    .pwa-add-to-home-text h4 {
        margin: 0 0 4px 0;
        color: #1f2937;
        font-size: 16px;
    }
    
    .pwa-add-to-home-text p {
        margin: 0;
        color: #6b7280;
        font-size: 14px;
    }
    
    .pwa-close-btn {
        background: none;
        border: none;
        font-size: 18px;
        cursor: pointer;
        color: #6b7280;
        padding: 4px;
    }
    
    .lazy {
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    
    .lazy.loaded {
        opacity: 1;
    }
`;
document.head.appendChild(style);

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', () => {
    PWAUtils.lazyLoadImages();
});

// Export for global access
window.pwaUtils = PWAUtils;

export default PWAUtils;
