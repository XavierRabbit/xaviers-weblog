import Link from 'next/link';
import { client } from '../sanity.client';
import CustomPortableText from './components/CustomPortableText';
import SidebarTags from './components/SidebarTags';

export const dynamic = 'force-dynamic';

async function getUnifiedEntries() {
  const query = `*[_type == "post"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    postType,
    title,
    slug,
    externalUrl,
    publishedAt,
    _createdAt,
    content
  }`;
  return await client.fetch(query);
}

export default async function Home() {
  const entries = await getUnifiedEntries();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {entries.map((entry: any) => {
          const isQuote = entry.postType === 'quote';
          const isLink = entry.postType === 'link';
          const displayType = entry.postType === 'til' ? 'note' : entry.postType || 'entry';

          return (
            <article key={entry._id} className="border-b border-surface-blue pb-8">
              <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-2 font-mono">
                <time>
                  {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                </time>
                <span>•</span>
                <span className="uppercase tracking-wider bg-surface-blue bg-opacity-20 px-2 py-0.5 rounded">
                  {displayType}
                </span>
              </div>

              {isLink && entry.externalUrl ? (
                <a
                  href={entry.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h2 className="text-2xl font-bold text-text-light group-hover:text-accent-red transition-colors mb-4">
                    {entry.title || entry.externalUrl} ↗
                  </h2>
                </a>
              ) : entry.slug?.current ? (
                <Link href={`/entry/${entry.slug.current}`} className="group">
                  <h2 className="text-2xl font-bold text-text-light group-hover:text-accent-red transition-colors mb-4">
                    {entry.title || 'Untitled'}
                  </h2>
                </Link>
              ) : (
                entry.title && (
                  <h2 className="text-2xl font-bold text-text-light mb-4">
                    {entry.title}
                  </h2>
                )
              )}

              <div className={isQuote ? 'border-l-2 border-accent-red pl-4 italic text-lg' : ''}>
                <CustomPortableText
                  value={entry.content}
                  isListMode={!isQuote}
                  maxLength={220}
                />
              </div>

              {entry.slug?.current && !isQuote && (
                <div className="mt-4">
                  <Link
                    href={`/entry/${entry.slug.current}`}
                    className="text-sm font-medium text-accent-red hover:underline inline-flex items-center gap-1 font-mono"
                  >
                    Read full article <span>→</span>
                  </Link>
                </div>
              )}
            </article>
          );
        })}
      </section>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}