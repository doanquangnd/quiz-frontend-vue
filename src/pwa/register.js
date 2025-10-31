// PWA Registration and Management
class PWAManager {
    constructor() {
        this.registration = null;
        this.isOnline = navigator.onLine;
        this.updateAvailable = false;
        
        this.init();
    }
    
    async init() {
        // Check if service worker is supported
        if ('serviceWorker' in navigator) {
            await this.registerServiceWorker();
            this.setupEventListeners();
            this.checkForUpdates();
        } else {
            console.warn('Service Worker not supported');
        }
        
        // Setup online/offline detection
        this.setupNetworkDetection();
        
        // Setup install prompt
        this.setupInstallPrompt();
    }
    
    async registerServiceWorker() {
        try {
            this.registration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });
            
            console.log('Service Worker registered successfully:', this.registration);
            
            // Handle updates
            this.registration.addEventListener('updatefound', () => {
                const newWorker = this.registration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        // New service worker is available
                        this.updateAvailable = true;
                        this.showUpdateNotification();
                    }
                });
            });
            
            // Handle controller change
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                console.log('Service Worker controller changed');
                window.location.reload();
            });
            
        } catch (error) {
            console.error('Service Worker registration failed:', error);
        }
    }
    
    setupEventListeners() {
        // Listen for messages from service worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            console.log('Message from Service Worker:', event.data);
            
            if (event.data.type === 'UPDATE_AVAILABLE') {
                this.updateAvailable = true;
                this.showUpdateNotification();
            }
        });
    }
    
    setupNetworkDetection() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showOnlineNotification();
            this.syncPendingData();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showOfflineNotification();
        });
    }
    
    setupInstallPrompt() {
        let deferredPrompt;
        
        window.addEventListener('beforeinstallprompt', (event) => {
            // Prevent the mini-infobar from appearing on mobile
            event.preventDefault();
            
            // Stash the event so it can be triggered later
            deferredPrompt = event;
            
            // Show install button
            this.showInstallButton(deferredPrompt);
        });
        
        // Track app installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.hideInstallButton();
            this.trackInstallation();
        });
    }
    
    showUpdateNotification() {
        // Create update notification
        const notification = document.createElement('div');
        notification.className = 'pwa-update-notification';
        notification.innerHTML = `
            <div class="pwa-notification-content">
                <div class="pwa-notification-icon">🔄</div>
                <div class="pwa-notification-text">
                    <h4>Cập nhật có sẵn</h4>
                    <p>Phiên bản mới của ứng dụng đã sẵn sàng.</p>
                </div>
                <div class="pwa-notification-actions">
                    <button class="pwa-btn pwa-btn-primary" onclick="pwaManager.updateApp()">
                        Cập nhật ngay
                    </button>
                    <button class="pwa-btn pwa-btn-secondary" onclick="pwaManager.hideUpdateNotification()">
                        Sau
                    </button>
                </div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: white;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto hide after 10 seconds
        setTimeout(() => {
            this.hideUpdateNotification();
        }, 10000);
    }
    
    hideUpdateNotification() {
        const notification = document.querySelector('.pwa-update-notification');
        if (notification) {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }
    }
    
    updateApp() {
        if (this.registration && this.registration.waiting) {
            // Send message to service worker to skip waiting
            this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }
        this.hideUpdateNotification();
    }
    
    showInstallButton(deferredPrompt) {
        // Create install button
        const installButton = document.createElement('button');
        installButton.className = 'pwa-install-button';
        installButton.innerHTML = `
            <div class="pwa-install-content">
                <div class="pwa-install-icon">📱</div>
                <div class="pwa-install-text">
                    <span>Cài đặt ứng dụng</span>
                    <small>Để sử dụng nhanh hơn</small>
                </div>
                <div class="pwa-install-arrow">→</div>
            </div>
        `;
        
        // Add styles
        installButton.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 25px;
            padding: 12px 24px;
            cursor: pointer;
            box-shadow: 0 4px 20px rgba(102, 126, 234, 0.4);
            z-index: 10000;
            transition: all 0.3s ease;
            font-family: inherit;
        `;
        
        installButton.addEventListener('click', () => {
            this.installApp(deferredPrompt);
        });
        
        document.body.appendChild(installButton);
        
        // Store reference for later removal
        this.installButton = installButton;
    }
    
    hideInstallButton() {
        if (this.installButton) {
            this.installButton.remove();
            this.installButton = null;
        }
    }
    
    async installApp(deferredPrompt) {
        if (deferredPrompt) {
            // Show the install prompt
            deferredPrompt.prompt();
            
            // Wait for the user to respond to the prompt
            const { outcome } = await deferredPrompt.userChoice;
            
            if (outcome === 'accepted') {
                console.log('User accepted the install prompt');
            } else {
                console.log('User dismissed the install prompt');
            }
            
            // Clear the deferredPrompt
            deferredPrompt = null;
        }
    }
    
    showOnlineNotification() {
        this.showNotification('Kết nối mạng đã được khôi phục', 'success');
    }
    
    showOfflineNotification() {
        this.showNotification('Không có kết nối mạng. Một số tính năng có thể không khả dụng.', 'warning');
    }
    
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `pwa-notification pwa-notification-${type}`;
        notification.innerHTML = `
            <div class="pwa-notification-content">
                <div class="pwa-notification-icon">
                    ${type === 'success' ? '✅' : type === 'warning' ? '⚠️' : 'ℹ️'}
                </div>
                <div class="pwa-notification-text">${message}</div>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'warning' ? '#f59e0b' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            padding: 12px 16px;
            z-index: 10000;
            max-width: 300px;
            animation: slideInRight 0.3s ease-out;
        `;
        
        document.body.appendChild(notification);
        
        // Auto hide after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }
    
    async syncPendingData() {
        if (this.isOnline && this.registration) {
            try {
                // Send message to service worker to sync data
                if (navigator.serviceWorker.controller) {
                    navigator.serviceWorker.controller.postMessage({
                        type: 'SYNC_PENDING_DATA'
                    });
                }
            } catch (error) {
                console.error('Failed to sync pending data:', error);
            }
        }
    }
    
    async checkForUpdates() {
        if (this.registration) {
            try {
                await this.registration.update();
            } catch (error) {
                console.error('Failed to check for updates:', error);
            }
        }
    }
    
    trackInstallation() {
        // Track PWA installation
        if (window.gtag) {
            window.gtag('event', 'pwa_install', {
                event_category: 'PWA',
                event_label: 'App Installation'
            });
        }
        
        // Send to analytics
        this.sendAnalytics('pwa_install', {
            timestamp: Date.now(),
            userAgent: navigator.userAgent,
            platform: navigator.platform
        });
    }
    
    sendAnalytics(event, data) {
        // Send analytics data
        fetch('/api/analytics/pwa', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.content || ''
            },
            body: JSON.stringify({
                event,
                data,
                timestamp: Date.now()
            })
        }).catch(error => {
            console.error('Failed to send analytics:', error);
        });
    }
    
    // Public methods
    getRegistration() {
        return this.registration;
    }
    
    isUpdateAvailable() {
        return this.updateAvailable;
    }
    
    getOnlineStatus() {
        return this.isOnline;
    }
    
    async getServiceWorkerVersion() {
        if (navigator.serviceWorker.controller) {
            return new Promise((resolve) => {
                const messageChannel = new MessageChannel();
                messageChannel.port1.onmessage = (event) => {
                    resolve(event.data.version);
                };
                navigator.serviceWorker.controller.postMessage(
                    { type: 'GET_VERSION' },
                    [messageChannel.port2]
                );
            });
        }
        return null;
    }
}

