/* ---------------- user.json ----------------- */
export interface User {
  name:      string
  bio:       string | null
  location:  string | null
  avatar:    string
  blog:      string | null
  twitter:   string | null
  followers: number
}

/* ---------------- achievements.json --------- */
export interface Achievement {
  title: string
  link:  string
}

/* ---------------- repos.json ---------------- */
export interface Repo {
  full_name:   string
  description: string | null
  stars:       number
  lang:        string | null
  html:        string
}

/* ---------------- services.json ------------- */
export interface Service {
  title: string
  stack: string[]
  blurb: string
}

/* ---------------- testimonials.json --------- */
export interface Testimonial {
  author: string
  quote:  string
}

/* ---------------- timeline.json ------------- */
export interface TimelineEntry {
  date: string   // "2025-04" など
  text: string
}

/* ---------------- metrics.json -------------- */
export interface MetricsLanguage {
  lang:  string
  count: number
  stars: number
}
export interface Metrics {
  total_repos:   number
  private_repos: number
  public_repos:  number
  total_stars:   number
  languages:     MetricsLanguage[]
}

/* ---------------- coding.json --------------- */
export interface CodingLang {
  lang:    string
  seconds: number
}
export interface CodingStats {
  range:          string
  total_seconds:  number
  languages:      CodingLang[]
}
