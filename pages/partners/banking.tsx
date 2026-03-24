import { NextSeo } from 'next-seo';
import SectionHeading from '../../components/SectionHeading';
import LeadForm from '../../components/LeadForm';
import AdSlot from '../../components/AdSlot';

export default function BankingPartnersPage() {
  return (
    <>
      <NextSeo title="Banking Partners - RupeePlanner" description="Compare banking partners for loans and credit cards." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Banking Partners" subtitle="Find the right loan or credit card partner" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Popular banking options</h3>
                <p className="mt-2 text-sm text-muted">
                  Get matched with lenders offering home loans, personal loans, or credit cards based on your profile.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {['Home Loans', 'Personal Loans', 'Business Loans', 'Credit Cards'].map((item) => (
                    <div key={item} className="rounded-2xl bg-base p-4">
                      <p className="text-xs text-muted">{item}</p>
                      <p className="text-lg font-semibold text-text">Rates from 8.5%</p>
                    </div>
                  ))}
                </div>
              </div>
              <AdSlot label="Banking Partner Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
            </div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}

