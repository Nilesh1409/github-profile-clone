export const GITHUB_API_BASE = 'https://api.github.com';
export const CONTRIBUTIONS_API_BASE = 'https://github-contributions-api.jogruber.de/v4';

export const API_ENDPOINTS = {
  user: (username: string) => `${GITHUB_API_BASE}/users/${username}`,
  repos: (username: string) => `${GITHUB_API_BASE}/users/${username}/repos`,
  orgs: (username: string) => `${GITHUB_API_BASE}/users/${username}/orgs`,
  starred: (username: string) => `${GITHUB_API_BASE}/users/${username}/starred`,
  contributions: (username: string) => `${CONTRIBUTIONS_API_BASE}/${username}`,
} as const;

export const DEFAULT_USERNAME = 'shreeramk';

export const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

