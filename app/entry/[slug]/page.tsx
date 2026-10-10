import { client } from '../../../sanity.client';
import Link from 'next/link';
import CustomPortableText from '../../components/CustomPortableText';
import SidebarTags from '../../components/SidebarTags';

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
  externalUrl?: string;
}

async function getPost(slug: string): Promise<Post | null> {
  const query = `*[_type == "post" && slug.current == $slug][0] {
    _id,
    title,
    postType,
    content,
    slug,
    externalUrl,
    _createdAt,
    _updatedAt,
    publishedAt,
    isEdited,
    "tags": tags[]->title
  }`;
  return await client.fetch(query, { slug });
}

export default async function EntryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const post = await getPost(resolvedParams.slug);

  if (!post) {
    return (
      <main className="max-w-6xl mx-auto p-10">
        <div className="text-text-light opacity-70 font-mono">Post not found.</div>
      </main>
    );
  }

  const activeDate = post.publishedAt || post._createdAt;
  const displayType = post.postType === 'til' ? 'note' : post.postType || 'entry';

  return (
    <main className="max-w-6xl mx-auto p-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
      <article className="lg:col-span-8">
        <header className="mb-10 pb-6 border-b border-surface-blue">
          <div className="flex items-center gap-3 text-xs text-accent-red font-medium mb-4 uppercase tracking-wider font-mono">
            <span>{displayType}</span>
            <span className="text-text-light opacity-50">•</span>
            <span>
              {new Date(activeDate).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
            {post.isEdited && (
              <>
                <span className="text-text-light opacity-50">•</span>
                <span className="text-text-light opacity-50 italic">
                  Updated{' '}
                  {new Date(post._updatedAt).toLocaleDateString('en-US', {
                    month: 'long',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </>
            )}
          </div>

          {post.title && (
            <h1 className="text-4xl md:text-5xl font-bold text-text-light leading-tight mb-4">
              {post.title}
            </h1>
          )}

          {/* Outbound Link Box for link and elsewhere entries */}
          {post.externalUrl && (
            <div className="mt-4 mb-2">
              <a
                href={post.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-surface-blue bg-surface-blue/20 text-sm font-mono text-accent-red hover:bg-surface-blue/40 transition-colors"
              >
                <span>External Link ↗</span>
                <span className="text-text-light/50 truncate max-w-xs sm:max-w-md">
                  ({post.externalUrl})
                </span>
              </a>
            </div>
          )}
        </header>

        {post.postType === 'quote' ? (
          <div className="prose prose-invert prose-2xl prose-blue max-w-none text-text-light opacity-90 leading-relaxed font-serif italic border-l-4 border-accent-red pl-8 py-4 bg-surface-blue bg-opacity-20 rounded-r-lg mt-8 mb-12">
            <CustomPortableText value={post.content} isListMode={false} />
          </div>
        ) : (
          <div className="prose prose-invert prose-lg prose-blue max-w-none text-text-light opacity-90 leading-relaxed">
            <CustomPortableText value={post.content} isListMode={false} />
          </div>
        )}

        {post.tags && post.tags.length > 0 && (
          <footer className="mt-16 pt-8 border-t border-surface-blue">
            <h3 className="text-sm font-bold text-text-light mb-4 uppercase tracking-wider opacity-50 font-mono">
              Filed Under
            </h3>
            <div className="flex flex-wrap gap-3">
              {post.tags.map((tag: any) => {
                if (typeof tag !== 'string') return null;
                return (
                  <Link
                    href={`/tag/${encodeURIComponent(tag)}`}
                    key={tag}
                    className="bg-surface-blue px-3 py-1.5 rounded-md text-sm font-medium text-text-light hover:text-accent-red transition-colors font-mono"
                  >
                    #{tag}
                  </Link>
                );
              })}
            </div>
          </footer>
        )}

        <div className="mt-12 pt-6 border-t border-surface-blue">
          <Link
            href="/"
            className="text-sm font-mono text-accent-red hover:underline inline-flex items-center gap-1"
          >
            ← Back to entries
          </Link>
        </div>
      </article>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}