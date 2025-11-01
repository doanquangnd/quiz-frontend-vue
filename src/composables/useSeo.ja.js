/**
 * Japanese SEO Configs
 * 
 * SEO configurations for Japanese language (日本語)
 */

/**
 * Default SEO config (Japanese)
 */
export const DEFAULT_SEO_JA = {
  site_name: 'Java Quiz Mastery',
  title: 'Java Quiz Mastery - 効率的にJava認定資格を習得',
  description: 'Java認定資格学習プラットフォーム。1000以上の練習問題、詳細な進捗管理、ゲーミフィケーションで学習モチベーションを向上させます。',
  keywords: 'java クイズ, java bronze, java silver, java gold, java 学習, javaプログラミング, java認定資格, java試験, java練習問題',
  author: 'Java Quiz Mastery Team',
  site_url: import.meta.env.VITE_APP_URL || 'https://java-quiz-mastery.vercel.app',
  image: '/images/og-image.jpg',
  locale: 'ja_JP',
  type: 'website',
  twitter_card: 'summary_large_image',
  twitter_site: '@javaquizmastery',
}

/**
 * Predefined SEO configs (Japanese)
 */
export const SEO_CONFIGS_JA = {
  home: {
    title: 'Java Quiz Mastery - 効率的にJava認定資格を習得',
    description: 'Java認定資格学習プラットフォーム。1000以上の練習問題、詳細な進捗管理、ゲーミフィケーションで学習モチベーションを向上させます。',
    keywords: ['java クイズ', 'java bronze', 'java silver', 'java gold', 'java 学習', 'javaプログラミング', 'java認定資格'],
    locale: 'ja_JP',
    structured_data: {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      'name': 'Java Quiz Mastery',
      'url': DEFAULT_SEO_JA.site_url,
      'description': 'Java認定資格学習プラットフォーム。1000以上の練習問題',
      'inLanguage': 'ja',
      'potentialAction': {
        '@type': 'SearchAction',
        'target': `${DEFAULT_SEO_JA.site_url}/search?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  },
  
  signin: {
    title: 'サインイン',
    description: 'Java Quiz Masteryにサインインして、Java認定資格学習を続けましょう。',
    keywords: ['サインイン', 'ログイン', 'java クイズ'],
    locale: 'ja_JP',
  },
  
  signup: {
    title: 'サインアップ',
    description: '無料登録してJava認定資格の学習を始めましょう。1000以上の練習問題をご用意しています。',
    keywords: ['サインアップ', '登録', 'アカウント作成', 'java クイズ'],
    locale: 'ja_JP',
  },
  
  dashboard: {
    title: 'ダッシュボード',
    description: 'Java Quiz Masteryで学習の進捗、達成状況、統計を確認しましょう。',
    keywords: ['ダッシュボード', '学習進捗', 'java 進捗', '統計'],
    locale: 'ja_JP',
  },
  
  documents: {
    title: '学習資料',
    description: 'トピックと難易度別に整理されたJava認定資格の学習資料にアクセスできます。',
    keywords: ['java 資料', 'java 学習教材', 'java bronze 資料', 'java silver 資料', 'java gold 資料'],
    locale: 'ja_JP',
  },
  
  leaderboard: {
    title: 'リーダーボード',
    description: 'Java Quiz Masteryプラットフォームのトップ学習者ランキングを表示します。',
    keywords: ['リーダーボード', 'ランキング', 'トップ学習者', 'java コンペティション'],
    locale: 'ja_JP',
  },
  
  achievements: {
    title: '実績',
    description: 'Java認定資格学習の過程で実績を発見し、ロック解除しましょう。',
    keywords: ['実績', 'バッジ', '報酬', 'java 実績'],
    locale: 'ja_JP',
  },
  
  profile: {
    title: 'プロフィール',
    description: '個人情報とアカウント設定を管理します。',
    keywords: ['プロフィール', 'アカウント', '設定', 'ユーザープロフィール'],
    locale: 'ja_JP',
  },
}

