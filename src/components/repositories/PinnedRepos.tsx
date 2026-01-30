import { useMemo } from 'react';
import { PinnedRepoCard } from './PinnedRepoCard';
import { Skeleton } from '../common';
import type { GitHubRepository } from '../../types';
import styles from './PinnedRepos.module.css';

interface PinnedReposProps {
  repositories: GitHubRepository[];
  isLoading: boolean;
}

export function PinnedRepos({ repositories, isLoading }: PinnedReposProps) {
  // Select repos to pin (prioritize: has description, has stars, recently updated)
  const pinnedRepos = useMemo(() => {
    if (repositories.length === 0) return [];
    
    const sorted = [...repositories].sort((a, b) => {
      // Prioritize repos with descriptions
      const aHasDesc = a.description ? 1 : 0;
      const bHasDesc = b.description ? 1 : 0;
      if (aHasDesc !== bHasDesc) return bHasDesc - aHasDesc;
      
      // Then by stars
      if (a.stargazers_count !== b.stargazers_count) {
        return b.stargazers_count - a.stargazers_count;
      }
      
      // Then by update date
      return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
    });

    return sorted.slice(0, 6);
  }, [repositories]);

  if (isLoading) {
    return (
      <section className={styles.section}>
        <div className={styles.header}>
          <Skeleton width={200} height={20} />
        </div>
        <div className={styles.grid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} height={120} variant="rectangular" />
          ))}
        </div>
      </section>
    );
  }

  if (pinnedRepos.length === 0) {
    return null;
  }

  return (
    <section className={styles.section}>
      <div className={styles.header}>
        <h2 className={styles.title}>Popular repositories</h2>
      
      </div>
      <div className={styles.grid}>
        {pinnedRepos.map((repo) => (
          <PinnedRepoCard key={repo.id} repo={repo} />
        ))}
      </div>
    </section>
  );
}

