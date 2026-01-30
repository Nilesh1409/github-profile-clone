import { Routes, Route, useParams } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { ProfileCard } from '../components/profile';
import { OverviewTab, EmptyTab } from '../components/tabs';
import { Icon } from '../components/common';
import { 
  useGitHubUser, 
  useRepositories, 
  useOrganizations, 
  useContributions
} from '../hooks';
import { DEFAULT_USERNAME } from '../constants';
import styles from './ProfilePage.module.css';

export function ProfilePage() {
  const { username = DEFAULT_USERNAME } = useParams<{ username: string }>();
  
  const { user, isLoading: isLoadingUser, error: userError } = useGitHubUser(username);
  const { repositories, isLoading: isLoadingRepos } = useRepositories(username, {
    sort: 'updated',
    perPage: 100,
  });
  const { organizations, isLoading: isLoadingOrgs } = useOrganizations(username);
  const { 
    contributions, 
    isLoading: isLoadingContributions,
    currentYearContributions 
  } = useContributions(username);

  const isLoadingSidebar = isLoadingUser || isLoadingOrgs;

  // Check error status
  const errorStatus = userError && 'status' in userError ? (userError as { status: number }).status : null;
  const isUserNotFound = errorStatus === 404;
  const isRateLimited = errorStatus === 403;
  const hasError = userError && !isLoadingUser;

  // Show error page if there's an error
  if (hasError) {
    let errorTitle = 'Something went wrong';
    let errorDescription = 'An error occurred while loading the profile.';
    let errorHint = 'Please try again later.';

    if (isUserNotFound) {
      errorTitle = 'User not found';
      errorDescription = `The user "${username}" doesn't exist on GitHub.`;
      errorHint = 'Please check the username and try again, or search for a different user.';
    } else if (isRateLimited) {
      errorTitle = 'API Rate Limit Exceeded';
      errorDescription = 'Too many requests to GitHub API.';
      errorHint = 'GitHub limits unauthenticated requests to 60 per hour. Please wait a few minutes and try again.';
    }

    return (
      <div className={styles.page}>
        <Header 
          username={username} 
          avatarUrl={undefined}
          repoCount={0}
          starCount={0}
        />
        <div className={styles.errorContainer}>
          <div className={styles.errorContent}>
            <Icon name="alert" size={48} className={styles.errorIcon} />
            <h1 className={styles.errorTitle}>{errorTitle}</h1>
            <p className={styles.errorDescription}>
              {isUserNotFound ? (
                <>The user <strong>"{username}"</strong> doesn't exist on GitHub.</>
              ) : (
                errorDescription
              )}
            </p>
            <p className={styles.errorHint}>{errorHint}</p>
            <div className={styles.errorActions}>
              <button 
                onClick={() => window.location.reload()} 
                className={styles.errorButton}
              >
                Try again
              </button>
              {isUserNotFound && (
                <a href={`/${DEFAULT_USERNAME}`} className={styles.errorButtonSecondary}>
                  View default profile
                </a>
              )}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <Header 
        username={username} 
        avatarUrl={user?.avatar_url}
        repoCount={user?.public_repos || 0}
        starCount={0}
      />

      {/* Two-column layout below header */}
      <div className={styles.layout}>
        <aside className={styles.sidebar}>
          <ProfileCard
            user={user}
            organizations={organizations}
            isLoading={isLoadingSidebar}
          />
        </aside>
        
        <main className={styles.content}>
          <Routes>
            <Route
              index
              element={
                <OverviewTab
                  repositories={repositories}
                  organizations={organizations}
                  contributions={contributions}
                  totalContributions={currentYearContributions}
                  username={username}
                  isLoadingRepos={isLoadingRepos}
                  isLoadingContributions={isLoadingContributions}
                />
              }
            />
            <Route
              path="repositories"
              element={
                <EmptyTab
                  title="No repositories"
                  description="Repositories contain all of your project's files and revision history."
                  icon="repo"
                />
              }
            />
            <Route
              path="projects"
              element={
                <EmptyTab
                  title="No projects yet"
                  description="Projects help you organize and prioritize your work using a board layout."
                  icon="project"
                />
              }
            />
            <Route
              path="packages"
              element={
                <EmptyTab
                  title="No packages yet"
                  description="Packages are published through GitHub Actions or other CI/CD."
                  icon="package"
                />
              }
            />
            <Route
              path="stars"
              element={
                <EmptyTab
                  title="No starred repositories"
                  description="Star repositories to keep track of projects you find interesting."
                  icon="star"
                />
              }
            />
          </Routes>
        </main>
      </div>

      <Footer />
    </div>
  );
}

