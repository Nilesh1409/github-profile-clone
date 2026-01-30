import { NavLink } from 'react-router-dom';
import { Icon, Counter } from '../common';
import styles from './ProfileTabs.module.css';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  count?: number;
}

interface ProfileTabsProps {
  username: string;
  repoCount: number;
  starCount: number;
}

export function ProfileTabs({ username, repoCount, starCount }: ProfileTabsProps) {
  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: 'overview', path: `/${username}` },
    { id: 'repositories', label: 'Repositories', icon: 'repo', path: `/${username}/repositories`, count: repoCount },
    { id: 'projects', label: 'Projects', icon: 'project', path: `/${username}/projects`, count: 0 },
    { id: 'packages', label: 'Packages', icon: 'package', path: `/${username}/packages`, count: 5 },
    { id: 'stars', label: 'Stars', icon: 'star', path: `/${username}/stars`, count: starCount },
  ];

  return (
    <nav className={styles.nav}>
      <ul className={styles.tabList} role="tablist">
        {tabs.map((tab) => (
          <li key={tab.id} className={styles.tabItem}>
            <NavLink
              to={tab.path}
              end={tab.id === 'overview'}
              className={({ isActive }) =>
                `${styles.tabLink} ${isActive ? styles.active : ''}`
              }
              role="tab"
            >
              <Icon name={tab.icon} size={16} className={styles.tabIcon} />
              <span className={styles.tabLabel}>{tab.label}</span>
              {tab.count !== undefined && tab.count > 0 && (
                <Counter count={tab.count} />
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}

