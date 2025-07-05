/** public/data/user.json */
export interface User {
  name:      string
  bio:       string | null
  location:  string | null
  avatar:    string
  blog:      string | null
  twitter:   string | null
  followers: number
}

/** public/data/achievements.json */
export interface Achievement {
  title: string
  link:  string
}

/** public/data/repos.json */
export interface Repo {
  full_name:   string
  description: string | null
  stars:       number
  lang:        string | null
  html:        string  // README（HTML 文字列）
}

/** public/data/services.json */
export interface Service {
  title: string
  stack: string[]   // 例: ["Flutter", "Swift"]
  blurb: string
}

/** public/data/testimonials.json */
export interface Testimonial {
  author: string
  quote:  string
}

/** public/data/timeline.json */
export interface TimelineEntry {
  date: string   // ISO8601 文字列 (e.g. "2025-04")
  text: string
}

export interface MetricsLanguage {
  lang:  string          // 言語名
  count: number          // リポジトリ件数
  stars: number          // その言語の合計 Star
}

/** public/data/metrics.json */
export interface Metrics {
  total_repos:   number
  private_repos: number
  public_repos:  number
  total_stars:   number
  languages:     MetricsLanguage[]
}
