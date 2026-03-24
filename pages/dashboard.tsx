import { NextSeo } from 'next-seo';
import { useMemo, useRef, useState } from 'react';
import {
  ArrowDownRight,
  ArrowUpRight,
  Download,
  Mail,
  Search,
  Share2,
  SlidersHorizontal
} from 'lucide-react';
import SectionHeading from '../components/SectionHeading';
import ChartBlock from '../components/ChartBlock';
import { dashboardMonths, financeRecords, filterOptions, requestRecords } from '../data/financeDashboard';
import { formatINR, formatNumber, formatPercent } from '../lib/format';
import { downloadDashboardPdf } from '../lib/pdf';

const getRangeStart = (range: string) => {
  const now = new Date();
  if (range === '6m') {
    return new Date(now.getFullYear(), now.getMonth() - 5, 1);
  }
  if (range === '12m') {
    return new Date(now.getFullYear(), now.getMonth() - 11, 1);
  }
  return new Date(now.getFullYear(), 0, 1);
};

const KpiCard = ({
  label,
  value,
  change,
  positive,
  meta
}: {
  label: string;
  value: string;
  change?: string;
  positive?: boolean;
  meta?: string;
}) => (
  <div className="rounded-3xl border border-white/10 bg-surface p-5 shadow-card">
    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{label}</p>
    <p className="mt-3 text-2xl font-semibold text-text">{value}</p>
    <div className="mt-3 flex items-center justify-between text-xs text-muted">
      {change ? (
        <span className={`inline-flex items-center gap-1 font-semibold ${positive ? 'text-emerald-500' : 'text-rose-500'}`}>
          {positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
          {change}
        </span>
      ) : (
        <span />
      )}
      {meta && <span>{meta}</span>}
    </div>
  </div>
);

export default function DashboardPage() {
  const [range, setRange] = useState<string>(filterOptions.ranges[0].value);
  const [category, setCategory] = useState<string>(filterOptions.categories[0]);
  const [department, setDepartment] = useState<string>(filterOptions.departments[0]);
  const [status, setStatus] = useState<string>(filterOptions.statuses[0]);
  const [query, setQuery] = useState('');

  const lineChartRef = useRef<any>(null);
  const barChartRef = useRef<any>(null);
  const pieChartRef = useRef<any>(null);

  const startDate = useMemo(() => getRangeStart(range), [range]);

  const filteredRecords = useMemo(() => {
    return financeRecords.filter((record) => {
      const recordDate = new Date(record.date);
      if (recordDate < startDate) return false;
      if (category !== 'All' && record.category !== category) return false;
      if (department !== 'All' && record.department !== department) return false;
      return true;
    });
  }, [category, department, startDate]);

  const monthSeries = useMemo(() => {
    const eligibleMonths = dashboardMonths.filter(
      (month) => new Date(`${month.key}-01`) >= startDate
    );
    const totals = new Map<string, { revenue: number; expenses: number }>();
    filteredRecords.forEach((record) => {
      const key = record.date.slice(0, 7);
      const existing = totals.get(key) || { revenue: 0, expenses: 0 };
      if (record.type === 'revenue') {
        existing.revenue += record.amount;
      } else {
        existing.expenses += record.amount;
      }
      totals.set(key, existing);
    });

    return eligibleMonths.map((month) => {
      const values = totals.get(month.key) || { revenue: 0, expenses: 0 };
      return { label: month.label, revenue: values.revenue, expenses: values.expenses };
    });
  }, [filteredRecords, startDate]);

  const totals = useMemo(() => {
    const revenue = filteredRecords.filter((item) => item.type === 'revenue').reduce((sum, item) => sum + item.amount, 0);
    const expenses = filteredRecords.filter((item) => item.type === 'expense').reduce((sum, item) => sum + item.amount, 0);
    const profit = revenue - expenses;
    const margin = revenue === 0 ? 0 : (profit / revenue) * 100;
    return { revenue, expenses, profit, margin };
  }, [filteredRecords]);

  const requestSummary = useMemo(() => {
    const eligibleMonths = dashboardMonths.filter(
      (month) => new Date(`${month.key}-01`) >= startDate
    );
    return eligibleMonths.reduce(
      (acc, month) => {
        acc.requests += month.requests;
        acc.approved += month.approved;
        acc.pending += month.pending;
        acc.rejected += month.rejected;
        return acc;
      },
      { requests: 0, approved: 0, pending: 0, rejected: 0 }
    );
  }, [startDate]);

  const approvalRate = requestSummary.requests === 0 ? 0 : (requestSummary.approved / requestSummary.requests) * 100;

  const delta = useMemo(() => {
    if (monthSeries.length < 2) return null;
    const last = monthSeries[monthSeries.length - 1];
    const prev = monthSeries[monthSeries.length - 2];
    const revenueDelta = prev.revenue === 0 ? 0 : ((last.revenue - prev.revenue) / prev.revenue) * 100;
    const expenseDelta = prev.expenses === 0 ? 0 : ((last.expenses - prev.expenses) / prev.expenses) * 100;
    return { revenueDelta, expenseDelta };
  }, [monthSeries]);

  const departmentTotals = useMemo(() => {
    return filterOptions.departments
      .filter((item) => item !== 'All')
      .map((dept) => {
        const deptRecords = filteredRecords.filter((record) => record.department === dept);
        const revenue = deptRecords.filter((record) => record.type === 'revenue').reduce((sum, record) => sum + record.amount, 0);
        const expenses = deptRecords.filter((record) => record.type === 'expense').reduce((sum, record) => sum + record.amount, 0);
        return { dept, revenue, expenses };
      });
  }, [filteredRecords]);

  const categoryTotals = useMemo(() => {
    return filterOptions.categories
      .filter((item) => item !== 'All')
      .map((cat) => {
        const catRecords = filteredRecords.filter((record) => record.category === cat && record.type === 'expense');
        const total = catRecords.reduce((sum, record) => sum + record.amount, 0);
        return { cat, total };
      });
  }, [filteredRecords]);

  const filteredRequests = useMemo(() => {
    return requestRecords.filter((record) => {
      if (status !== 'All' && record.status !== status) return false;
      if (query.trim()) {
        const search = query.toLowerCase();
        return (
          record.name.toLowerCase().includes(search) ||
          record.category.toLowerCase().includes(search) ||
          record.id.toLowerCase().includes(search)
        );
      }
      return true;
    });
  }, [query, status]);

  const trendChart = useMemo(
    () => ({
      type: 'line' as const,
      data: {
        labels: monthSeries.map((item) => item.label),
        datasets: [
          {
            label: 'Revenue',
            data: monthSeries.map((item) => item.revenue),
            borderColor: '#0F9D58',
            backgroundColor: 'rgba(15, 157, 88, 0.15)',
            tension: 0.35
          },
          {
            label: 'Expenses',
            data: monthSeries.map((item) => item.expenses),
            borderColor: '#0B3C5D',
            backgroundColor: 'rgba(11, 60, 93, 0.18)',
            tension: 0.35
          }
        ]
      }
    }),
    [monthSeries]
  );

  const comparisonChart = useMemo(
    () => ({
      type: 'bar' as const,
      data: {
        labels: departmentTotals.map((item) => item.dept),
        datasets: [
          {
            label: 'Revenue',
            data: departmentTotals.map((item) => item.revenue),
            backgroundColor: '#0F9D58'
          },
          {
            label: 'Expenses',
            data: departmentTotals.map((item) => item.expenses),
            backgroundColor: '#0B3C5D'
          }
        ]
      }
    }),
    [departmentTotals]
  );

  const distributionChart = useMemo(
    () => ({
      type: 'pie' as const,
      data: {
        labels: categoryTotals.map((item) => item.cat),
        datasets: [
          {
            data: categoryTotals.map((item) => item.total),
            backgroundColor: ['#0F9D58', '#0B3C5D', '#22c55e', '#38bdf8']
          }
        ]
      }
    }),
    [categoryTotals]
  );

  const handleDownload = () => {
    downloadDashboardPdf({
      title: 'Financial Overview',
      filters: [
        { label: 'Date range', value: filterOptions.ranges.find((item) => item.value === range)?.label || range },
        { label: 'Category', value: category },
        { label: 'Department', value: department },
        { label: 'Status', value: status }
      ],
      kpis: [
        { label: 'Total Revenue', value: formatINR(totals.revenue) },
        { label: 'Total Expenses', value: formatINR(totals.expenses) },
        { label: 'Net Profit', value: formatINR(totals.profit) },
        { label: 'Profit Margin', value: formatPercent(totals.margin) },
        { label: 'Total Requests', value: formatNumber(requestSummary.requests) }
      ],
      charts: {
        trend: lineChartRef.current?.toBase64Image?.(),
        comparison: barChartRef.current?.toBase64Image?.(),
        distribution: pieChartRef.current?.toBase64Image?.()
      },
      requests: filteredRequests.slice(0, 6).map((item) => ({
        label: `${item.id} • ${item.name}`,
        value: `${item.category} • ${item.status}`
      }))
    });
  };

  const handleShare = async () => {
    const text = `RupeePlanner dashboard: Revenue ${formatINR(totals.revenue)}, Profit ${formatINR(totals.profit)}.`;
    const url = typeof window !== 'undefined' ? window.location.href : '';
    if (navigator.share) {
      await navigator.share({ title: 'RupeePlanner Dashboard', text, url });
    } else if (navigator.clipboard) {
      await navigator.clipboard.writeText(`${text} ${url}`);
    }
  };

  const handleEmail = () => {
    const subject = encodeURIComponent('RupeePlanner Dashboard Report');
    const body = encodeURIComponent(
      `Summary\nRevenue: ${formatINR(totals.revenue)}\nExpenses: ${formatINR(totals.expenses)}\nProfit: ${formatINR(totals.profit)}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  return (
    <>
      <NextSeo title="Dashboard - RupeePlanner" description="Interactive financial dashboard with KPIs, trends, and reports." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Dashboard" subtitle="Real-time financial insights and request analytics" />

          <div className="mt-6 grid gap-4 rounded-3xl border border-white/10 bg-surface/60 p-4 shadow-card md:grid-cols-[1.2fr_0.8fr]">
            <div className="flex flex-wrap items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-base/70 px-4 py-2 text-xs text-muted">
                <SlidersHorizontal size={14} />
                Filters
              </div>
              <select className="input max-w-[200px]" value={range} onChange={(event) => setRange(event.target.value)}>
                {filterOptions.ranges.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
              <select className="input max-w-[200px]" value={category} onChange={(event) => setCategory(event.target.value)}>
                {filterOptions.categories.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select className="input max-w-[200px]" value={department} onChange={(event) => setDepartment(event.target.value)}>
                {filterOptions.departments.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
              <select className="input max-w-[200px]" value={status} onChange={(event) => setStatus(event.target.value)}>
                {filterOptions.statuses.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-wrap justify-end gap-3">
              <button type="button" className="btn-secondary" onClick={handleShare}>
                <Share2 size={16} />
                Share
              </button>
              <button type="button" className="btn-secondary" onClick={handleEmail}>
                <Mail size={16} />
                Email
              </button>
              <button type="button" className="btn-primary" onClick={handleDownload}>
                <Download size={16} />
                Download PDF
              </button>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              label="Total Revenue"
              value={formatINR(totals.revenue)}
              change={delta ? `${formatPercent(Math.abs(delta.revenueDelta))}` : undefined}
              positive={(delta?.revenueDelta || 0) >= 0}
              meta={`Margin ${formatPercent(totals.margin)}`}
            />
            <KpiCard
              label="Total Expenses"
              value={formatINR(totals.expenses)}
              change={delta ? `${formatPercent(Math.abs(delta.expenseDelta))}` : undefined}
              positive={(delta?.expenseDelta || 0) <= 0}
              meta="Operational spend"
            />
            <KpiCard label="Net Profit" value={formatINR(totals.profit)} meta="After expenses" />
            <KpiCard label="Total Requests" value={formatNumber(requestSummary.requests)} meta={`${formatPercent(approvalRate)} approved`} />
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
            <div className="card space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Revenue vs Expenses</p>
                  <h3 className="mt-2 text-lg font-semibold text-text">Monthly trend</h3>
                </div>
                <span className="badge">Updated live</span>
              </div>
              <ChartBlock chart={trendChart} chartRef={lineChartRef} />
            </div>
            <div className="space-y-6">
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quarterly snapshot</p>
                <div className="mt-4 grid gap-3">
                  <div className="rounded-2xl bg-base p-4">
                    <p className="text-xs text-muted">Quarter revenue</p>
                    <p className="text-lg font-semibold text-text">
                      {formatINR(monthSeries.slice(-3).reduce((sum, item) => sum + item.revenue, 0))}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-base p-4">
                    <p className="text-xs text-muted">Quarter expenses</p>
                    <p className="text-lg font-semibold text-text">
                      {formatINR(monthSeries.slice(-3).reduce((sum, item) => sum + item.expenses, 0))}
                    </p>
                  </div>
                  <div className="rounded-2xl bg-base p-4">
                    <p className="text-xs text-muted">Profit run-rate</p>
                    <p className="text-lg font-semibold text-text">
                      {formatINR(monthSeries.slice(-3).reduce((sum, item) => sum + (item.revenue - item.expenses), 0))}
                    </p>
                  </div>
                </div>
              </div>
              <div className="card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Request health</p>
                <div className="mt-4 grid gap-3">
                  <div className="flex items-center justify-between rounded-2xl bg-base p-4">
                    <span className="text-xs text-muted">Approved</span>
                    <span className="text-sm font-semibold text-emerald-500">{formatNumber(requestSummary.approved)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-base p-4">
                    <span className="text-xs text-muted">Pending</span>
                    <span className="text-sm font-semibold text-amber-500">{formatNumber(requestSummary.pending)}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-base p-4">
                    <span className="text-xs text-muted">Rejected</span>
                    <span className="text-sm font-semibold text-rose-500">{formatNumber(requestSummary.rejected)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="card space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Department performance</p>
                <h3 className="mt-2 text-lg font-semibold text-text">Revenue vs expenses</h3>
              </div>
              <ChartBlock chart={comparisonChart} chartRef={barChartRef} />
            </div>
            <div className="card space-y-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Category split</p>
                <h3 className="mt-2 text-lg font-semibold text-text">Expense distribution</h3>
              </div>
              <ChartBlock chart={distributionChart} chartRef={pieChartRef} />
            </div>
          </div>

          <div className="mt-8 card">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Requests</p>
                <h3 className="mt-2 text-lg font-semibold text-text">Latest request details</h3>
              </div>
              <div className="flex items-center gap-2 rounded-full border border-white/10 bg-base/70 px-3 py-2 text-sm text-muted">
                <Search size={16} />
                <input
                  className="bg-transparent text-sm text-text outline-none placeholder:text-muted"
                  placeholder="Search by name, ID, category"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </div>
            </div>

            <div className="mt-6 overflow-hidden rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead className="bg-surface text-muted">
                  <tr>
                    <th className="px-4 py-3 text-left">Request ID</th>
                    <th className="px-4 py-3 text-left">Client</th>
                    <th className="px-4 py-3 text-left">Category</th>
                    <th className="px-4 py-3 text-left">Department</th>
                    <th className="px-4 py-3 text-left">Status</th>
                    <th className="px-4 py-3 text-left">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.length === 0 && (
                    <tr>
                      <td colSpan={6} className="px-4 py-6 text-center text-sm text-muted">
                        No requests match your filters.
                      </td>
                    </tr>
                  )}
                  {filteredRequests.map((row) => (
                    <tr key={row.id} className="border-t border-white/10">
                      <td className="px-4 py-3 text-muted">{row.id}</td>
                      <td className="px-4 py-3 text-text">{row.name}</td>
                      <td className="px-4 py-3 text-muted">{row.category}</td>
                      <td className="px-4 py-3 text-muted">{row.department}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            row.status === 'Approved'
                              ? 'bg-emerald-500/15 text-emerald-500'
                              : row.status === 'Pending'
                                ? 'bg-amber-500/15 text-amber-500'
                                : 'bg-rose-500/15 text-rose-500'
                          }`}
                        >
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text">{row.amount ? formatINR(row.amount) : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
