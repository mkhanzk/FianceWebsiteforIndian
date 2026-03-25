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
          <SectionHeading title="Planning Tools" subtitle="Actionable dashboards for smarter money decisions" />
          <p className="max-w-2xl text-sm text-muted">
            Build budgets, track expenses, and plan milestones with guided tools designed for Indian households.
          </p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
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
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-10">
          <div className="grid gap-8 lg:grid-cols-[240px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Tool Menu</p>
                  <nav className="mt-3 space-y-2 text-sm text-muted">
                    <a className="hover:text-text" href="#budget-tracker">Budget Tracker</a>
                    <a className="hover:text-text" href="#expense-planner">Expense Planner</a>
                    <a className="hover:text-text" href="#goal-planner">Goal Planner</a>
                    <a className="hover:text-text" href="#tool-library">Tool Library</a>
                  </nav>
                </div>
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quick Links</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
                    <Link href="/calculators" className="hover:text-text">All Calculators</Link>
                    <Link href="/blog" className="hover:text-text">Guides & Tips</Link>
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              <section id="budget-tracker" className="scroll-mt-24">
                <SectionHeading title="Budget Tracker" subtitle="Keep spending aligned with your goals" />
                {budgetPlanner && <CalculatorCard calculator={budgetPlanner} />}
              </section>

              <section id="expense-planner" className="scroll-mt-24">
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
              </section>

              <section id="goal-planner" className="scroll-mt-24">
                <SectionHeading title="Goal Planner" subtitle="Estimate the SIP for your milestones" />
                {goalPlanner && <CalculatorCard calculator={goalPlanner} />}
              </section>

              <section id="tool-library" className="scroll-mt-24">
                <SectionHeading title="Tool Library" subtitle="Explore every planning tool" />
                <div className="grid gap-4 md:grid-cols-3">
                  {tools.map((tool) => (
                    <Link key={tool.title} href={tool.href} className="card">
                      <h3 className="text-lg font-semibold text-text">{tool.title}</h3>
                      <p className="mt-2 text-sm text-muted">{tool.description}</p>
                      <span className="mt-4 inline-flex text-xs font-semibold text-accent">Open tool</span>
                    </Link>
                  ))}
                </div>
              </section>
            </div>
          </div>
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