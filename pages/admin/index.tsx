import { GetServerSideProps } from 'next';
import { NextSeo } from 'next-seo';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { blogPosts } from '../../data/blogPosts';

export default function AdminPage() {
  return (
    <>
      <NextSeo title="Admin - RupeePlanner" description="Manage blog posts, ads, and calculators." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Admin Panel" subtitle="Manage content and monetization" />
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Blog Posts</h3>
                <p className="mt-2 text-sm text-muted">Edit posts in data/blogPosts.ts or connect a CMS.</p>
                <div className="mt-4 space-y-3">
                  {blogPosts.slice(0, 5).map((post) => (
                    <div key={post.slug} className="rounded-2xl border border-white/10 p-4">
                      <p className="text-sm font-semibold text-text">{post.title}</p>
                      <p className="text-xs text-muted">{post.date}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Ad Slots</h3>
                <p className="mt-2 text-sm text-muted">Replace placeholders with AdSense or affiliate embeds.</p>
                <div className="mt-4 grid gap-3 md:grid-cols-2">
                  <AdSlot label="Header Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_TOP_BANNER} />
                  <AdSlot label="Sidebar Ad" adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_SIDEBAR} />
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Calculator Config</h3>
                <p className="mt-2 text-sm text-muted">Update calculators and FAQs in data/calculators.ts.</p>
              </div>
              <div className="card">
                <h3 className="text-lg font-semibold text-text">Leads Export</h3>
                <p className="mt-2 text-sm text-muted">Connect the /api/leads endpoint to Google Sheets or CRM.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const user = process.env.ADMIN_USER;
  const pass = process.env.ADMIN_PASS;

  if (!user || !pass) {
    return { notFound: true };
  }

  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Basic ')) {
    res.setHeader('WWW-Authenticate', 'Basic realm="RupeePlanner Admin"');
    res.statusCode = 401;
    res.end('Authentication required.');
    return { props: {} };
  }

  const encoded = auth.split(' ')[1] ?? '';
  const [inputUser, inputPass] = Buffer.from(encoded, 'base64').toString().split(':');
  if (inputUser !== user || inputPass !== pass) {
    res.setHeader('WWW-Authenticate', 'Basic realm="RupeePlanner Admin"');
    res.statusCode = 401;
    res.end('Invalid credentials.');
    return { props: {} };
  }

  return { props: {} };
};

