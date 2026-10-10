import { client } from '../../sanity.client';
import CustomPortableText from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';
import Pagination from '../components/Pagination';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;

async function getQuotes(page: number) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const query = `{
    "items": *[_type == "post" && postType == "quote"] | order(coalesce(publishedAt, _createdAt) desc) [${start}...${end}] {
      _id,
      _type,
      postType,
      publishedAt,
      _createdAt,
      content
    },
    "total": count(*[_type == "post" && postType == "quote"])
  }`;
  return await client.fetch(query);
}

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const { items, total } = await getQuotes(currentPage);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {items.length === 0 ? (
          <p className="text-text-light opacity-50 font-mono">No quotes found.</p>
        ) : (
          items.map((entry: any) => (
            <article key={entry._id} className="border-b border-surface-blue pb-8">
              <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-4 font-mono">
                <time>
                  {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                </time>
              </div>

              <div className="border-l-2 border-accent-red pl-4 italic text-lg text-text-light">
                <CustomPortableText value={entry.content} isListMode={false} />
              </div>
            </article>
          ))
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/quotes" />
      </section>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}