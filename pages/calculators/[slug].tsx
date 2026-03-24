import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import Link from 'next/link';
import CalculatorCard from '../../components/CalculatorCard';
import SectionHeading from '../../components/SectionHeading';
import FAQ from '../../components/FAQ';
import { calculatorSlugs, getCalculatorBySlug, calculators } from '../../data/calculators';

type Props = {
  slug: string;
};

export default function CalculatorDetail({ slug }: Props) {
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) return null;

  const related = calculators.filter((calc) => calc.category === calculator.category && calc.slug !== calculator.slug).slice(0, 3);
  const isLoan = calculator.category === 'loan';

  const formula = isLoan
    ? 'EMI = P × r × (1 + r)^n / ((1 + r)^n − 1)'
    : 'Future Value = P × (1 + r)^n';
  const formulaHint = isLoan
    ? 'P = principal, r = monthly rate, n = number of months.'
    : 'P = principal, r = annual rate, n = years.';
  const steps = isLoan
    ? [
        'Enter loan amount, interest rate, and tenure.',
        'Review EMI, total interest, and total payment.',
        'Use the amortization schedule to see yearly principal vs interest.'
      ]
    : [
        'Enter investment amount, rate of return, and duration.',
        'Review summary metrics and growth chart.',
        'Download PDF to share with your advisor.'
      ];

  return (
    <>
      <NextSeo title={calculator.seo.title} description={calculator.seo.description} />
      <FAQPageJsonLd
        mainEntity={calculator.faqs.map((item) => ({
          questionName: item.question,
          acceptedAnswerText: item.answer
        }))}
      />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title={calculator.title} subtitle={calculator.description} />
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <CalculatorCard calculator={calculator} />
            <div className="space-y-4">
              <div className="rounded-2xl bg-surface p-6 shadow-card">
                <p className="text-sm font-semibold text-text">Why RupeePlanner</p>
                <ul className="mt-3 space-y-2 text-sm text-muted">
                  <li>Instant calculations with real-time charts.</li>
                  <li>Amortization schedules for full clarity.</li>
                  <li>PDF + CSV exports for sharing.</li>
                </ul>
              </div>
              <div className="card">
                <p className="text-sm font-semibold text-text">Need another calculator?</p>
                <p className="mt-2 text-sm text-muted">Switch quickly between popular planning tools.</p>
                <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-accent">
                  <Link href="/calculators/emi-calculator">EMI</Link>
                  <Link href="/calculators/home-loan-calculator">Home Loan</Link>
                  <Link href="/calculators/income-tax-calculator">Income Tax</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="How it works" subtitle="Formula, assumptions, and schedule" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Formula</p>
              <p className="mt-3 rounded-2xl bg-base px-4 py-3 text-sm font-semibold text-text">{formula}</p>
              <p className="mt-3 text-xs text-muted">{formulaHint}</p>
            </div>
            <div className="card">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Steps</p>
              <ol className="mt-3 space-y-2 text-sm text-muted">
                {steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="FAQs" subtitle="Know the basics before you calculate" />
          <FAQ items={calculator.faqs} />
        </div>
      </section>

      {related.length > 0 && (
        <section className="section-pad">
          <div className="container-max py-10">
            <SectionHeading title="Related Calculators" subtitle="Continue planning with these tools" />
            <div className="grid gap-4 md:grid-cols-3">
              {related.map((item) => (
                <Link key={item.slug} href={`/calculators/${item.slug}`} className="card">
                  <p className="text-sm font-semibold text-text">{item.title}</p>
                  <p className="mt-2 text-xs text-muted">{item.description}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: calculatorSlugs.map((slug) => ({ params: { slug } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = String(context.params?.slug || '');
  return {
    props: { slug }
  };
};

