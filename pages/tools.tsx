import { NextSeo } from 'next-seo';
import Link from 'next/link';
import AdSlot from '../components/AdSlot';
import SectionHeading from '../components/SectionHeading';
import { tools } from '../data/tools';
import { getCalculatorBySlug } from '../data/calculators';
import CalculatorCard from '../components/CalculatorCard';
import { formatINR } from '../lib/format';

export default function ToolsPage() {
  const budgetPlanner = getCalculatorBySlug('budget-planner');
  const goalPlanner = getCalculatorBySlug('sip-calculator');

  return (
    <>
      <NextSeo title="Tools - RupeePlanner" description="Budget tracker, expense planner, and goal planning tools for Indians." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Tools" subtitle="Planning tools beyond calculators" />
          <div className="grid gap-4 md:grid-cols-3">
            {[
              { label: 'Monthly Income', value: formatINR(95000), note: 'Updated today' },
              { label: 'Planned Expenses', value: formatINR(62000), note: 'Under budget' },
              { label: 'Savings Rate', value: '34%', note: 'On track' }
            ].map((item) => (
              <div key={item.label} className="rounded-3xl border border-white/10 bg-surface p-5 shadow-card">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">{item.label}</p>
                <p className="mt-3 text-2xl font-semibold text-text">{item.value}</p>
                <p className="mt-2 text-xs text-muted">{item.note}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {tools.map((tool) => (
              <Link key={tool.title} href={tool.href} className="card">
                <h3 className="text-lg font-semibold text-text">{tool.title}</h3>
                <p className="mt-2 text-sm text-muted">{tool.description}</p>
                <span className="mt-4 inline-flex text-xs font-semibold text-accent">Open tool</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section id="budget-tracker" className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Budget Tracker" subtitle="Keep spending aligned with your goals" />
          {budgetPlanner && <CalculatorCard calculator={budgetPlanner} />}
        </div>
      </section>

      <section id="expense-planner" className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Expense Planner" subtitle="Break down fixed vs variable expenses" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <h3 className="text-lg font-semibold text-text">Expense categories</h3>
              <p className="mt-2 text-sm text-muted">Track housing, food, transport, and lifestyle in one view.</p>
              <div className="mt-6 grid gap-3 md:grid-cols-2">
                {['Housing', 'Food', 'Transport', 'Lifestyle', 'Health', 'Education'].map((item) => (
                  <div key={item} className="rounded-2xl bg-base p-4">
                    <p className="text-xs text-muted">{item}</p>
                    <p className="text-lg font-semibold text-text">INR 0</p>
                  </div>
                ))}
              </div>
            </div>
            <AdSlot label="Tools Sidebar Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} />
          </div>
        </div>
      </section>

      <section id="goal-planner" className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Goal Planner" subtitle="Estimate the SIP for your milestones" />
          {goalPlanner && <CalculatorCard calculator={goalPlanner} />}
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Continue Planning" subtitle="Explore more calculators" />
          <div className="grid gap-4 md:grid-cols-3">
            <Link href="/calculators/emi-calculator" className="card">
              <h3 className="text-lg font-semibold text-text">EMI Calculator</h3>
              <p className="mt-2 text-sm text-muted">Calculate monthly EMIs with schedules.</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-accent">Open tool</span>
            </Link>
            <Link href="/calculators/home-loan-calculator" className="card">
              <h3 className="text-lg font-semibold text-text">Home Loan Calculator</h3>
              <p className="mt-2 text-sm text-muted">Plan repayment and interest breakups.</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-accent">Open tool</span>
            </Link>
            <Link href="/calculators/income-tax-calculator" className="card">
              <h3 className="text-lg font-semibold text-text">Income Tax Calculator</h3>
              <p className="mt-2 text-sm text-muted">Compare old vs new regime quickly.</p>
              <span className="mt-4 inline-flex text-xs font-semibold text-accent">Open tool</span>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
