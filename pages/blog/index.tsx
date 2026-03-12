import { NextSeo } from 'next-seo';
import Link from 'next/link';
import SectionHeading from '../../components/SectionHeading';
import AdSlot from '../../components/AdSlot';
import { blogPosts } from '../../data/blogPosts';

export default function BlogPage() {
  return (
    <>
      <NextSeo title="Blog - RupeePlanner" description="Latest personal finance insights for Indian investors." />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title="Blog" subtitle="SEO optimized financial guides" />
          <div className="grid gap-4 md:grid-cols-3">
            {blogPosts.map((post) => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="card">
                <p className="badge">{post.category}</p>
                <h3 className="mt-4 text-lg font-semibold text-text">{post.title}</h3>
                <p className="mt-2 text-sm text-muted">{post.excerpt}</p>
                <div className="mt-4 flex items-center justify-between text-xs text-muted">
                  <span>{post.date}</span>
                  <span>{post.readTime}</span>
                </div>
              </Link>
            ))}
          </div>
          <div className="mt-10">
            <AdSlot label="Blog Inline Ad" />
          </div>
        </div>
      </section>
    </>
  );
}
