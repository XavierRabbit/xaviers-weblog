import { client } from '../../sanity.client';
import CustomPortableText from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';

async function getQuotes() {
  const query = `*[_type == "post" && postType == "quote"] | order(coalesce(publishedAt, _createdAt) desc) {
    _id,
    _type,
    postType,
    publishedAt,
    _createdAt,
    content
  }`;
  return await client.fetch(query);
}

export default async function QuotesPage() {
  const entries = await getQuotes();

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {entries.length === 0 ? (
          <p className="text-text-light opacity-50 font-mono">No quotes found.</p>
        ) : (
          entries.map((entry: any) => (
            <article key={entry._id} className="border-b border-surface-blue pb-8">
              <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-4 font-mono">
                <time>
                  {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="border-l-2 border-accent-red pl-4 italic text-lg text-text-light">
                <CustomPortableText value={entry.content} isListMode={true} />
              </div>
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