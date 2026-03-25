import { Share2, Camera, Table, ChevronDown } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CalculatorConfig } from '../data/calculators';
import { formatINR, formatNumber, formatPercent } from '../lib/format';
import ChartBlock from './ChartBlock';
import Tooltip from './Tooltip';

const getTooltip = (label: string) => {
  const lower = label.toLowerCase();
  if (lower.includes('interest')) return 'Annual interest rate used for calculations.';
  if (lower.includes('tenure') || lower.includes('duration')) return 'Time period for the calculation.';
  if (lower.includes('income')) return 'Your monthly or annual income before taxes.';
  if (lower.includes('deduction')) return 'Total eligible tax deductions.';
  if (lower.includes('inflation')) return 'Expected yearly rise in expenses.';
  if (lower.includes('corpus')) return 'Total retirement savings amount.';
  if (lower.includes('expense')) return 'Average monthly or annual expense.';
  if (lower.includes('rate')) return 'Expected annual return percentage.';
  return 'Enter a realistic value for best estimates.';
};

const formatInputValue = (value: number, unit?: string) => {
  if (unit === 'INR') return formatINR(value);
  if (unit === '%') return formatPercent(value);
  return formatNumber(value);
};

const CalculatorCard = ({ calculator }: { calculator: CalculatorConfig }) => {
  const initialValues = Object.fromEntries(
    calculator.inputs.map((input) => [input.id, input.defaultValue])
  ) as Record<string, number>;
  const [values, setValues] = useState<Record<string, number>>(initialValues);
  const [status, setStatus] = useState<string>('');
  const chartRef = useRef<any>(null);
  const resultRef = useRef<HTMLDivElement | null>(null);

  const result = useMemo(() => calculator.compute(values), [calculator, values]);

  const handleChange = (id: string, value: string) => {
    const parsed = Number(value);
    setValues((prev) => ({ ...prev, [id]: Number.isFinite(parsed) ? parsed : 0 }));
  };

  const handleDownloadExcel = () => {
    if (!result.schedule) return;
    const header = ['Month', 'EMI', 'Principal', 'Interest', 'Balance'];
    const rows = result.schedule.map((row) => [row.label, row.emi, row.principal, row.interest, row.balance]);
    const table = [
      '<table>',
      '<thead><tr>',
      header.map((cell) => `<th>${cell}</th>`).join(''),
      '</tr></thead>',
      '<tbody>',
      rows.map((row) => `<tr>${row.map((cell) => `<td>${cell}</td>`).join('')}</tr>`).join(''),
      '</tbody></table>'
    ].join('');

    const blob = new Blob([table], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${calculator.slug}-schedule.xls`;
    link.click();
    URL.revokeObjectURL(url);
    setStatus('Excel schedule downloaded.');
  };

  const handleShare = async () => {
    const shareText = `${calculator.title} - ${result.summary.map((item) => `${item.label}: ${item.value}`).join(', ')}`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    try {
      if (navigator.share) {
        await navigator.share({ title: calculator.title, text: shareText, url });
        setStatus('Shared successfully.');
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} | ${url}`);
        setStatus('Link copied to clipboard.');
      }
    } catch (error) {
      setStatus('Sharing failed.');
    }
  };

  const handleScreenshot = async () => {
    if (!resultRef.current) return;
    const canvas = await html2canvas(resultRef.current, { backgroundColor: null, scale: 2 });
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = `${calculator.slug}-result.png`;
    link.click();
    setStatus('Screenshot saved.');
  };

  return (
    <div className="card">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-text">{calculator.title}</h3>
          <p className="text-sm text-muted">{calculator.description}</p>
        </div>
        <span className="badge">Instant Results</span>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_1fr]">
        <div className="space-y-4">
          {calculator.inputs.map((input) => (
            <label key={input.id} className="block space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                <span>{input.label}</span>
                <Tooltip text={input.tooltip ?? getTooltip(input.label)} />
              </div>
              {input.type === 'select' ? (
                <select
                  className="input"
                  value={values[input.id]}
                  onChange={(event) => handleChange(input.id, event.target.value)}
                >
                  {input.options?.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              ) : (
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <input
                      className="input"
                      type="number"
                      min={input.min}
                      max={input.max}
                      step={input.step}
                      value={values[input.id]}
                      onChange={(event) => handleChange(input.id, event.target.value)}
                    />
                    {input.unit && (
                      <span className="min-w-[52px] text-xs font-semibold text-muted">{input.unit}</span>
                    )}
                  </div>
                  {input.min !== undefined && input.max !== undefined && (
                    <div className="space-y-1">
                      <input
                        className="range"
                        type="range"
                        min={input.min}
                        max={input.max}
                        step={input.step ?? 1}
                        value={values[input.id]}
                        onChange={(event) => handleChange(input.id, event.target.value)}
                      />
                      <div className="flex items-center justify-between text-[11px] text-muted">
                        <span>{formatInputValue(input.min, input.unit)}</span>
                        <span>{formatInputValue(input.max, input.unit)}</span>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </label>
          ))}
        </div>

        <div ref={resultRef} className="space-y-4 rounded-2xl bg-base/60 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            {result.summary.map((item) => (
              <div key={item.label} className="rounded-2xl bg-surface p-4 shadow-card">
                <p className="text-xs uppercase tracking-[0.2em] text-muted">{item.label}</p>
                <p className="mt-2 text-lg font-semibold text-text">{item.value}</p>
                {item.subLabel && <p className="text-xs text-muted">{item.subLabel}</p>}
              </div>
            ))}
          </div>

          <div className="chart-surface h-64">
            <ChartBlock chart={result.chart} chartRef={chartRef} />
          </div>

          <div className="overflow-hidden rounded-2xl border border-white/10">
            <table className="w-full text-sm">
              <thead className="bg-surface text-muted">
                <tr>
                  <th className="px-4 py-2 text-left">Metric</th>
                  <th className="px-4 py-2 text-left">Value</th>
                </tr>
              </thead>
              <tbody>
                {result.breakdown.map((row) => (
                  <tr key={row.label} className="border-t border-white/10">
                    <td className="px-4 py-2 text-muted">{row.label}</td>
                    <td className="px-4 py-2 text-text">{row.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {result.schedule && result.schedule.length > 0 && (
            <details className="details-card">
              <summary className="details-summary">
                <span>Amortization Schedule</span>
                <span className="details-meta">View</span>
                <ChevronDown className="details-chevron" size={16} />
              </summary>
              <div className="details-body space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Month-wise Breakdown</p>
                  <button type="button" className="btn-secondary" onClick={handleDownloadExcel}>
                    <Table size={16} />
                    Download Excel
                  </button>
                </div>
                <div className="overflow-hidden rounded-2xl border border-white/10">
                  <table className="w-full text-sm">
                    <thead className="bg-base text-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Month</th>
                        <th className="px-4 py-2 text-left">EMI</th>
                        <th className="px-4 py-2 text-left">Principal</th>
                        <th className="px-4 py-2 text-left">Interest</th>
                        <th className="px-4 py-2 text-left">Balance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.schedule.map((row) => (
                        <tr key={row.label} className="border-t border-white/10">
                          <td className="px-4 py-2 text-muted">{row.label}</td>
                          <td className="px-4 py-2 text-text">{row.emi}</td>
                          <td className="px-4 py-2 text-text">{row.principal}</td>
                          <td className="px-4 py-2 text-text">{row.interest}</td>
                          <td className="px-4 py-2 text-text">{row.balance}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </details>
          )}

          {result.insights && result.insights.length > 0 && (
            <div className="rounded-2xl bg-surface p-4 shadow-card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Insights</p>
              <ul className="mt-2 space-y-2 text-sm text-muted">
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            </div>
          )}

          {result.disclaimer && (
            <p className="text-xs text-muted">{result.disclaimer}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-secondary" onClick={handleShare}>
          <Share2 size={16} />
          Share Results
        </button>
        <button type="button" className="btn-secondary" onClick={handleScreenshot}>
          <Camera size={16} />
          Save Screenshot
        </button>
        {status && <span className="text-xs text-muted">{status}</span>}
      </div>
    </div>
  );
};

export default CalculatorCard;
