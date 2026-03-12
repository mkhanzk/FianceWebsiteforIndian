import dynamic from 'next/dynamic';
import { useEffect, useMemo } from 'react';
import { registerCharts } from '../lib/chart';

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

const ChartBlock = ({ chart, chartRef }: { chart: { type: 'doughnut' | 'line' | 'bar'; data: unknown }; chartRef: React.MutableRefObject<any> }) => {
  useEffect(() => {
    registerCharts();
  }, []);

  const options = useMemo(() => {
    const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
    const color = isDark ? '#e2e8f0' : '#0b3c5d';
    return {
      responsive: true,
      plugins: {
        legend: {
          labels: { color }
        }
      },
      scales: {
        x: { ticks: { color } },
        y: { ticks: { color } }
      }
    };
  }, []);

  if (chart.type === 'doughnut') {
    return <Doughnut data={chart.data as any} options={options as any} ref={chartRef} />;
  }
  if (chart.type === 'bar') {
    return <Bar data={chart.data as any} options={options as any} ref={chartRef} />;
  }
  return <Line data={chart.data as any} options={options as any} ref={chartRef} />;
};

export default ChartBlock;
