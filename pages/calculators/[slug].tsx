import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, FAQPageJsonLd } from 'next-seo';
import Link from 'next/link';
import CalculatorCard from '../../components/CalculatorCard';
import SectionHeading from '../../components/SectionHeading';
import LeadForm from '../../components/LeadForm';
import FAQ from '../../components/FAQ';
import { calculatorSlugs, getCalculatorBySlug, calculators } from '../../data/calculators';

type Props = {
  slug: string;
};

export default function CalculatorDetail({ slug }: Props) {
  const calculator = getCalculatorBySlug(slug);

  if (!calculator) return null;

  const related = calculators.filter((calc) => calc.category === calculator.category && calc.slug !== calculator.slug).slice(0, 3);

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
                  <li>PDF exports for sharing and saving.</li>
                  <li>Optimized for mobile and fast loading.</li>
                </ul>
              </div>
              <LeadForm />
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
