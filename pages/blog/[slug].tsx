import { GetStaticPaths, GetStaticProps } from 'next';
import { NextSeo, ArticleJsonLd } from 'next-seo';
import Link from 'next/link';
import SectionHeading from '../../components/SectionHeading';
import { blogPosts, BlogPost } from '../../data/blogPosts';

type Props = {
  post: BlogPost;
};

export default function BlogDetail({ post }: Props) {
  return (
    <>
      <NextSeo title={`${post.title} - RupeePlanner`} description={post.excerpt} />
      <ArticleJsonLd
        url={`https://rupeeplanner.in/blog/${post.slug}`}
        title={post.title}
        images={[`https://rupeeplanner.in/og-cover.png`]}
        datePublished={post.date}
        authorName="RupeePlanner"
        description={post.excerpt}
      />

      <section className="section-pad">
        <div className="container-max py-10">
          <SectionHeading title={post.category} subtitle={post.title} />
          <div className="mb-6 flex flex-wrap gap-3 text-xs text-muted">
            <span>{post.date}</span>
            <span>{post.readTime}</span>
            {post.tags.map((tag) => (
              <span key={tag} className="badge">{tag}</span>
            ))}
          </div>
          <div className="space-y-4 text-sm text-muted">
            {post.content.map((paragraph, index) => (
              <p key={index}>{paragraph}</p>
            ))}
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {blogPosts.filter((item) => item.slug !== post.slug).slice(0, 3).map((item) => (
              <Link key={item.slug} href={`/blog/${item.slug}`} className="card">
                <p className="badge">{item.category}</p>
                <h3 className="mt-4 text-lg font-semibold text-text">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.excerpt}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async () => {
  return {
    paths: blogPosts.map((post) => ({ params: { slug: post.slug } })),
    fallback: false
  };
};

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  const slug = String(context.params?.slug || '');
  const post = blogPosts.find((item) => item.slug === slug);

  if (!post) {
    return { notFound: true };
  }

  return {
    props: { post }
  };
};
