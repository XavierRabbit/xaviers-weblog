import { client } from '../../sanity.client';
import CustomPortableText from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';
import Link from 'next/link';

async function getLinks() {
  const query = `*[_type == "post" && postType == "link"] | order(coalesce(publishedAt, _createdAt) desc) {
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

export default async function LinksPage() {
  const entries = await getLinks();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {entries.length === 0 ? (
          <p className="text-text-light opacity-50 font-mono">No links found.</p>
        ) : (
          entries.map((entry: any) => (
            <article key={entry._id} className="border-b border-surface-blue pb-8">
              <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-2 font-mono">
                <time>
                  {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                </time>
              </div>

              {entry.externalUrl ? (
                <a
                  href={entry.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <h2 className="text-2xl font-bold text-text-light group-hover:text-accent-red transition-colors mb-2">
                    {entry.title || entry.externalUrl} ↗
                  </h2>
                </a>
              ) : entry.slug?.current ? (
                <Link href={`/${entry.slug.current}`}>
                  <h2 className="text-2xl font-bold text-text-light hover:text-accent-red transition-colors mb-2">
                    {entry.title || 'Untitled Link'}
                  </h2>
                </Link>
              ) : (
                entry.title && (
                  <h2 className="text-2xl font-bold text-text-light mb-2">
                    {entry.title}
                  </h2>
                )
              )}

              <CustomPortableText value={entry.content} isListMode={true} />
            </article>
          ))
        )}
      </section>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}