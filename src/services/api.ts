import { API_ENDPOINTS } from '../constants';
import type { 
  GitHubUser, 
  GitHubRepository, 
  GitHubOrganization, 
  ContributionData 
} from '../types';

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public endpoint: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithErrorHandling<T>(url: string): Promise<T> {
  const response = await fetch(url, {
    headers: {
      Accept: 'application/vnd.github.v3+json',
    },
  });

  if (!response.ok) {
    throw new ApiError(
      `Failed to fetch: ${response.statusText}`,
      response.status,
      url
    );
  }

  return response.json();
}

export async function fetchUser(username: string): Promise<GitHubUser> {
  return fetchWithErrorHandling<GitHubUser>(API_ENDPOINTS.user(username));
}

export async function fetchRepositories(
  username: string,
  options?: {
    sort?: 'created' | 'updated' | 'pushed' | 'full_name';
    direction?: 'asc' | 'desc';
    perPage?: number;
  }
): Promise<GitHubRepository[]> {
  const { sort = 'updated', direction = 'desc', perPage = 30 } = options || {};
  const url = `${API_ENDPOINTS.repos(username)}?sort=${sort}&direction=${direction}&per_page=${perPage}`;
  return fetchWithErrorHandling<GitHubRepository[]>(url);
}

export async function fetchOrganizations(username: string): Promise<GitHubOrganization[]> {
  return fetchWithErrorHandling<GitHubOrganization[]>(API_ENDPOINTS.orgs(username));
}

export async function fetchStarredRepos(
  username: string,
  perPage = 30
): Promise<GitHubRepository[]> {
  const url = `${API_ENDPOINTS.starred(username)}?per_page=${perPage}`;
  return fetchWithErrorHandling<GitHubRepository[]>(url);
}

export async function fetchContributions(username: string): Promise<ContributionData> {
  const url = API_ENDPOINTS.contributions(username);
  return fetchWithErrorHandling<ContributionData>(url);
}

export { ApiError };

