import { PinnedRepos } from '../repositories';
import { ContributionGraph, ActivityOverview, ContributionActivity } from '../contributions';
import type { GitHubRepository, GitHubOrganization, ContributionData } from '../../types';

interface OverviewTabProps {
  repositories: GitHubRepository[];
  organizations: GitHubOrganization[];
  contributions: ContributionData | null;
  totalContributions: number;
  username: string;
  isLoadingRepos: boolean;
  isLoadingContributions: boolean;
}

export function OverviewTab({
  repositories,
  organizations,
  contributions,
  totalContributions,
  username,
  isLoadingRepos,
  isLoadingContributions,
}: OverviewTabProps) {
  return (
    <>
      <PinnedRepos 
        repositories={repositories} 
        isLoading={isLoadingRepos} 
      />
      
      <ContributionGraph
        contributions={contributions}
        isLoading={isLoadingContributions}
        totalContributions={totalContributions}
        activityOverview={
          <ActivityOverview 
            organizations={organizations} 
            username={username} 
          />
        }
      />

      <ContributionActivity 
        contributions={contributions} 
        totalContributions={totalContributions} 
      />
    </>
  );
}

