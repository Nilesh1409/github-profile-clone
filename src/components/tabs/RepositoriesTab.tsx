import { useState, useMemo } from 'react';
import { Icon, LanguageDot, Skeleton } from '../common';
import type { GitHubRepository } from '../../types';
import { getRelativeTime } from '../../utils';
import styles from './RepositoriesTab.module.css';

interface RepositoriesTabProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
}

type SortOption = 'updated' | 'name' | 'stars';
type FilterType = 'all' | 'public' | 'fork' | 'source';

export function RepositoriesTab({ repositories, isLoading }: RepositoriesTabProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('updated');
  const [filterType, setFilterType] = useState<FilterType>('all');
  const [filterLanguage, setFilterLanguage] = useState<string>('');

  const languages = useMemo(() => {
    const langSet = new Set<string>();
    repositories.forEach(repo => {
      if (repo.language) {
        langSet.add(repo.language);
      }
    });
    return Array.from(langSet).sort();
  }, [repositories]);

  const filteredRepos = useMemo(() => {
    let filtered = [...repositories];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(repo =>
        repo.name.toLowerCase().includes(query) ||
        (repo.description?.toLowerCase().includes(query))
      );
    }

    // Type filter
    if (filterType !== 'all') {
      filtered = filtered.filter(repo => {
        switch (filterType) {
          case 'public':
            return repo.visibility === 'public';
          case 'fork':
            return repo.fork;
          case 'source':
            return !repo.fork;
          default:
            return true;
        }
      });
    }

    // Language filter
    if (filterLanguage) {
      filtered = filtered.filter(repo => repo.language === filterLanguage);
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'stars':
          return b.stargazers_count - a.stargazers_count;
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });

    return filtered;
  }, [repositories, searchQuery, sortBy, filterType, filterLanguage]);

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.filters}>
          <Skeleton width={300} height={32} />
        </div>
        <div className={styles.repoList}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.repoItem}>
              <Skeleton width="60%" height={20} />
              <Skeleton width="80%" height={16} />
              <Skeleton width={200} height={14} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.filters}>
        <div className={styles.searchWrapper}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Find a repository..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className={styles.filterDropdowns}>
          <select
            className={styles.filterSelect}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as FilterType)}
          >
            <option value="all">Type</option>
            <option value="public">Public</option>
            <option value="fork">Forks</option>
            <option value="source">Sources</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filterLanguage}
            onChange={(e) => setFilterLanguage(e.target.value)}
          >
            <option value="">Language</option>
            {languages.map(lang => (
              <option key={lang} value={lang}>{lang}</option>
            ))}
          </select>

          <select
            className={styles.filterSelect}
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortOption)}
          >
            <option value="updated">Sort: Last updated</option>
            <option value="name">Sort: Name</option>
            <option value="stars">Sort: Stars</option>
          </select>
        </div>
      </div>

      <div className={styles.repoList}>
        {filteredRepos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No repositories found matching your criteria.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <article key={repo.id} className={styles.repoItem}>
              <div className={styles.repoHeader}>
                <h3 className={styles.repoName}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.name}
                  </a>
                </h3>
                <span className={styles.visibility}>
                  {repo.visibility === 'public' ? 'Public' : 'Private'}
                </span>
              </div>

              {repo.fork && (
                <p className={styles.forkedFrom}>
                  Forked from {repo.full_name.split('/')[0]}/{repo.name}
                </p>
              )}

              {repo.description && (
                <p className={styles.description}>{repo.description}</p>
              )}

              <div className={styles.repoMeta}>
                {repo.language && (
                  <LanguageDot language={repo.language} />
                )}

                {repo.stargazers_count > 0 && (
                  <a href={`${repo.html_url}/stargazers`} className={styles.metaStat}>
                    <Icon name="star" size={16} />
                    {repo.stargazers_count}
                  </a>
                )}

                {repo.forks_count > 0 && (
                  <a href={`${repo.html_url}/forks`} className={styles.metaStat}>
                    <Icon name="fork" size={16} />
                    {repo.forks_count}
                  </a>
                )}

                <span className={styles.updateTime}>
                  Updated {getRelativeTime(repo.updated_at)}
                </span>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

