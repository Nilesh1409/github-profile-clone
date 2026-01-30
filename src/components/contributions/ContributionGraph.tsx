import { useMemo, useState, useEffect, useRef, type ReactNode } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { HeatmapChart } from 'echarts/charts';
import { CalendarComponent, TooltipComponent, VisualMapComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import type { ContributionData } from '../../types';
import { Skeleton } from '../common';
import styles from './ContributionGraph.module.css';

// Register ECharts components (tree-shaking friendly)
echarts.use([HeatmapChart, CalendarComponent, TooltipComponent, VisualMapComponent, CanvasRenderer]);

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

export function ContributionGraph({ contributions, isLoading, activityOverview }: ContributionGraphProps) {
  const currentYear = new Date().getFullYear();
  const [selectedYear, setSelectedYear] = useState(currentYear);
  const chartRef = useRef<ReactEChartsCore>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const availableYears = useMemo(() => {
    if (!contributions?.total) return [currentYear];
    return Object.keys(contributions.total)
      .map(Number)
      .sort((a, b) => b - a);
  }, [contributions, currentYear]);

  // Transform contribution data for ECharts
  const chartData = useMemo(() => {
    if (!contributions?.contributions) return [];
    
    const yearStart = new Date(selectedYear, 0, 1);
    const yearEnd = new Date(selectedYear, 11, 31);
    
    return contributions.contributions
      .filter(c => {
        const date = new Date(c.date);
        return date >= yearStart && date <= yearEnd;
      })
      .map(c => [c.date, c.count, c.level]);
  }, [contributions, selectedYear]);

  // Create a map for quick lookup of contribution counts by date
  const contributionCountMap = useMemo(() => {
    const map = new Map<string, number>();
    chartData.forEach(([date, count]) => {
      map.set(date as string, count as number);
    });
    return map;
  }, [chartData]);

  // ECharts options
  const chartOptions = useMemo((): EChartsOption => ({
    tooltip: {
      show: true,
      showDelay: 1000, // 1 second delay like GitHub
      hideDelay: 100,
      enterable: false,
      confine: true,
      formatter: (params) => {
        const p = params as { value?: [string, number] };
        if (!p.value) return '';
        const [date] = p.value;
        const count = contributionCountMap.get(date) || 0;
        const dateObj = new Date(date);
        const formattedDate = dateObj.toLocaleDateString('en-US', {
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
        const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'long' });
        
        // GitHub-style tooltip
        return `<div style="
          font-size: 12px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Noto Sans', Helvetica, Arial, sans-serif;
          line-height: 1.5;
          text-align: center;
          padding: 8px 10px;
        ">
          <strong style="color: #e6edf3; font-weight: 600;">${count} contribution${count !== 1 ? 's' : ''}</strong>
          <br/>
          <span style="color: #8b949e; font-size: 11px;">${dayName}, ${formattedDate}</span>
        </div>`;
      },
      backgroundColor: '#1c2128',
      borderColor: '#444c56',
      borderWidth: 1,
      borderRadius: 6,
      padding: 0,
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.3);',
      textStyle: {
        color: '#e6edf3',
      },
    },
    visualMap: {
      show: false,
      min: 0,
      max: 4, // Levels 0-4
      inRange: {
        color: CONTRIBUTION_COLORS,
      },
      calculable: false,
    },
    calendar: {
      top: 22,
      left: 36,
      right: 8,
      bottom: 8,
      cellSize: 'auto', // Let ECharts auto-calculate to fit container
      range: String(selectedYear),
      itemStyle: {
        borderWidth: 4, // Gap between cells
        borderColor: '#0d1117',
        color: '#161b22',
        borderRadius: 2,
      },
      yearLabel: { show: false },
      monthLabel: {
        nameMap: 'EN',
        color: '#7d8590',
        fontSize: 10,
        margin: 6,
      },
      dayLabel: {
        firstDay: 0, // Sunday first
        nameMap: ['', 'Mon', '', 'Wed', '', 'Fri', ''], // Show only Mon, Wed, Fri like GitHub
        color: '#7d8590',
        fontSize: 9,
        margin: 4,
      },
      splitLine: {
        show: false,
      },
    },
    series: [
      {
        type: 'heatmap',
        coordinateSystem: 'calendar',
        data: chartData.map(([date, , level]) => [date, level]), // Use level for color mapping
        itemStyle: {
          borderRadius: 2,
        },
        emphasis: {
          itemStyle: {
            borderColor: 'rgba(255, 255, 255, 0.5)',
            borderWidth: 1,
          },
        },
      },
    ],
  }), [chartData, selectedYear, contributionCountMap]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => {
      chartRef.current?.getEchartsInstance()?.resize();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (isLoading) {
    return <ContributionGraphSkeleton />;
  }

  const yearContributions = contributions?.total?.[selectedYear] || 0;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>
        {yearContributions.toLocaleString()} contributions in {selectedYear}
      </h2>
      
      <div className={styles.mainContent}>
        <div className={styles.container} ref={containerRef}>
          <div className={styles.chartWrapper}>
            <ReactEChartsCore
              ref={chartRef}
              echarts={echarts}
              option={chartOptions}
              style={{ height: '130px', width: '100%', minWidth: '720px' }}
              opts={{ renderer: 'canvas' }}
              notMerge={true}
              lazyUpdate={true}
            />
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
          <Skeleton width="100%" height={130} variant="rectangular" />
        </div>
      </div>
    </div>
  );
}

