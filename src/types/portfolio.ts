/* ---------------- user.json ----------------- */
export interface User {
  owner:     string
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
  date:  string
}

/* ---------------- repos.json ---------------- */
export interface Repo {
  full_name:   string
  description: string | null
  stars:       number
  lang:        string | null
}

/* ---------------- services.json ------------- */
export interface Service {
  title: string
  stack: string[]
  blurb: string
}

/* ---------------- testimonials.json --------- */
export interface Testimonial {
  author:   string
  position: string
  quote:    string
  avatar:   string
}

/* ---------------- timeline.json ------------- */
export interface TimelineEntry {
  text: string
  date: string
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
  total_seconds:  number
  languages:      CodingLang[]
}
