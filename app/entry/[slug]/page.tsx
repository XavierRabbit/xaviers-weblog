import { client } from '../../../sanity.client';
import Link from 'next/link';
import CustomPortableText from '../../components/CustomPortableText';
export const dynamic = 'force-dynamic';

interface Post {
  _id: string;
  title: string;
  postType: string;
  content: any;
  slug: { current: string };
  tags: string[] | null;
  _createdAt: string;
  _updatedAt: string;
  publishedAt: string | null;
  isEdited: boolean | null;
}

async function getPost(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == "${slug}"][0] {
    _id, title, postType, content, slug, _createdAt, _updatedAt, publishedAt, isEdited,
    "tags": tags[]->title
  }`;
  return await client.fetch(query);
}

export default async function EntryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) return <main className="max-w-6xl mx-auto p-10"><div className="text-text-light opacity-70">Post not found.</div></main>;

  const activeDate = post.publishedAt ? post.publishedAt : post._createdAt;

  return (
    <main className="max-w-6xl mx-auto p-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
      <article className="lg:col-span-8">
        <header className="mb-10 pb-6 border-b border-surface-blue">
          <div className="flex items-center gap-3 text-xs text-accent-red font-medium mb-4 uppercase tracking-wider">
            <span>{post.postType}</span>
            <span className="text-text-light opacity-50">•</span>
            <span>{new Date(activeDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
            {post.isEdited && (
              <>
                <span className="text-text-light opacity-50">•</span>
                <span className="text-text-light opacity-50 italic">
                  Updated {new Date(post._updatedAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </>
            )}
          </div>
          {post.title && (
            <h1 className="text-4xl md:text-5xl font-bold text-text-light leading-tight mb-6">
              {post.title}
            </h1>
          )}
        </header>

        {post.postType === 'quote' ? (
          <div className="prose prose-invert prose-2xl prose-blue max-w-none text-text-light opacity-90 leading-relaxed font-serif italic border-l-4 border-accent-red pl-8 py-4 bg-surface-blue bg-opacity-20 rounded-r-lg mt-8 mb-12">
            <CustomPortableText value={post.content} />
          </div>
        ) : (
          <div className="prose prose-invert prose-lg prose-blue max-w-none text-text-light opacity-90 leading-relaxed">
            <CustomPortableText value={post.content} />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-surface-blue">
            <h3 className="text-sm font-bold text-text-light mb-4 uppercase tracking-wider opacity-50">Filed Under</h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag: any) => {
                if (typeof tag !== 'string') return null;
                return (
                  <Link href={`/tag/${encodeURIComponent(tag)}`} key={tag} className="bg-surface-blue px-3 py-1.5 rounded-md text-sm font-medium text-text-light hover:text-accent-red transition-colors">
                    #{tag}
                  </Link>
                );
              })}
            </div>
          </footer>
        )}
      </article>
      <aside className="lg:col-span-4">
        {/* Your Author Sidebar */}
      </aside>
    </main>
  );
}