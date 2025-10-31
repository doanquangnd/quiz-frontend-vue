/**
 * English SEO Configs
 * 
 * SEO configurations for English language
 */

/**
 * Default SEO config (English)
 */
export const DEFAULT_SEO_EN = {
  site_name: 'Java Quiz Mastery',
  title: 'Java Quiz Mastery - Master Java Certification Efficiently',
  description: 'Java Certification learning platform with 1000+ practice questions, detailed progress tracking, and gamification to boost your learning motivation.',
  keywords: 'java quiz, java bronze, java silver, java gold, learn java, java programming, java certification, java exam, java practice, java training, oracle certification',
  author: 'Java Quiz Mastery Team',
  site_url: import.meta.env.VITE_APP_URL || 'https://java-quiz-mastery.vercel.app',
  image: '/images/og-image.jpg',
  locale: 'en_US',
  type: 'website',
  twitter_card: 'summary_large_image',
  twitter_site: '@javaquizmastery',
}

/**
 * Predefined SEO configs (English)
 */
export const SEO_CONFIGS_EN = {
  home: {
    title: 'Java Quiz Mastery - Master Java Certification Efficiently',
    description: 'Java Certification learning platform with 1000+ practice questions, detailed progress tracking, and gamification to boost your learning motivation.',
    keywords: ['java quiz', 'java bronze', 'java silver', 'java gold', 'learn java', 'java programming', 'java certification', 'java training', 'oracle java'],
    locale: 'en_US',
    structured_data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Java Quiz Mastery',
      'url': DEFAULT_SEO_EN.site_url,
      'description': 'Java Certification learning platform with 1000+ practice questions',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${DEFAULT_SEO_EN.site_url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  
  signin: {
    title: 'Sign In',
    description: 'Sign in to Java Quiz Mastery to continue your Java Certification learning journey.',
    keywords: ['sign in', 'login', 'java quiz', 'account access'],
    locale: 'en_US',
  },
  
  signup: {
    title: 'Sign Up',
    description: 'Sign up for free to start learning Java Certification with 1000+ practice questions.',
    keywords: ['sign up', 'register', 'create account', 'java quiz', 'free registration'],
    locale: 'en_US',
  },
  
  dashboard: {
    title: 'Dashboard',
    description: 'Track your learning progress, achievements, and statistics on Java Quiz Mastery.',
    keywords: ['dashboard', 'learning progress', 'java progress', 'statistics', 'performance tracking'],
    locale: 'en_US',
  },
  
  documents: {
    title: 'Learning Documents',
    description: 'Access Java Certification learning documents organized by topics and difficulty levels.',
    keywords: ['java documents', 'java learning materials', 'java bronze docs', 'java silver docs', 'java gold docs', 'study materials'],
    locale: 'en_US',
  },
  
  leaderboard: {
    title: 'Leaderboard',
    description: 'View the top learners ranking on Java Quiz Mastery platform.',
    keywords: ['leaderboard', 'ranking', 'top learners', 'java competition', 'best students'],
    locale: 'en_US',
  },
  
  achievements: {
    title: 'Achievements',
    description: 'Discover and unlock achievements throughout your Java Certification learning journey.',
    keywords: ['achievements', 'badges', 'rewards', 'java achievements', 'milestones'],
    locale: 'en_US',
  },
  
  profile: {
    title: 'Profile',
    description: 'Manage your personal information and account settings.',
    keywords: ['profile', 'account', 'settings', 'user profile', 'personal info'],
    locale: 'en_US',
  },
}

