import { useMemo } from 'react';
import ReactEChartsCore from 'echarts-for-react/lib/core';
import * as echarts from 'echarts/core';
import { RadarChart } from 'echarts/charts';
import { TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import type { EChartsOption } from 'echarts';
import type { GitHubOrganization } from '../../types';
import styles from './ActivityOverview.module.css';

// Register ECharts components
echarts.use([RadarChart, TooltipComponent, LegendComponent, CanvasRenderer]);

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
  const chartOptions: EChartsOption = useMemo(() => ({
    tooltip: {
      show: true,
      showDelay: 500,
      hideDelay: 100,
      trigger: 'item',
      backgroundColor: '#1c2128',
      borderColor: '#444c56',
      borderWidth: 1,
      borderRadius: 6,
      textStyle: {
        color: '#e6edf3',
        fontSize: 12,
      },
      extraCssText: 'box-shadow: 0 8px 24px rgba(0,0,0,0.4);',
      formatter: (params) => {
        const p = params as { value?: number[]; name?: string };
        if (!p.value) return '';
        const [codeReview, commits, pullRequests, issues] = p.value;
        return `
          <div style="padding: 4px 8px; line-height: 1.5;">
            <div><strong>Code review:</strong> ${codeReview}%</div>
            <div><strong>Commits:</strong> ${commits}%</div>
            <div><strong>Pull requests:</strong> ${pullRequests}%</div>
            <div><strong>Issues:</strong> ${issues}%</div>
          </div>
        `;
      },
    },
    radar: {
      indicator: [
        { name: 'Code review', max: 100 },  // Top
        { name: 'Commits', max: 100 },       // Right
        { name: 'Pull requests', max: 100 }, // Bottom
        { name: 'Issues', max: 100 },        // Left
      ],
      center: ['50%', '50%'],
      radius: '65%',
      startAngle: 90, // Start from top
      clockwise: true, // Go clockwise: top → right → bottom → left
      shape: 'circle',
      axisName: {
        color: '#7d8590',
        fontSize: 11,
        fontWeight: 400,
        formatter: (value?: string, indicator?: { name?: string }) => {
          if (!value || !indicator?.name) return value || '';
          // Show percentage for axes with data
          const dataMap: Record<string, number> = {
            'Code review': data.codeReview,
            'Issues': data.issues,
            'Pull requests': data.pullRequests,
            'Commits': data.commits,
          };
          const percentage = dataMap[indicator.name];
          if (percentage > 0) {
            return `${percentage}%\n${value}`;
          }
          return value;
        },
      },
      splitNumber: 4,
      axisLine: {
        lineStyle: {
          color: GREEN_COLOR,
          width: 2,
        },
      },
      splitLine: {
        show: false,
      },
      splitArea: {
        show: false,
      },
    },
    series: [
      {
        type: 'radar',
        data: [
          {
            value: [data.codeReview, data.commits, data.pullRequests, data.issues],
            name: 'Activity',
            symbol: 'circle',
            symbolSize: 6, // Smaller dots
            itemStyle: {
              color: '#ffffff',
              borderColor: GREEN_COLOR,
              borderWidth: 2, // Thinner border for smaller dots
            },
            lineStyle: {
              width: 0, // Hide connecting lines
              opacity: 0,
            },
            areaStyle: {
              color: 'rgba(87, 212, 100, 0.35)', // More visible shadow (was 0.25)
            },
          },
        ],
      },
    ],
  }), [data]);

  return (
    <ReactEChartsCore
      echarts={echarts}
      option={chartOptions}
      style={{ height: '220px', width: '280px' }}
      opts={{ renderer: 'canvas' }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}

export function ActivityOverview({ organizations, username }: ActivityOverviewProps) {
  const activityData: ActivityData = {
    commits: 80,
    pullRequests: 40,
    issues: 20,
    codeReview: 60,
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

