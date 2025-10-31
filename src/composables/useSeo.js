/**
 * useSeo Composable
 * 
 * Quản lý SEO metadata động cho từng page
 * Hỗ trợ: Title, Description, Keywords, Open Graph, Twitter Cards
 */

import { onMounted, onUnmounted, watch } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Default SEO config
 */
const DEFAULT_SEO = {
  site_name: 'Java Quiz Mastery',
  title: 'Java Quiz Mastery - Học Chứng Chỉ Java hiệu quả',
  description: 'Nền tảng học Chứng Chỉ Java với hơn 1000+ câu hỏi thực hành, theo dõi tiến độ chi tiết, và gamification để tăng động lực học tập.',
  keywords: 'java quiz, java bronze, java silver, java gold, học java, lập trình java, java certification, java exam, java practice, học lập trình',
  author: 'Java Quiz Mastery Team',
  site_url: import.meta.env.VITE_APP_URL || 'https://java-quiz-mastery.vercel.app',
  image: '/images/og-image.jpg',
  locale: 'vi_VN',
  type: 'website',
  twitter_card: 'summary_large_image',
  twitter_site: '@javaquizmastery',
}

/**
 * Get full URL
 */
function get_full_url(path = '') {
  const base_url = DEFAULT_SEO.site_url.replace(/\/$/, '')
  const clean_path = path.replace(/^\//, '')
  return `${base_url}/${clean_path}`
}

/**
 * Set meta tag
 */
function set_meta_tag(name, content, attribute = 'name') {
  if (!content) return
  
  let element = document.querySelector(`meta[${attribute}="${name}"]`)
  
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, name)
    document.head.appendChild(element)
  }
  
  element.setAttribute('content', content)
}

/**
 * Set link tag
 */
function set_link_tag(rel, href) {
  if (!href) return
  
  let element = document.querySelector(`link[rel="${rel}"]`)
  
  if (!element) {
    element = document.createElement('link')
    element.setAttribute('rel', rel)
    document.head.appendChild(element)
  }
  
  element.setAttribute('href', href)
}

/**
 * Set title
 */
function set_title(title) {
  document.title = title
  set_meta_tag('og:title', title, 'property')
  set_meta_tag('twitter:title', title)
}

/**
 * Set description
 */
function set_description(description) {
  set_meta_tag('description', description)
  set_meta_tag('og:description', description, 'property')
  set_meta_tag('twitter:description', description)
}

/**
 * Set keywords
 */
function set_keywords(keywords) {
  if (Array.isArray(keywords)) {
    keywords = keywords.join(', ')
  }
  set_meta_tag('keywords', keywords)
}

/**
 * Set robots meta tag
 */
function set_robots(robots) {
  if (robots) {
    set_meta_tag('robots', robots)
  }
}

/**
 * Set Open Graph tags
 */
function set_open_graph(options) {
  const {
    title,
    description,
    image,
    url,
    type = 'website',
    site_name,
    locale = 'vi_VN',
  } = options
  
  if (title) set_meta_tag('og:title', title, 'property')
  if (description) set_meta_tag('og:description', description, 'property')
  if (image) {
    const full_image_url = image.startsWith('http') ? image : get_full_url(image)
    set_meta_tag('og:image', full_image_url, 'property')
    set_meta_tag('og:image:width', '1200', 'property')
    set_meta_tag('og:image:height', '630', 'property')
  }
  if (url) set_meta_tag('og:url', get_full_url(url), 'property')
  if (type) set_meta_tag('og:type', type, 'property')
  if (site_name) set_meta_tag('og:site_name', site_name, 'property')
  if (locale) set_meta_tag('og:locale', locale, 'property')
}

/**
 * Set Twitter Card tags
 */
function set_twitter_card(options) {
  const {
    card = 'summary_large_image',
    title,
    description,
    image,
    site,
    creator,
  } = options
  
  set_meta_tag('twitter:card', card)
  if (title) set_meta_tag('twitter:title', title)
  if (description) set_meta_tag('twitter:description', description)
  if (image) {
    const full_image_url = image.startsWith('http') ? image : get_full_url(image)
    set_meta_tag('twitter:image', full_image_url)
  }
  if (site) set_meta_tag('twitter:site', site)
  if (creator) set_meta_tag('twitter:creator', creator)
}

/**
 * Set canonical URL
 */
function set_canonical(url) {
  set_link_tag('canonical', get_full_url(url))
}

/**
 * Set structured data (JSON-LD)
 */
function set_structured_data(data) {
  // Remove existing JSON-LD
  const existing = document.querySelector('script[type="application/ld+json"]')
  if (existing) {
    existing.remove()
  }
  
  // Add new JSON-LD
  const script = document.createElement('script')
  script.type = 'application/ld+json'
  script.text = JSON.stringify(data)
  document.head.appendChild(script)
}

/**
 * Main composable
 */
