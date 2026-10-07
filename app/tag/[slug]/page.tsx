import { client } from '../../../sanity.client';
import Link from 'next/link';
import CustomPortableText from '../../components/CustomPortableText';

interface Post {
  _id: string;
  title: string;
  postType: string;
  slug: { current: string };
  tags: string[] | null;
  _createdAt: string;
  _updatedAt: string;
  publishedAt: string | null;
  isEdited: boolean | null;
  content: any;
}

async function getPostsByTag(tag: string): Promise<Post[]> {
  const query = `*[_type == "post" && $tag in tags[]->title] | order(coalesce(publishedAt, _createdAt) desc) {
    _id, title, postType, slug, _createdAt, _updatedAt, publishedAt, isEdited, content,
    "tags": tags[]->title
  }`;
  return await client.fetch(query, { tag } as any);
}

export default async function TagPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const currentTag = decodeURIComponent(resolvedParams.slug);
  const posts = await getPostsByTag(currentTag);

  return (
    <main className="max-w-6xl mx-auto p-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8">
        <h1 className="text-xl font-bold text-text-light mb-6 uppercase tracking-wider opacity-50">
          Tag: #{currentTag}
        </h1>
        {posts.length === 0 ? (
          <p className="text-text-light opacity-70">No posts found with this tag.</p>
        ) : (
          posts.map((post) => (
            <div key={post._id} className="mb-10 pb-10 border-b border-surface-blue last:border-0">
               <div className="flex items-center gap-3 text-xs text-accent-red font-medium mb-3 uppercase tracking-wider">
                  <span>{post.postType}</span>
                </div>
                <Link href={`/entry/${post.slug?.current}`} className="group">
                  <h2 className="text-3xl font-semibold mb-4 group-hover:text-accent-red transition-colors leading-tight">
                    {post.title || "Untitled Quote"}
                  </h2>
                </Link>
                <div className="prose prose-invert prose-blue max-w-none text-text-light opacity-80 text-sm line-clamp-3">
                  <CustomPortableText value={post.content} isListMode />
                </div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}