// CSS animations for notifications
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .pwa-install-button:hover {
        transform: translateX(-50%) translateY(-2px);
        box-shadow: 0 6px 25px rgba(102, 126, 234, 0.5);
    }
    
    .pwa-install-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .pwa-install-icon {
        font-size: 20px;
    }
    
    .pwa-install-text {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
    }
    
    .pwa-install-text span {
        font-weight: 600;
        font-size: 14px;
    }
    
    .pwa-install-text small {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .pwa-install-arrow {
        font-size: 16px;
        opacity: 0.7;
    }
    
    .pwa-notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }
    
    .pwa-notification-icon {
        font-size: 20px;
        flex-shrink: 0;
    }
    
    .pwa-notification-text {
        flex: 1;
    }
    
    .pwa-notification-text h4 {
        margin: 0 0 4px 0;
        font-size: 16px;
        font-weight: 600;
    }
    
    .pwa-notification-text p {
        margin: 0;
        font-size: 14px;
        opacity: 0.9;
    }
    
    .pwa-notification-actions {
        display: flex;
        gap: 8px;
        margin-top: 12px;
    }
    
    .pwa-btn {
        padding: 8px 16px;
        border: none;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s ease;
    }
    
    .pwa-btn-primary {
        background: #3b82f6;
        color: white;
    }
    
    .pwa-btn-primary:hover {
        background: #2563eb;
    }
    
    .pwa-btn-secondary {
        background: #e5e7eb;
        color: #374151;
    }
    
    .pwa-btn-secondary:hover {
        background: #d1d5db;
    }
`;
document.head.appendChild(style);

// Initialize PWA Manager
const pwaManager = new PWAManager();

// Export for global access
window.pwaManager = pwaManager;

export default pwaManager;
