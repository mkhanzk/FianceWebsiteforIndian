import { NextSeo } from 'next-seo';
import SectionHeading from '../../components/SectionHeading';
import LeadForm from '../../components/LeadForm';
import AdSlot from '../../components/AdSlot';

export default function InsurancePartnersPage() {
  return (
    <>
      <NextSeo title="Insurance Partners - RupeePlanner" description="Compare term and health insurance options." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Insurance Partners" subtitle="Protect your family with the right cover" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Coverage highlights</h3>
                <p className="mt-2 text-sm text-muted">
                  Compare premiums, coverage, and add-ons across top insurers tailored to your life stage.
                </p>
                <div className="mt-6 grid gap-3 md:grid-cols-2">
                  {['Term Insurance', 'Health Insurance', 'Family Floater', 'Critical Illness'].map((item) => (
                    <div key={item} className="rounded-2xl bg-base p-4">
                      <p className="text-xs text-muted">{item}</p>
                      <p className="text-lg font-semibold text-text">Coverage up to INR 1 Cr</p>
                    </div>
                  ))}
                </div>
              </div>
              <AdSlot label="Insurance Partner Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_IN_CONTENT} />
            </div>
            <LeadForm />
          </div>
        </div>
      </section>
    </>
  );
}

