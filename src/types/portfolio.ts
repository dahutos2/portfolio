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

/* ---------------- career.json ------------- */
export interface CareerEvent {
  title: string
  date:  string
  link?: string
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
  color?:  string
}
export interface CodingStats {
  started_at:          string
  total_seconds:  number
  languages:      CodingLang[]
}
