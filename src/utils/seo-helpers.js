/**
 * SEO Helper Functions
 * 
 * Các functions tiện ích hỗ trợ SEO
 */

/**
 * Truncate text cho meta description
 * 
 * @param {string} text - Text cần truncate
 * @param {number} max_length - Độ dài tối đa (default: 160)
 * @returns {string}
 */
export function truncate_description(text, max_length = 160) {
  if (!text) return ''
  
  if (text.length <= max_length) {
    return text
  }
  
  // Cắt ở từ cuối cùng để không bị cắt giữa từ
  const truncated = text.substr(0, max_length)
  const last_space = truncated.lastIndexOf(' ')
  
  if (last_space > 0) {
    return truncated.substr(0, last_space) + '...'
  }
  
  return truncated + '...'
}

/**
 * Generate keywords từ text
 * 
 * @param {string} text - Text nguồn
 * @param {number} max_keywords - Số keywords tối đa (default: 10)
 * @returns {array}
 */
export function generate_keywords(text, max_keywords = 10) {
  if (!text) return []
  
  // Remove special characters và lowercase
  const clean_text = text.toLowerCase().replace(/[^\w\s]/g, ' ')
  
  // Split thành words
  const words = clean_text.split(/\s+/)
  
  // Filter stop words (Vietnamese + English)
  const stop_words = [
    'và', 'của', 'có', 'là', 'được', 'này', 'cho', 'từ', 'với',
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'this', 'that', 'these', 'those', 'is', 'are', 'was', 'were',
  ]
  
  const filtered_words = words.filter(word => 
    word.length > 3 && !stop_words.includes(word)
  )
  
  // Count word frequency
  const word_count = {}
  filtered_words.forEach(word => {
    word_count[word] = (word_count[word] || 0) + 1
  })
  
  // Sort by frequency
  const sorted_words = Object.keys(word_count).sort((a, b) => 
    word_count[b] - word_count[a]
  )
  
  // Return top keywords
  return sorted_words.slice(0, max_keywords)
}

/**
 * Clean text cho SEO (remove HTML tags, special chars)
 * 
 * @param {string} html - HTML text
 * @returns {string}
 */
export function clean_text_for_seo(html) {
  if (!html) return ''
  
  // Remove HTML tags
  let text = html.replace(/<[^>]*>/g, ' ')
  
  // Remove extra whitespaces
  text = text.replace(/\s+/g, ' ').trim()
  
  // Remove special characters (giữ Vietnamese diacritics)
  text = text.replace(/[^\w\s\u00C0-\u1EF9]/g, ' ')
  
  return text
}

/**
 * Generate breadcrumb structured data
 * 
 * @param {array} items - Array of {name, url}
 * @returns {object} JSON-LD breadcrumb
 */
export function generate_breadcrumb_schema(items) {
  if (!items || items.length === 0) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    'itemListElement': items.map((item, index) => ({
      '@type': 'ListItem',
      'position': index + 1,
      'name': item.name,
      'item': item.url,
    })),
  }
}

/**
 * Generate FAQ structured data
 * 
 * @param {array} faqs - Array of {question, answer}
 * @returns {object} JSON-LD FAQ
 */
export function generate_faq_schema(faqs) {
  if (!faqs || faqs.length === 0) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'mainEntity': faqs.map(faq => ({
      '@type': 'Question',
      'name': faq.question,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': faq.answer,
      },
    })),
  }
}

/**
 * Generate Article structured data
 * 
 * @param {object} article - Article data
 * @returns {object} JSON-LD Article
 */
export function generate_article_schema(article) {
  if (!article) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    'headline': article.title,
    'description': article.description,
    'image': article.image,
    'author': {
      '@type': article.author_type || 'Person',
      'name': article.author_name,
    },
    'publisher': {
      '@type': 'Organization',
      'name': article.publisher_name || 'Java Quiz Mastery',
      'logo': {
        '@type': 'ImageObject',
        'url': article.publisher_logo || '/favicon.png',
      },
    },
    'datePublished': article.published_at,
    'dateModified': article.updated_at || article.published_at,
  }
}

/**
 * Generate Course structured data
 * 
 * @param {object} course - Course data
 * @returns {object} JSON-LD Course
 */
export function generate_course_schema(course) {
  if (!course) return null
  
  return {
    '@context': 'https://schema.org',
    '@type': 'Course',
    'name': course.name,
    'description': course.description,
    'provider': {
      '@type': 'Organization',
      'name': 'Java Quiz Mastery',
      'sameAs': 'https://java-quiz-mastery.vercel.app',
    },
    'educationalLevel': course.level || 'Beginner',
    'inLanguage': 'vi',
    'availableLanguage': 'vi',
  }
}

/**
 * Validate URL
 * 
 * @param {string} url
 * @returns {boolean}
 */
export function is_valid_url(url) {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Get full URL từ relative path
 * 
 * @param {string} path
 * @returns {string}
 */
export function get_full_url(path) {
  const base_url = import.meta.env.VITE_APP_URL || 'https://java-quiz-mastery.vercel.app'
  const clean_base = base_url.replace(/\/$/, '')
  const clean_path = path.replace(/^\//, '')
  
  return `${clean_base}/${clean_path}`
}

/**
 * Format date cho structured data (ISO 8601)
 * 
 * @param {string|Date} date
 * @returns {string}
 */
export function format_date_for_schema(date) {
  if (!date) return new Date().toISOString()
  
  if (date instanceof Date) {
    return date.toISOString()
  }
  
  return new Date(date).toISOString()
}

/**
 * Generate slug từ title
 * 
 * @param {string} title
 * @returns {string}
 */
export function generate_slug(title) {
  if (!title) return ''
  
  return title
    .toLowerCase()
    .replace(/[^\w\s\u00C0-\u1EF9]/g, '') // Keep Vietnamese chars
    .replace(/\s+/g, '-')
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
}

/**
 * Get image dimensions (async)
 * 
 * @param {string} image_url
 * @returns {Promise<{width: number, height: number}>}
 */
export async function get_image_dimensions(image_url) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    
    img.onload = () => {
      resolve({
        width: img.naturalWidth,
        height: img.naturalHeight,
      })
    }
    
    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }
    
    img.src = image_url
  })
}

/**
 * Check if image is optimal for OG (1200x630)
 * 
 * @param {number} width
 * @param {number} height
 * @returns {boolean}
 */
export function is_optimal_og_image(width, height) {
  return width === 1200 && height === 630
}

/**
 * Get reading time estimate
 * 
 * @param {string} text - Content text
 * @param {number} wpm - Words per minute (default: 200)
 * @returns {number} Minutes
 */
export function estimate_reading_time(text, wpm = 200) {
  if (!text) return 0
  
  const words = text.trim().split(/\s+/).length
  const minutes = Math.ceil(words / wpm)
  
  return minutes
}

