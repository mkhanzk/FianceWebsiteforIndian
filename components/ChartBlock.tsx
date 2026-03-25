import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { registerCharts } from '../lib/chart';

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

const palette = ['#22c55e', '#0ea5e9', '#14b8a6', '#f59e0b', '#a855f7'];
const fillPalette = ['rgba(34, 197, 94, 0.12)', 'rgba(14, 165, 233, 0.12)', 'rgba(20, 184, 166, 0.12)'];

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
    const color = '#cbd5f5';
    const gridColor = 'rgba(148, 163, 184, 0.18)';
    const base: any = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color,
            usePointStyle: true,
            boxWidth: 10
          }
        },
        tooltip: {
          backgroundColor: '#0b1220',
          borderColor: 'rgba(148, 163, 184, 0.25)',
          borderWidth: 1,
          titleColor: '#e2e8f0',
          bodyColor: '#e2e8f0',
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
          ticks: { color },
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
  }, [chart.type]);

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
          pointRadius: 4,
          pointHoverRadius: 6,
          pointBackgroundColor: borderColor,
          pointBorderColor: '#0b1220',
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
          borderColor: '#0b3c5d',
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
          borderColor: '#0b1220',
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
