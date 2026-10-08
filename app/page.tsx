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
        {entries.map((entry: any) => (
          <article key={entry._id} className="border-b border-surface-blue pb-8">
            <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-2 font-mono">
              <time>
                {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
              </time>
              <span>•</span>
              <span className="uppercase tracking-wider bg-surface-blue bg-opacity-20 px-2 py-0.5 rounded">
                {entry.postType === 'til' ? 'note' : entry.postType || 'entry'}
              </span>
            </div>

            {entry.postType === 'link' && entry.externalUrl ? (
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
              <Link href={`/${entry.slug.current}`} className="group">
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

            <div className={entry.postType === 'quote' ? 'border-l-2 border-accent-red pl-4 italic text-lg' : ''}>
              <CustomPortableText value={entry.content} isListMode={true} />
            </div>

            {entry.slug?.current && entry.postType !== 'quote' && (
              <div className="mt-4">
                <Link
                  href={`/${entry.slug.current}`}
                  className="text-sm font-medium text-accent-red hover:underline inline-flex items-center gap-1"
                >
                  Read full entry <span>→</span>
                </Link>
              </div>
            )}
          </article>
        ))}
      </section>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}