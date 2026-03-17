import { NextSeo } from 'next-seo';
import Link from 'next/link';
import AdSlot from '../components/AdSlot';
import LeadForm from '../components/LeadForm';
import SectionHeading from '../components/SectionHeading';
import { tools } from '../data/tools';
import { getCalculatorBySlug } from '../data/calculators';
import CalculatorCard from '../components/CalculatorCard';

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
          <SectionHeading title="Lead Capture" subtitle="Generate high-intent financial leads" />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <AdSlot label="Lead Magnet Banner" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER} />
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}
