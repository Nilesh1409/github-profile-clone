import { Icon, LanguageDot } from '../common';
import type { GitHubRepository } from '../../types';
import { formatNumber, truncateText } from '../../utils';
import styles from './PinnedRepoCard.module.css';

interface PinnedRepoCardProps {
  repo: GitHubRepository;
}

export function PinnedRepoCard({ repo }: PinnedRepoCardProps) {
  const forkedFrom = repo.fork ? repo.full_name.split('/')[0] : null;

  return (
    <article className={styles.card}>
      <div className={styles.header}>
        <Icon name="repo" size={16} className={styles.repoIcon} />
        <a 
          href={repo.html_url}
          className={styles.repoName}
          target="_blank"
          rel="noopener noreferrer"
        >
          {repo.name}
        </a>
        <span className={styles.visibility}>
          {repo.visibility === 'public' ? 'Public' : 'Private'}
        </span>
      </div>

      {forkedFrom && (
        <p className={styles.forkedFrom}>
          Forked from <a href={`https://github.com/${forkedFrom}/${repo.name}`}>{forkedFrom}/{repo.name}</a>
        </p>
      )}

      {repo.description && (
        <p className={styles.description}>
          {truncateText(repo.description, 100)}
        </p>
      )}

      <div className={styles.footer}>
        {repo.language && (
          <LanguageDot language={repo.language} />
        )}
        
        {repo.stargazers_count > 0 && (
          <a href={`${repo.html_url}/stargazers`} className={styles.stat}>
            <Icon name="star" size={16} />
            <span>{formatNumber(repo.stargazers_count)}</span>
          </a>
        )}

        {repo.forks_count > 0 && (
          <a href={`${repo.html_url}/forks`} className={styles.stat}>
            <Icon name="fork" size={16} />
            <span>{formatNumber(repo.forks_count)}</span>
          </a>
        )}
      </div>
    </article>
  );
}

