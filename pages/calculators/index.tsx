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
            Explore every calculator you need to plan loans, investments, tax, savings, and retirement. Each tool includes charts, PDF exports, and breakdown tables.
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <input
              className="input max-w-md"
              placeholder="Search calculators (EMI, SIP, tax, retirement...)"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            {calculatorCategories.map((category) => (
              <Link key={category.id} href={`#${category.id}`} className="badge">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {calculatorCategories.map((category, index) => {
        const items = filteredCalculators.filter((calc) => calc.category === category.id);
        if (items.length === 0) return null;
        return (
          <section key={category.id} id={category.id} className="section-pad">
            <div className="container-max py-10">
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
              {index < calculatorCategories.length - 1 && (
                <div className="mt-8">
                  <AdSlot label="Between Calculator Sections" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
                </div>
              )}
            </div>
          </section>
        );
      })}

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="FAQs" subtitle="Common questions about financial calculators" />
          <FAQ items={calculatorFaqs} />
        </div>
      </section>
    </>
  );
}

