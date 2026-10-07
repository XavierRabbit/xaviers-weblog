import { client } from '../../sanity.client';
import CustomPortableText from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';
import Link from 'next/link';

async function getNotes() {
  const query = `*[_type == "post" && postType in ["note", "til"]] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    postType,
    title,
    slug,
    publishedAt,
    _createdAt,
    content
  }`;
  return await client.fetch(query);
}

export default async function NotesPage() {
  const entries = await getNotes();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {entries.length === 0 ? (
          <p className="text-text-light opacity-50 font-mono">No notes found.</p>
        ) : (
          entries.map((entry: any) => (
            <article key={entry._id} className="border-b border-surface-blue pb-8">
              <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-2 font-mono">
                <time>
                  {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                </time>
              </div>

              {entry.slug?.current ? (
                <Link href={`/${entry.slug.current}`}>
                  <h2 className="text-2xl font-bold text-text-light hover:text-accent-red transition-colors mb-4">
                    {entry.title || 'Untitled Note'}
                  </h2>
                </Link>
              ) : (
                entry.title && (
                  <h2 className="text-2xl font-bold text-text-light mb-4">
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