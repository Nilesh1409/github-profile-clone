import { useState, useMemo } from 'react';
import { Icon, LanguageDot, Skeleton } from '../common';
import type { GitHubRepository } from '../../types';
import styles from './StarsTab.module.css';

interface StarsTabProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
}

export function StarsTab({ repositories, isLoading }: StarsTabProps) {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRepos = useMemo(() => {
    if (!searchQuery) return repositories;
    const query = searchQuery.toLowerCase();
    return repositories.filter(repo =>
      repo.name.toLowerCase().includes(query) ||
      repo.full_name.toLowerCase().includes(query) ||
      (repo.description?.toLowerCase().includes(query))
    );
  }, [repositories, searchQuery]);

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
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Stars</h2>
        <span className={styles.count}>{repositories.length}</span>
      </div>

      <div className={styles.filters}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search stars..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className={styles.repoList}>
        {filteredRepos.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No starred repositories found.</p>
          </div>
        ) : (
          filteredRepos.map((repo) => (
            <article key={repo.id} className={styles.repoItem}>
              <div className={styles.repoHeader}>
                <Icon name="repo" size={16} className={styles.repoIcon} />
                <h3 className={styles.repoName}>
                  <a
                    href={repo.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {repo.full_name}
                  </a>
                </h3>
              </div>

              {repo.description && (
                <p className={styles.description}>{repo.description}</p>
              )}

              <div className={styles.repoMeta}>
                {repo.language && (
                  <LanguageDot language={repo.language} />
                )}

                <span className={styles.metaStat}>
                  <Icon name="star" size={16} />
                  {repo.stargazers_count.toLocaleString()}
                </span>

                {repo.forks_count > 0 && (
                  <span className={styles.metaStat}>
                    <Icon name="fork" size={16} />
                    {repo.forks_count.toLocaleString()}
                  </span>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

