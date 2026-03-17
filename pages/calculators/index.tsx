import { NextSeo, FAQPageJsonLd } from 'next-seo';
import Link from 'next/link';
import AdSlot from '../../components/AdSlot';
import CalculatorAccordion from '../../components/CalculatorAccordion';
import FAQ from '../../components/FAQ';
import SectionHeading from '../../components/SectionHeading';
import { calculatorCategories, calculators } from '../../data/calculators';
import { calculatorFaqs } from '../../data/faqs';

export default function CalculatorsPage() {
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
          <div className="mt-6 flex flex-wrap gap-3">
            {calculatorCategories.map((category) => (
              <Link key={category.id} href={`#${category.id}`} className="badge">
                {category.label}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {calculatorCategories.map((category, index) => (
        <section key={category.id} id={category.id} className="section-pad">
          <div className="container-max py-10">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <p className="label">{category.label}</p>
                <h2 className="mt-2 text-2xl font-semibold text-text">{category.description}</h2>
              </div>
              <span className="badge">{calculators.filter((calc) => calc.category === category.id).length} tools</span>
            </div>
            <div className="space-y-4">
              {calculators
                .filter((calc) => calc.category === category.id)
                .map((calc) => (
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
      ))}

      <section className="section-pad">
        <div className="container-max py-12">
          <SectionHeading title="FAQs" subtitle="Common questions about financial calculators" />
          <FAQ items={calculatorFaqs} />
        </div>
      </section>
    </>
  );
}
