import { useMemo } from 'react';
import { Icon } from '../common';
import type { ContributionData } from '../../types';
import styles from './ContributionActivity.module.css';

interface ContributionActivityProps {
  contributions: ContributionData | null;
  totalContributions: number;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function ContributionActivity({ contributions }: ContributionActivityProps) {
  const activityData = useMemo(() => {
    if (!contributions?.contributions?.length) return null;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth();

    // Get contributions for the current month
    const monthContributions = contributions.contributions.filter(c => {
      const date = new Date(c.date);
      return date.getFullYear() === currentYear && date.getMonth() === currentMonth;
    });

    if (monthContributions.length === 0) return null;

    // Calculate totals
    const total = monthContributions.reduce((sum, c) => sum + c.count, 0);
    
    // Find date range with contributions
    const withContributions = monthContributions.filter(c => c.count > 0);
    if (withContributions.length === 0) return null;

    const dates = withContributions.map(c => new Date(c.date));
    const firstDate = new Date(Math.min(...dates.map(d => d.getTime())));
    const lastDate = new Date(Math.max(...dates.map(d => d.getTime())));

    const formatDate = (d: Date) => `${MONTHS[d.getMonth()].slice(0, 3)} ${d.getDate()}`;

    return {
      month: MONTHS[currentMonth],
      year: currentYear,
      count: total,
      dateRange: `${formatDate(firstDate)} – ${formatDate(lastDate)}`,
    };
  }, [contributions]);

  if (!activityData) return null;

  return (
    <div className={styles.container}>
      <h3 className={styles.sectionTitle}>Contribution activity</h3>

      <div className={styles.monthGroup}>
        <h4 className={styles.monthTitle}>{activityData.month} {activityData.year}</h4>
        
        <div className={styles.timeline}>
          <div className={styles.timelineLine} />
          <div className={styles.activityItem}>
            <div className={styles.activityIcon}>
              <Icon name="lock" size={16} />
            </div>
            <div className={styles.activityContent}>
              <span className={styles.activityText}>
                {activityData.count} contributions in private repositories
              </span>
              <span className={styles.dateRange}>{activityData.dateRange}</span>
            </div>
          </div>
          <div className={styles.timelineLine} />
        </div>
      </div>

      <button className={styles.showMoreButton}>
        Show more activity
      </button>
    </div>
  );
}

