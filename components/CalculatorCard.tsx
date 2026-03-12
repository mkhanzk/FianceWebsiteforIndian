import { Download, Share2, Camera } from 'lucide-react';
import { useMemo, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import { CalculatorConfig } from '../data/calculators';
import { formatINR, formatNumber, formatPercent } from '../lib/format';
import { downloadCalculatorPdf } from '../lib/pdf';
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

  const handleDownloadPdf = () => {
    const chartImage = chartRef.current?.toBase64Image?.();
    const inputs = calculator.inputs.map((input) => ({
      label: input.label,
      value: formatInputValue(values[input.id], input.unit)
    }));
    downloadCalculatorPdf({
      title: calculator.title,
      inputs,
      summary: result.summary.map((item) => ({ label: item.label, value: item.value })),
      chartImage
    });
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

          <div className="rounded-2xl bg-surface p-4 shadow-card">
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

          {result.disclaimer && (
            <p className="text-xs text-muted">{result.disclaimer}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button type="button" className="btn-primary" onClick={handleDownloadPdf}>
          <Download size={16} />
          Download PDF
        </button>
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
