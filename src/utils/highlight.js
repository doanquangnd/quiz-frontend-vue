/**
 * Highlight.js Utility
 * Đảm bảo highlight.js được load và khởi tạo đúng cách
 */

let hljsLoaded = false;
let hljsPromise = null;

/**
 * Khởi tạo highlight.js nếu chưa được load
 * @returns {Promise<Object>} highlight.js instance
 */
export async function ensureHighlightJS() {
    if (hljsLoaded && window.hljs) {
        return window.hljs;
    }

    if (hljsPromise) {
        return hljsPromise;
    }

    hljsPromise = new Promise(async (resolve, reject) => {
        try {
            // Import highlight.js core
            const hljs = (await import('highlight.js')).default;
            await import('highlight.js/styles/github-dark.css');

            // Gán vào window object TRƯỚC khi import line-numbers
            window.hljs = hljs;
            hljsLoaded = true;
            
            // Import line-numbers SAU KHI hljs đã được set
            await import('highlightjs-line-numbers.js');
            
            resolve(hljs);
        } catch (error) {
            reject(error);
        }
    });

    return hljsPromise;
}

/**
 * Highlight tất cả code blocks trong một element
 * @param {Element|Document} container - Container element hoặc document
 */
export async function highlightCodeBlocks(container = document) {
    try {
        await ensureHighlightJS();
        
        const blocks = container.querySelectorAll('pre code');
        
        if (blocks.length === 0) {
            return;
        }
        
        blocks.forEach((block, index) => {
            // Kiểm tra xem block đã có line numbers chưa
            const hasLineNumbers = block.parentElement.querySelector('table.hljs-ln');
            
            if (!hasLineNumbers) {
                // Highlight code
                window.hljs.highlightElement(block);
                
                // Apply line numbers
                if (window.hljs.lineNumbersBlock) {
                    window.hljs.lineNumbersBlock(block);
                }
            }
        });
    } catch (error) {
        // Silent fail - không log error trong production
    }
}

/**
 * Wrapper cho highlightCodeBlocks với nextTick
 * @param {Element|Document} container - Container element hoặc document
 * @param {Function} nextTick - Vue nextTick function
 */
export async function highlightCodeBlocksWithNextTick(container, nextTick) {
    try {
        await nextTick();
        await highlightCodeBlocks(container);
    } catch (error) {
        // Silent fail
    }
}

/**
 * Debounced version của highlightCodeBlocksWithNextTick
 * @param {Element|Document} container - Container element hoặc document
 * @param {Function} nextTick - Vue nextTick function
 * @param {number} delay - Delay in milliseconds
 */
let debounceTimeoutId = null;

export function debouncedHighlightCodeBlocks(container, nextTick, delay = 150) {
    clearTimeout(debounceTimeoutId);
    debounceTimeoutId = setTimeout(() => {
        highlightCodeBlocksWithNextTick(container, nextTick);
    }, delay);
}

/**
 * Fix image URL để đảm bảo ảnh từ Laravel backend hiển thị đúng
 * @param {string} imageUrl - Image URL (có thể là relative hoặc absolute)
 * @returns {string} Fixed image URL
 */
export function fixImageUrl(imageUrl) {
    if (!imageUrl) return imageUrl;
    
    // Nếu đã là absolute URL (http/https), giữ nguyên
    if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
        return imageUrl;
    }
    
    // Lấy backend URL từ environment variable
    // Development: có thể là java-quiz.test hoặc localhost:8000
    // Production: từ VITE_API_BASE_URL
    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://java-quiz.test';
    const backendUrl = apiBaseUrl.replace(/\/$/, '');
    const isDev = import.meta.env.DEV;
    
    // Nếu là relative path bắt đầu với / (uploads, admin/secure-uploads, etc.)
    if (imageUrl.startsWith('/')) {
        // QUAN TRỌNG: Trong development, browser render <img src="/uploads/..."> 
        // sẽ tìm tại frontend server (localhost:5174), không qua Vite proxy
        // Vì vậy cần convert thành absolute URL trỏ tới backend
        // Trong production cũng cần absolute URL
        return `${backendUrl}${imageUrl}`;
    }
    
    // Nếu là relative path không có /, thêm /uploads/
    return `${backendUrl}/uploads/${imageUrl}`;
}

/**
 * Process HTML content để đảm bảo code blocks được format đúng và fix image URLs
 * @param {string} content - HTML content
 * @returns {string} Processed content
 */
export function processContentForHighlight(content) {
    if (!content) return content;
    
    let processed = content;
    
    // Fix image URLs trong HTML content
    // Tìm tất cả <img> tags với src và fix URL
    // Handle cả double quotes và single quotes
    processed = processed.replace(
        /<img\s+([^>]*?)(?:src\s*=\s*"([^"]+)")/gi,
        (match, before, src) => {
            const fixedSrc = fixImageUrl(src);
            return `<img ${before}src="${fixedSrc}"`;
        }
    );
    
    // Handle single quotes
    processed = processed.replace(
        /<img\s+([^>]*?)(?:src\s*=\s*'([^']+)')/gi,
        (match, before, src) => {
            const fixedSrc = fixImageUrl(src);
            return `<img ${before}src='${fixedSrc}'`;
        }
    );
    
    // Handle unquoted src (ít phổ biến)
    processed = processed.replace(
        /<img\s+([^>]*?)(?:src\s*=\s*([^\s"'>]+))([^>]*?)>/gi,
        (match, before, src, after) => {
            // Chỉ fix nếu chưa được fix ở trên (không có quotes)
            if (!match.includes('src="') && !match.includes("src='")) {
                const fixedSrc = fixImageUrl(src);
                return `<img ${before}src="${fixedSrc}"${after}>`;
            }
            return match;
        }
    );
    
    // Regex để tìm tất cả <pre><code> blocks
    const codeBlockRegex = /<pre><code[^>]*>([\s\S]*?)<\/code><\/pre>/gi;
    
    return processed.replace(codeBlockRegex, (match, codeContent) => {
        // Tạo temporary element để decode HTML entities
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = codeContent;
        const decodedContent = tempDiv.textContent || tempDiv.innerText || '';
        
        // Normalize line endings
        const normalizedContent = decodedContent
            .replace(/\r\n/g, '\n')
            .replace(/\r/g, '\n');
        
        return match.replace(codeContent, normalizedContent);
    });
}