export function useSeo(options = {}) {
  const route = useRoute()
  
  /**
   * Update SEO
   */
  const update_seo = (custom_options = {}) => {
    const seo_options = {
      ...DEFAULT_SEO,
      ...options,
      ...custom_options,
    }
    
    // Title
    const full_title = seo_options.title === DEFAULT_SEO.title
      ? seo_options.title
      : `${seo_options.title} | ${DEFAULT_SEO.site_name}`
    
    set_title(full_title)
    
    // Description
    set_description(seo_options.description)
    
    // Keywords
    if (seo_options.keywords) {
      set_keywords(seo_options.keywords)
    }
    
    // Author
    if (seo_options.author) {
      set_meta_tag('author', seo_options.author)
    }
    
    // Robots (noindex, nofollow for authenticated pages)
    if (seo_options.robots) {
      set_robots(seo_options.robots)
    }
    
    // Canonical URL
    const canonical_url = seo_options.canonical || route.path
    set_canonical(canonical_url)
    
    // Open Graph
    set_open_graph({
      title: full_title,
      description: seo_options.description,
      image: seo_options.image,
      url: canonical_url,
      type: seo_options.type,
      site_name: seo_options.site_name,
      locale: seo_options.locale,
    })
    
    // Twitter Card
    set_twitter_card({
      card: seo_options.twitter_card,
      title: full_title,
      description: seo_options.description,
      image: seo_options.image,
      site: seo_options.twitter_site,
      creator: seo_options.twitter_creator,
    })
    
    // Structured Data
    if (seo_options.structured_data) {
      set_structured_data(seo_options.structured_data)
    }
  }
  
  // Update SEO on mount
  onMounted(() => {
    update_seo()
  })
  
  // Watch route changes
  watch(
    () => route.path,
    () => {
      update_seo()
    }
  )
  
  return {
    update_seo,
    set_title,
    set_description,
    set_keywords,
    set_robots,
    set_canonical,
    set_structured_data,
  }
}

/**
 * Predefined SEO configs cho các pages
 */
export const SEO_CONFIGS = {
  home: {
    title: 'Java Quiz Mastery - Học Chứng Chỉ Java hiệu quả',
    description: 'Nền tảng học Chứng Chỉ Java với hơn 1000+ câu hỏi thực hành, theo dõi tiến độ chi tiết, và gamification để tăng động lực học tập.',
    keywords: ['java quiz', 'java bronze', 'java silver', 'java gold', 'học java', 'lập trình java', 'java certification'],
    structured_data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Java Quiz Mastery',
      'url': DEFAULT_SEO.site_url,
      'description': 'Nền tảng học Chứng Chỉ Java với hơn 1000+ câu hỏi thực hành',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${DEFAULT_SEO.site_url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  
  signin: {
    title: 'Đăng nhập',
    description: 'Đăng nhập vào Java Quiz Mastery để tiếp tục hành trình học Chứng Chỉ Java của bạn.',
    keywords: ['đăng nhập', 'login', 'java quiz'],
  },
  
  signup: {
    title: 'Đăng ký',
    description: 'Đăng ký miễn phí để bắt đầu học Chứng Chỉ Java với hơn 1000+ câu hỏi thực hành.',
    keywords: ['đăng ký', 'register', 'signup', 'java quiz'],
  },
  
  dashboard: {
    title: 'Dashboard',
    description: 'Theo dõi tiến độ học tập, thành tích và thống kê của bạn trên Java Quiz Mastery.',
    keywords: ['dashboard', 'tiến độ học tập', 'java progress'],
  },
  
  documents: {
    title: 'Tài liệu học tập',
    description: 'Truy cập các tài liệu học tập Chứng Chỉ Java được tổ chức theo chủ đề và độ khó.',
    keywords: ['java documents', 'tài liệu java', 'java bronze documents', 'java silver documents', 'java gold documents'],
  },
  exams: {
    title: 'Đề thi thử',
    description: 'Truy cập các đề thi thử Chứng Chỉ Java được tổng hợp theo lộ trình học.',
    keywords: ['java certification exams', 'đề thi java', 'java bronze exams', 'java silver exams', 'java gold exams'],
  },
  
  leaderboard: {
    title: 'Bảng xếp hạng',
    description: 'Xem bảng xếp hạng người học xuất sắc nhất trên Java Quiz Mastery.',
    keywords: ['leaderboard', 'bảng xếp hạng', 'top learners'],
  },
  
  achievements: {
    title: 'Thành tích',
    description: 'Khám phá và mở khóa các thành tích trong quá trình học Chứng Chỉ Java.',
    keywords: ['achievements', 'thành tích', 'badges', 'java achievements'],
  },
  
  profile: {
    title: 'Hồ sơ cá nhân',
    description: 'Quản lý thông tin cá nhân và cài đặt tài khoản của bạn.',
    keywords: ['profile', 'hồ sơ', 'account settings'],
  },
}

