import { NextSeo, FAQPageJsonLd } from 'next-seo';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import CalculatorAccordion from '../../components/CalculatorAccordion';
import FAQ from '../../components/FAQ';
import SectionHeading from '../../components/SectionHeading';
import { calculatorCategories, calculators } from '../../data/calculators';
import { calculatorFaqs } from '../../data/faqs';

export default function CalculatorsPage() {
  const [query, setQuery] = useState('');
  const filteredCalculators = useMemo(() => {
    if (!query.trim()) return calculators;
    const search = query.toLowerCase();
    return calculators.filter(
      (calc) => calc.title.toLowerCase().includes(search) || calc.description.toLowerCase().includes(search)
    );
  }, [query]);

  const categoriesWithItems = useMemo(() => {
    return calculatorCategories.filter((category) =>
      filteredCalculators.some((calc) => calc.category === category.id)
    );
  }, [filteredCalculators]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    calculatorCategories.forEach((category) => {
      counts[category.id] = filteredCalculators.filter((calc) => calc.category === category.id).length;
    });
    return counts;
  }, [filteredCalculators]);

  return (
    <>
      <NextSeo
        title="Calculators - RupeePlanner"
        description="All financial calculators for loans, investments, tax, savings, and retirement."
      />
      <FAQPageJsonLd
        mainEntity={calculatorFaqs.map((item) => ({
          questionName: item.question,
          acceptedAnswerText: item.answer
        }))}
      />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Calculators" subtitle="All-in-one financial calculators for Indians" />
          <p className="max-w-2xl text-sm text-muted">
            Explore every calculator you need to plan loans, investments, tax, savings, and retirement. Each tool includes charts, Excel exports, and breakdown tables.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              className="input max-w-md"
              placeholder="Search calculators (EMI, SIP, tax, retirement...)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3 lg:hidden">
            {calculatorCategories.map((category) => (
              <Link key={category.id} href={`#${category.id}`} className="badge">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-10">
          <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
            <aside className="hidden lg:block">
              <div className="sticky top-24 space-y-4">
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Categories</p>
                  <nav className="mt-3 space-y-2 text-sm">
                    {calculatorCategories.map((category) => (
                      <a
                        key={category.id}
                        href={`#${category.id}`}
                        className="flex items-center justify-between rounded-xl px-3 py-2 text-muted transition hover:bg-base/60 hover:text-text"
                      >
                        <span>{category.label}</span>
                        <span className="badge">{categoryCounts[category.id] ?? 0}</span>
                      </a>
                    ))}
                  </nav>
                </div>
                <div className="card">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">Quick Access</p>
                  <div className="mt-3 flex flex-col gap-2 text-sm text-muted">
                    <Link href="/tools" className="hover:text-text">Planning Tools</Link>
                    <Link href="/blog" className="hover:text-text">Guides & Tips</Link>
                  </div>
                </div>
              </div>
            </aside>

            <div className="space-y-10">
              {categoriesWithItems.map((category, index) => {
                const items = filteredCalculators.filter((calc) => calc.category === category.id);
                return (
                  <div key={category.id} id={category.id} className="scroll-mt-24">
                    <div className="mb-6 flex items-center justify-between">
                      <div>
                        <p className="label">{category.label}</p>
                        <h2 className="mt-2 text-2xl font-semibold text-text">{category.description}</h2>
                      </div>
                      <span className="badge">{items.length} tools</span>
                    </div>
                    <div className="space-y-4">
                      {items.map((calc) => (
                        <CalculatorAccordion key={calc.slug} calculator={calc} />
                      ))}
                    </div>
                    {index < categoriesWithItems.length - 1 && (
                      <div className="mt-8">
                        <AdSlot label="Between Calculator Sections" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="FAQs" subtitle="Common questions about financial calculators" />
          <FAQ items={calculatorFaqs} />
        </div>
      </section>
    </>
  );
}