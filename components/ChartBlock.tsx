import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { registerCharts } from '../lib/chart';

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

const palette = ['#0F9D58', '#0B3C5D'];
const fillPalette = ['rgba(15, 157, 88, 0.18)', 'rgba(11, 60, 93, 0.16)'];

const ChartBlock = ({
  chart,
  chartRef
}: {
  chart: { type: 'doughnut' | 'line' | 'bar' | 'pie'; data: unknown };
  chartRef?: React.MutableRefObject<any>;
}) => {
  useEffect(() => {
    registerCharts();
  }, []);

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    const update = () => setIsDark(document.documentElement.classList.contains('dark'));
    update();
    const observer = new MutationObserver(update);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, []);

  const options = useMemo(() => {
    const color = isDark ? '#cbd5f5' : '#0b3c5d';
    const gridColor = isDark ? 'rgba(148, 163, 184, 0.16)' : 'rgba(11, 60, 93, 0.08)';
    const base: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color,
            usePointStyle: true,
            boxWidth: 8,
            padding: 16
          }
        },
        tooltip: {
          backgroundColor: isDark ? '#0b1220' : '#ffffff',
          borderColor: isDark ? 'rgba(148, 163, 184, 0.25)' : 'rgba(11, 60, 93, 0.12)',
          borderWidth: 1,
          titleColor: isDark ? '#e2e8f0' : '#0b3c5d',
          bodyColor: isDark ? '#e2e8f0' : '#0b3c5d',
          padding: 12,
          displayColors: true
        }
      },
      scales: {
        x: {
          ticks: { color },
          grid: { display: false },
          border: { color: gridColor }
        },
        y: {
          ticks: {
            color,
            maxTicksLimit: 6
          },
          grid: { color: gridColor },
          border: { color: gridColor }
        }
      }
    };

    if (chart.type === 'doughnut' || chart.type === 'pie') {
      return {
        ...base,
        plugins: {
          ...base.plugins,
          tooltip: {
            ...base.plugins.tooltip,
            callbacks: {
              label: (context: any) => {
                const data = context.chart?.data?.datasets?.[context.datasetIndex]?.data ?? [];
                const total = data.reduce((sum: number, entry: any) => sum + Number(entry || 0), 0);
                const value = Number(data[context.dataIndex] || 0);
                const percent = total ? (value / total) * 100 : 0;
                const label = context.label ?? 'Value';
                const percentText = percent % 1 === 0 ? percent.toFixed(0) : percent.toFixed(1);
                return `${label}: ${percentText}%`;
              }
            }
          }
        }
      };
    }

    return base;
  }, [chart.type, isDark]);

  const styledData = useMemo(() => {
    const data: any = chart.data;
    if (!data || !Array.isArray(data.datasets)) return data;
    const datasets = data.datasets.map((dataset: any, index: number) => {
      const color = palette[index % palette.length];
      if (chart.type === 'line') {
        const borderColor = dataset.borderColor ?? color;
        return {
          ...dataset,
          borderColor,
          backgroundColor: dataset.backgroundColor ?? fillPalette[index % fillPalette.length],
          borderWidth: 3,
          pointRadius: 0,
          pointHoverRadius: 4,
          pointBackgroundColor: borderColor,
          pointBorderColor: isDark ? '#0b1220' : '#f8fafc',
          pointBorderWidth: 2,
          tension: dataset.tension ?? 0.35,
          fill: false
        };
      }
      if (chart.type === 'bar') {
        const values = Array.isArray(dataset.data) ? dataset.data : [];
        const backgroundColor = values.length > 1
          ? values.map((_: any, idx: number) => palette[idx % palette.length])
          : palette[index % palette.length];
        return {
          ...dataset,
          backgroundColor,
          borderColor: isDark ? '#0b1220' : '#0b3c5d',
          borderWidth: 1,
          borderRadius: 10,
          borderSkipped: false
        };
      }
      if (chart.type === 'doughnut' || chart.type === 'pie') {
        const background =
          dataset.backgroundColor && Array.isArray(dataset.backgroundColor)
            ? dataset.backgroundColor
            : (data.labels || []).map((_: any, idx: number) => palette[idx % palette.length]);
        return {
          ...dataset,
          backgroundColor: background,
          borderColor: isDark ? '#0b1220' : '#f8fafc',
          borderWidth: 2
        };
      }
      return dataset;
    });
    return { ...data, datasets };
  }, [chart]);

  const refProps = chartRef ? { ref: chartRef } : {};

  if (chart.type === 'doughnut') {
    return <Doughnut data={styledData as any} options={options as any} {...refProps} />;
  }
  if (chart.type === 'pie') {
    return <Pie data={styledData as any} options={options as any} {...refProps} />;
  }
  if (chart.type === 'bar') {
    return <Bar data={styledData as any} options={options as any} {...refProps} />;
  }
  return <Line data={styledData as any} options={options as any} {...refProps} />;
};

export default ChartBlock;
