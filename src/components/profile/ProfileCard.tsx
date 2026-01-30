import { Avatar, Button, Icon, Skeleton } from '../common';
import type { GitHubUser, GitHubOrganization } from '../../types';
import styles from './ProfileCard.module.css';

interface ProfileCardProps {
  user: GitHubUser | null;
  organizations: GitHubOrganization[];
  isLoading: boolean;
}

export function ProfileCard({ user, organizations, isLoading }: ProfileCardProps) {
  if (isLoading || !user) {
    return <ProfileCardSkeleton />;
  }

  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <Avatar src={user.avatar_url} alt={user.name || user.login} size="large" />
        <span className={styles.statusEmoji}>🎯</span>
      </div>

      <div className={styles.nameSection}>
        <h1 className={styles.name}>{user.name}</h1>
        <p className={styles.username}>{user.login}</p>
      </div>

      {user.bio && (
        <p className={styles.bio}>{user.bio}</p>
      )}

      <Button fullWidth className={styles.editButton}>
        Edit profile
      </Button>

      <div className={styles.stats}>
        <a href={user.followers_url} className={styles.statLink}>
          <Icon name="people" size={16} />
          <span className={styles.statCount}>{user.followers}</span>
          <span className={styles.statLabel}>followers</span>
        </a>
        <span className={styles.statDot}>·</span>
        <a href={`${user.html_url}?tab=following`} className={styles.statLink}>
          <span className={styles.statCount}>{user.following}</span>
          <span className={styles.statLabel}>following</span>
        </a>
      </div>

      <ul className={styles.details}>
        {user.company && (
          <li className={styles.detailItem}>
            <Icon name="organization" size={16} />
            <span>{user.company}</span>
          </li>
        )}
        
        {user.location && (
          <li className={styles.detailItem}>
            <Icon name="location" size={16} />
            <span>{user.location}</span>
          </li>
        )}
        
        {user.email && (
          <li className={styles.detailItem}>
            <Icon name="mail" size={16} />
            <a href={`mailto:${user.email}`} className={styles.detailLink}>
              {user.email}
            </a>
          </li>
        )}
        
        {user.blog && (
          <li className={styles.detailItem}>
            <Icon name="link" size={16} />
            <a 
              href={user.blog.startsWith('http') ? user.blog : `https://${user.blog}`} 
              className={styles.detailLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              {user.blog.replace(/^https?:\/\//, '')}
            </a>
          </li>
        )}

        {user.twitter_username && (
          <li className={styles.detailItem}>
            <span className={styles.xIcon}>𝕏</span>
            <a 
              href={`https://twitter.com/${user.twitter_username}`}
              className={styles.detailLink}
              target="_blank"
              rel="noopener noreferrer"
            >
              @{user.twitter_username}
            </a>
          </li>
        )}
      </ul>

      <Achievements />

      {organizations.length > 0 && (
        <Organizations organizations={organizations} />
      )}
    </div>
  );
}

function Achievements() {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Achievements</h2>
      <div className={styles.achievementsList}>
        <div className={styles.achievement} title="Arctic Code Vault Contributor">
          <img 
            src="https://github.githubassets.com/assets/quickdraw-default-39c6aec8ff89.png" 
            alt="Arctic Code Vault Contributor"
            className={styles.achievementBadge}
          />
        </div>
        <div className={styles.achievement} title="YOLO">
          <img 
            src="https://github.githubassets.com/assets/yolo-default-be0bbff04951.png" 
            alt="YOLO"
            className={styles.achievementBadge}
          />
        </div>
        <div className={styles.achievement} title="Pull Shark">
          <img 
            src="https://github.githubassets.com/assets/pull-shark-default-498c279a747d.png" 
            alt="Pull Shark"
            className={styles.achievementBadge}
          />
          <span className={styles.achievementCount}>x4</span>
        </div>
      </div>
    </section>
  );
}

interface OrganizationsProps {
  organizations: GitHubOrganization[];
}

function Organizations({ organizations }: OrganizationsProps) {
  return (
    <section className={styles.section}>
      <h2 className={styles.sectionTitle}>Organizations</h2>
      <div className={styles.orgList}>
        {organizations.map((org) => (
          <a
            key={org.id}
            href={`https://github.com/${org.login}`}
            className={styles.orgLink}
            title={org.login}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src={org.avatar_url}
              alt={org.login}
              className={styles.orgAvatar}
            />
          </a>
        ))}
      </div>
    </section>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className={styles.card}>
      <div className={styles.avatarSection}>
        <Skeleton variant="circular" width={260} height={260} />
      </div>
      <div className={styles.nameSection}>
        <Skeleton width={180} height={32} />
        <Skeleton width={100} height={20} />
      </div>
      <Skeleton width="100%" height={60} />
      <Skeleton width="100%" height={32} />
      <div className={styles.stats}>
        <Skeleton width={200} height={20} />
      </div>
    </div>
  );
}

