import { useMemo, useState, type ReactNode } from 'react';
import type { ContributionData } from '../../types';
import { Skeleton } from '../common';
import styles from './ContributionGraph.module.css';

interface ContributionGraphProps {
  contributions: ContributionData | null;
  isLoading: boolean;
  totalContributions: number;
  activityOverview?: ReactNode;
}

const CONTRIBUTION_COLORS = [
  '#161b22', // Level 0 - no contributions
  '#0e4429', // Level 1
  '#006d32', // Level 2
  '#26a641', // Level 3
  '#39d353', // Level 4
];

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export function ContributionGraph({ contributions, isLoading, activityOverview }: ContributionGraphProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  
  const availableYears = useMemo(() => {
    if (!contributions?.total) return [currentYear];
    return Object.keys(contributions.total)
      .map(Number)
      .sort((a, b) => b - a);
  }, [contributions, currentYear]);

  const { weeks, monthLabels } = useMemo(() => {
    if (!contributions?.contributions) {
      return { weeks: [], monthLabels: [] };
    }
    
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);
    
    // Create a map of date -> contribution
    const contributionMap = new Map(
      contributions.contributions
        .filter(c => {
          const date = new Date(c.date);
          return date >= yearStart && date <= yearEnd;
        })
        .map(c => [c.date, c])
    );

    const weeksData: Array<Array<{ date: string; count: number; level: number }>> = [];
    const monthLabelsData: Array<{ month: string; weekIndex: number }> = [];
    
    // Start from the first Sunday on or before Jan 1
    const startDate = new Date(yearStart);
    const startDayOfWeek = startDate.getDay();
    startDate.setDate(startDate.getDate() - startDayOfWeek);
    
    let currentDate = new Date(startDate);
    let weekIndex = 0;
    let lastMonth = -1;
    
    while (currentDate <= yearEnd || weeksData[weeksData.length - 1]?.length < 7) {
      if (!weeksData[weekIndex]) {
        weeksData[weekIndex] = [];
      }
      
      const dateStr = currentDate.toISOString().split('T')[0];
      const isInYear = currentDate >= yearStart && currentDate <= yearEnd;
      const contribution = contributionMap.get(dateStr);
      
      weeksData[weekIndex].push({
        date: dateStr,
        count: isInYear ? (contribution?.count || 0) : -1,
        level: isInYear ? (contribution?.level || 0) : -1,
      });
      
      // Track month labels
      if (isInYear && currentDate.getMonth() !== lastMonth) {
        monthLabelsData.push({
          month: MONTHS[currentDate.getMonth()],
          weekIndex,
        });
        lastMonth = currentDate.getMonth();
      }
      
      currentDate.setDate(currentDate.getDate() + 1);
      
      if (weeksData[weekIndex].length === 7) {
        weekIndex++;
      }
    }
    
    return { weeks: weeksData, monthLabels: monthLabelsData };
  }, [contributions, selectedYear]);

  if (isLoading) {
    return <ContributionGraphSkeleton />;
  }

  const yearContributions = contributions?.total?.[selectedYear] || 0;
  

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {yearContributions.toLocaleString()} contributions in the last year
      </h2>
      
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.graphWrapper}>
            <div className={styles.graph}>
              <div className={styles.dayLabels}>
                {DAYS.map((day, i) => (
                  <span 
                    key={day} 
                    className={styles.dayLabel}
                    style={{ visibility: i % 2 === 0 ? 'hidden' : 'visible' }}
                  >
                    {day}
                  </span>
                ))}
              </div>
              
              <div className={styles.calendarContainer}>
                <div className={styles.monthLabels}>
                  {monthLabels.map(({ month, weekIndex }, i) => (
                    <span 
                      key={`${month}-${i}`}
                      className={styles.monthLabel}
                      style={{ gridColumn: weekIndex + 1 }}
                    >
                      {month}
                    </span>
                  ))}
                </div>
                
                <div className={styles.calendar}>
                  {weeks.map((week, weekIndex) => (
                    <div key={weekIndex} className={styles.week}>
                      {week.map((day, dayIndex) => {
                        const isOutOfRange = day.level === -1;
                        const isEmpty = day.level === 0;
                        
                        return (
                          <div
                            key={`${weekIndex}-${dayIndex}`}
                            className={`${styles.day} ${isEmpty ? styles.dayEmpty : ''}`}
                            style={{
                              backgroundColor: isOutOfRange 
                                ? 'transparent' 
                                : isEmpty 
                                  ? undefined 
                                  : CONTRIBUTION_COLORS[day.level],
                              visibility: isOutOfRange ? 'hidden' : 'visible',
                            }}
                            title={isOutOfRange 
                              ? '' 
                              : `${day.count} contribution${day.count !== 1 ? 's' : ''} on ${new Date(day.date).toLocaleDateString('en-US', {
                                  weekday: 'long',
                                  year: 'numeric',
                                  month: 'long',
                                  day: 'numeric',
                                })}`
                            }
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <a href="#" className={styles.learnMore}>
              Learn how we count contributions
            </a>
            <div className={styles.legend}>
              <span className={styles.legendLabel}>Less</span>
              {CONTRIBUTION_COLORS.map((color, index) => (
                <span
                  key={index}
                  className={styles.legendBox}
                  style={{ backgroundColor: color }}
                  aria-label={`Level ${index}`}
                />
              ))}
              <span className={styles.legendLabel}>More</span>
            </div>
          </div>

          {activityOverview && (
            <div className={styles.activityOverviewSection}>
              {activityOverview}
            </div>
          )}
        </div>

        <div className={styles.yearList}>
          {availableYears.map(year => (
            <button
              key={year}
              className={`${styles.yearButton} ${year === selectedYear ? styles.yearButtonActive : ''}`}
              onClick={() => setSelectedYear(year)}
            >
              {year}
            </button>
          ))}
        </div>

        <div className={styles.yearSelectWrapper}>
          <select
            className={styles.yearSelect}
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            aria-label="Select year"
          >
            {availableYears.map(year => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}

function ContributionGraphSkeleton() {
  return (
    <div className={styles.wrapper}>
      <Skeleton width={300} height={24} />
      <div className={styles.mainContent}>
        <div className={styles.container}>
          <Skeleton width="100%" height={140} variant="rectangular" />
        </div>
      </div>
    </div>
  );
}

