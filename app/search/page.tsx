import { client } from '../../sanity.client';
import CustomPortableText from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';
import Link from 'next/link';

async function searchEntries(term: string) {
  if (!term) return [];
  const query = `*[_type in ["post", "entry", "link", "quote", "note"] && (title match $term || pt::text(body) match $term)] | order(_createdAt desc) {
    _id, _type, title, slug, _createdAt, body, content
  }`;
  return await client.fetch(query, { term: `*${term}*` });
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const entries = await searchEntries(q || '');

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-8">
        <h1 className="text-xl font-mono text-text-light opacity-70">
          Search results for: <span className="text-accent-red font-bold">"{q || ''}"</span>
        </h1>
        {entries.length === 0 ? (
          <p className="text-text-light opacity-50">No matching entries found.</p>
        ) : (
          entries.map((entry: any) => (
            <article key={entry._id} className="border-b border-surface-blue pb-6">
              <Link href={`/${entry.slug?.current || ''}`}>
                <h2 className="text-xl font-bold text-text-light hover:text-accent-red mb-2">
                  {entry.title || 'Untitled'}
                </h2>
              </Link>
              <CustomPortableText value={entry.body || entry.content} isListMode={true} />
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