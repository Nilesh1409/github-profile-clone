import { Routes, Route, useParams } from 'react-router-dom';
import { Header, Footer } from '../components/layout';
import { ProfileCard } from '../components/profile';
import { OverviewTab, EmptyTab } from '../components/tabs';
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
  
  const { user, isLoading: isLoadingUser } = useGitHubUser(username);
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

