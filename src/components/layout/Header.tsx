import { useState, useEffect, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Icon, Avatar, Counter } from '../common';
import styles from './Header.module.css';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  count?: number;
}

interface HeaderProps {
  username: string;
  avatarUrl?: string;
  repoCount?: number;
  starCount?: number;
}

export function Header({ username, avatarUrl, repoCount = 0, starCount = 0 }: HeaderProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === '/' && !isInputFocused()) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
      if (e.key === 'Escape') {
        if (document.activeElement === searchInputRef.current) {
          searchInputRef.current?.blur();
        }
      }
    }

    function isInputFocused() {
      const activeEl = document.activeElement;
      return activeEl?.tagName === 'INPUT' || activeEl?.tagName === 'TEXTAREA';
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const tabs: TabItem[] = [
    { id: 'overview', label: 'Overview', icon: 'overview', path: `/${username}` },
    { id: 'repositories', label: 'Repositories', icon: 'repo', path: `/${username}/repositories`, count: repoCount },
    { id: 'projects', label: 'Projects', icon: 'project', path: `/${username}/projects` },
    { id: 'packages', label: 'Packages', icon: 'package', path: `/${username}/packages` },
    { id: 'stars', label: 'Stars', icon: 'star', path: `/${username}/stars`, count: starCount },
  ];

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.open(`https://github.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
    }
  }

  return (
    <header className={styles.header}>
      <div className={styles.topRow}>
        <div className={styles.leftSection}>
          <button 
            className={styles.menuButton}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <Icon name={mobileMenuOpen ? 'x' : 'menu'} size={24} />
          </button>
          
          <a href="https://github.com" className={styles.logo} aria-label="GitHub">
            <svg height="32" viewBox="0 0 16 16" width="32" fill="currentColor">
              <path d="M8 0c4.42 0 8 3.58 8 8a8.013 8.013 0 0 1-5.45 7.59c-.4.08-.55-.17-.55-.38 0-.27.01-1.13.01-2.2 0-.75-.25-1.23-.54-1.48 1.78-.2 3.65-.88 3.65-3.95 0-.88-.31-1.59-.82-2.15.08-.2.36-1.02-.08-2.12 0 0-.67-.22-2.2.82-.64-.18-1.32-.27-2-.27-.68 0-1.36.09-2 .27-1.53-1.03-2.2-.82-2.2-.82-.44 1.1-.16 1.92-.08 2.12-.51.56-.82 1.28-.82 2.15 0 3.06 1.86 3.75 3.64 3.95-.23.2-.44.55-.51 1.07-.46.21-1.61.55-2.33-.66-.15-.24-.6-.83-1.23-.82-.67.01-.27.38.01.53.34.19.73.9.82 1.13.16.45.68 1.31 2.69.94 0 .67.01 1.3.01 1.49 0 .21-.15.45-.55.38A7.995 7.995 0 0 1 0 8c0-4.42 3.58-8 8-8Z" />
            </svg>
          </a>

          <span className={styles.usernameLink}>{username}</span>
        </div>

        <div className={styles.rightSection}>
          <form className={styles.searchForm} onSubmit={handleSearchSubmit}>
            <Icon name="search" size={16} className={styles.searchIcon} />
            <input
              ref={searchInputRef}
              type="text"
              className={styles.searchInput}
              placeholder="Type / to search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search GitHub"
            />
            <span className={styles.searchShortcut}>/</span>
          </form>

          <button className={styles.splitButton} aria-label="Copilot">
            <span className={styles.splitButtonIcon}>
              <Icon name="copilot" size={16} />
            </span>
            <span className={styles.splitButtonDivider} />
            <span className={styles.splitButtonDropdown}>
              <Icon name="triangle" size={12} />
            </span>
          </button>

          <div className={styles.navDivider} />

          <button className={styles.navButtonOutlined} aria-label="Create new">
            <Icon name="plus" size={16} />
            <Icon name="triangle" size={12} />
          </button>


          <nav className={styles.nav}>
            <button className={styles.iconButton} aria-label="Issues">
              <Icon name="issueOpened" size={16} />
            </button>
            <button className={styles.iconButton} aria-label="Pull requests">
              <Icon name="pullRequest" size={16} />
            </button>
            <button className={styles.iconButtonWithBadge} aria-label="Inbox">
              <Icon name="repo" size={16} />
              <span className={styles.notificationDot} />
            </button>
            <button className={styles.iconButton} aria-label="Projects">
              <Icon name="project" size={16} />
            </button>
          </nav>

          {/* Mobile only icons */}
          <button 
            className={styles.mobileSearchButton} 
            aria-label="Search" 
            onClick={() => {
              setMobileSearchOpen(true);
              setTimeout(() => mobileSearchInputRef.current?.focus(), 100);
            }}
          >
            <Icon name="search" size={16} />
          </button>
          
          <button className={styles.mobileInboxButton} aria-label="Inbox">
            <Icon name="inbox" size={16} />
            <span className={styles.notificationDot} />
          </button>
          
          {avatarUrl && (
            <button className={styles.avatarButton} aria-label="User menu">
              <Avatar src={avatarUrl} alt={username} size="small" />
            </button>
          )}
        </div>
      </div>

      <div className={styles.tabsRow}>
        <nav className={styles.tabsNav}>
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
      </div>

      {mobileMenuOpen && (
        <div className={styles.mobileMenu}>
          <nav className={styles.mobileNav}>
            <a href="#" className={styles.mobileNavLink}>Dashboard</a>
            <a href="#" className={styles.mobileNavLink}>Pull requests</a>
            <a href="#" className={styles.mobileNavLink}>Issues</a>
            <a href="#" className={styles.mobileNavLink}>Codespaces</a>
            <a href="#" className={styles.mobileNavLink}>Marketplace</a>
            <a href="#" className={styles.mobileNavLink}>Explore</a>
          </nav>
        </div>
      )}

      {mobileSearchOpen && (
        <div className={styles.mobileSearchOverlay}>
          <div className={styles.mobileSearchHeader}>
            <form 
              className={styles.mobileSearchForm} 
              onSubmit={(e) => {
                e.preventDefault();
                if (searchQuery.trim()) {
                  window.open(`https://github.com/search?q=${encodeURIComponent(searchQuery)}`, '_blank');
                  setMobileSearchOpen(false);
                }
              }}
            >
              <Icon name="search" size={16} className={styles.mobileSearchIcon} />
              <input
                ref={mobileSearchInputRef}
                type="text"
                className={styles.mobileSearchInput}
                placeholder="Search GitHub"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
            </form>
            <button 
              className={styles.mobileSearchClose}
              onClick={() => setMobileSearchOpen(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </header>
  );
}

