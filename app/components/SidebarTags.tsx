import Link from 'next/link';
import { client } from '../../sanity.client';

interface TagData {
  title: string;
  count: number;
}

async function getTagsData(): Promise<TagData[]> {
  const query = `*[_type == "tag"] {
    title,
    "count": count(*[_type == "post" && references(^._id)])
  }[count > 0] | order(count desc, title asc)`;

  return await client.fetch(query);
}

export default async function SidebarTags() {
  const tags = await getTagsData();

  return (
    <div className="sticky top-10 bg-surface-blue bg-opacity-10 p-6 rounded-lg border border-surface-blue shadow-lg">
      <h3 className="text-sm font-bold text-text-light mb-6 uppercase tracking-wider opacity-50 border-b border-surface-blue pb-3">
        Topics & Tags
      </h3>
      <div className="flex flex-col items-start gap-3">
        {tags.map((tag) => (
          <Link
            key={tag.title}
            href={`/tag/${encodeURIComponent(tag.title)}`}
            className="group flex items-center justify-between w-full bg-surface-blue bg-opacity-40 hover:bg-opacity-80 px-4 py-2 rounded-md text-sm transition-all"
          >
            <span className="text-text-light group-hover:text-accent-red transition-colors">
              #{tag.title}
            </span>
            <span className="text-xs text-text-light opacity-60 bg-black bg-opacity-40 px-2 py-0.5 rounded-full font-mono">
              {tag.count}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}