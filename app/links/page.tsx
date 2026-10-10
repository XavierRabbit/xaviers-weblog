import Link from 'next/link';
import { client } from '../../sanity.client';
import CustomPortableText, { isContentTruncated } from '../components/CustomPortableText';
import SidebarTags from '../components/SidebarTags';
import Pagination from '../components/Pagination';

export const dynamic = 'force-dynamic';

const PAGE_SIZE = 10;
const PREVIEW_LENGTH = 5000;

async function getLinks(page: number) {
  const start = (page - 1) * PAGE_SIZE;
  const end = start + PAGE_SIZE;

  const query = `{
    "items": *[_type == "post" && postType == "link"] | order(coalesce(publishedAt, _createdAt) desc) [${start}...${end}] {
      _id,
      _type,
      postType,
      title,
      slug,
      externalUrl,
      publishedAt,
      _createdAt,
      content
    },
    "total": count(*[_type == "post" && postType == "link"])
  }`;
  return await client.fetch(query);
}

export default async function LinksPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || '1', 10));
  const { items, total } = await getLinks(currentPage);
  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 grid grid-cols-1 lg:grid-cols-12 gap-10">
      <section className="lg:col-span-8 space-y-12">
        {items.length === 0 ? (
          <p className="text-text-light opacity-50 font-mono">No links found.</p>
        ) : (
          items.map((entry: any) => {
            const needsReadMore =
              entry.slug?.current &&
              isContentTruncated(entry.content, PREVIEW_LENGTH);

            return (
              <article key={entry._id} className="border-b border-surface-blue pb-8">
                <div className="flex items-center gap-3 text-xs text-text-light opacity-50 mb-2 font-mono">
                  <time>
                    {new Date(entry.publishedAt || entry._createdAt).toLocaleDateString()}
                  </time>
                </div>

                {entry.slug?.current ? (
                  <Link href={`/entry/${entry.slug.current}`} className="group">
                    <h2 className="text-2xl font-bold text-text-light group-hover:text-accent-red transition-colors mb-2">
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

                {entry.externalUrl && (
                  <div className="mb-4">
                    <a
                      href={entry.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-2.5 py-1 rounded bg-surface-blue/20 text-accent-red hover:underline"
                    >
                      <span>Visit Link:</span>
                      <span className="truncate max-w-xs sm:max-w-md">{entry.externalUrl}</span>
                      <span>↗</span>
                    </a>
                  </div>
                )}

                <CustomPortableText
                  value={entry.content}
                  isListMode={true}
                  maxLength={PREVIEW_LENGTH}
                />

                {needsReadMore && (
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
          })
        )}

        <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/links" />
      </section>

      <aside className="lg:col-span-4 hidden lg:block">
        <SidebarTags />
      </aside>
    </main>
  );
}