import dynamic from 'next/dynamic';
import { useEffect, useMemo, useState } from 'react';
import { registerCharts } from '../lib/chart';

const Doughnut = dynamic(() => import('react-chartjs-2').then((mod) => mod.Doughnut), { ssr: false });
const Pie = dynamic(() => import('react-chartjs-2').then((mod) => mod.Pie), { ssr: false });
const Line = dynamic(() => import('react-chartjs-2').then((mod) => mod.Line), { ssr: false });
const Bar = dynamic(() => import('react-chartjs-2').then((mod) => mod.Bar), { ssr: false });

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
  }, [isDark]);

  const refProps = chartRef ? { ref: chartRef } : {};

  if (chart.type === 'doughnut') {
    return <Doughnut data={chart.data as any} options={options as any} {...refProps} />;
  }
  if (chart.type === 'pie') {
    return <Pie data={chart.data as any} options={options as any} {...refProps} />;
  }
  if (chart.type === 'bar') {
    return <Bar data={chart.data as any} options={options as any} {...refProps} />;
  }
  return <Line data={chart.data as any} options={options as any} {...refProps} />;
};

export default ChartBlock;

