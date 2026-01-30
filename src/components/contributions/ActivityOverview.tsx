import type { GitHubOrganization } from '../../types';
import styles from './ActivityOverview.module.css';

interface ActivityOverviewProps {
  organizations: GitHubOrganization[];
  username: string;
}

interface ActivityData {
  commits: number;
  pullRequests: number;
  issues: number;
  codeReview: number;
}

const GREEN_COLOR = '#57D464';

function ActivityChart({ data }: { data: ActivityData }) {
  const width = 280;
  const height = 260;
  const centerX = width / 2;
  const centerY = height / 2;
  const axisLength = 85;
  
  // Calculate data points based on percentages
  const commitPoint = {
    x: centerX - (axisLength * data.commits / 100),
    y: centerY
  };
  
  const prPoint = {
    x: centerX,
    y: centerY + (axisLength * data.pullRequests / 100) * 1.5
  };

  return (
    <svg 
      width={width} 
      height={height} 
      viewBox={`0 0 ${width} ${height}`}
      className={styles.chart}
    >
      {/* Vertical axis (Code review - Pull requests) */}
      <line
        x1={centerX}
        y1={centerY - axisLength}
        x2={centerX}
        y2={centerY + axisLength}
        stroke={GREEN_COLOR}
        strokeWidth="2"
      />
      
      {/* Horizontal axis (Commits - Issues) */}
      <line
        x1={centerX - axisLength}
        y1={centerY}
        x2={centerX + axisLength}
        y2={centerY}
        stroke={GREEN_COLOR}
        strokeWidth="2"
      />
      
      {/* Filled polygon area - triangle from center to commits to PR point */}
      <polygon
        points={`
          ${centerX},${centerY}
          ${commitPoint.x},${commitPoint.y}
          ${prPoint.x},${prPoint.y}
        `}
        fill="rgba(87, 212, 100, 0.25)"
        stroke="none"
      />
      
      {/* Straight line from commits point to PR point */}
      <line
        x1={commitPoint.x}
        y1={commitPoint.y}
        x2={prPoint.x}
        y2={prPoint.y}
        stroke={GREEN_COLOR}
        strokeWidth="2"
      />
      
      {/* Data point on Commits axis - white fill with green border */}
      <circle
        cx={commitPoint.x}
        cy={commitPoint.y}
        r="4"
        fill="#ffffff"
        stroke={GREEN_COLOR}
        strokeWidth="3"
      />
      
      {/* Data point on Pull requests axis - white fill with green border */}
      <circle
        cx={prPoint.x}
        cy={prPoint.y}
        r="4"
        fill="#ffffff"
        stroke={GREEN_COLOR}
        strokeWidth="3"
      />
      
      {/* Labels */}
      <text
        x={centerX}
        y={centerY - axisLength - 14}
        textAnchor="middle"
        className={styles.axisLabel}
      >
        Code review
      </text>
      
      <text
        x={centerX + axisLength + 14}
        y={centerY + 5}
        textAnchor="start"
        className={styles.axisLabel}
      >
        Issues
      </text>
      
      <text
        x={centerX}
        y={centerY + axisLength + 28}
        textAnchor="middle"
        className={styles.axisLabel}
      >
        {data.pullRequests}%
      </text>
      <text
        x={centerX}
        y={centerY + axisLength + 44}
        textAnchor="middle"
        className={styles.axisLabel}
      >
        Pull requests
      </text>
      
      <text
        x={centerX - axisLength - 14}
        y={centerY - 10}
        textAnchor="end"
        className={styles.axisLabel}
      >
        {data.commits}%
      </text>
      <text
        x={centerX - axisLength - 14}
        y={centerY + 6}
        textAnchor="end"
        className={styles.axisLabel}
      >
        Commits
      </text>
    </svg>
  );
}

export function ActivityOverview({ organizations, username }: ActivityOverviewProps) {
  const activityData: ActivityData = {
    commits: 80,
    pullRequests: 20,
    issues: 5,
    codeReview: 10,
  };

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.contributions}>
          <h3 className={styles.title}>Activity overview</h3>
          <p className={styles.contributionText}>
            Contributed to{' '}
            <a href={`https://github.com/${username}`} className={styles.link}>
              UptimeAI/uptime_webapp
            </a>
            ,{' '}
            <a href={`https://github.com/${username}`} className={styles.link}>
              UptimeAI/uptime_server
            </a>
            ,{' '}
            <a href={`https://github.com/${username}`} className={styles.link}>
              UptimeAI/uptime_ml
            </a>
            {' '}and 13 other repositories
          </p>
        </div>

        <div className={styles.chartSection}>
          <ActivityChart data={activityData} />
        </div>
      </div>

      {organizations.length > 0 && (
        <div className={styles.orgFilter}>
          {organizations.slice(0, 2).map((org) => (
            <button key={org.id} className={styles.orgButton}>
              <img 
                src={org.avatar_url} 
                alt={org.login} 
                className={styles.orgAvatar}
              />
              <span>@{org.login}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

