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
  externalUrl?: string;
}

async function getPostsByType(type: string): Promise<Post[]> {
  const query = `*[_type == "post" && postType == $type] | order(coalesce(publishedAt, _createdAt) desc) {
    _id, title, postType, slug, _createdAt, _updatedAt, publishedAt, isEdited, content, externalUrl,
    "tags": tags[]->title
  }`;
  return await client.fetch(query, { type });
}

export default async function TypePage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const posts = await getPostsByType(resolvedParams.slug);

  return (
    <main className="max-w-6xl mx-auto p-10 w-full grid grid-cols-1 lg:grid-cols-12 gap-12">
      <div className="lg:col-span-8">
        <h1 className="text-xl font-bold text-text-light mb-6 uppercase tracking-wider opacity-50">
          Viewing: {resolvedParams.slug}
        </h1>
        {posts.map((post) => (
          <div key={post._id} className="mb-10 pb-10 border-b border-surface-blue last:border-0">
             {post.postType === 'quote' ? (
                <div className="mb-2">
                  <div className="prose prose-invert prose-xl prose-blue max-w-none text-text-light opacity-90 leading-relaxed font-serif italic border-l-4 border-accent-red pl-6 py-2 bg-surface-blue bg-opacity-20 rounded-r-lg">
                    <CustomPortableText value={post.content} isListMode />
                  </div>
                </div>
              ) : (
                <>
                  <Link href={`/entry/${post.slug?.current}`} className="group">
                    <h2 className="text-3xl font-semibold mb-4 group-hover:text-accent-red transition-colors leading-tight">
                      {post.title}
                    </h2>
                  </Link>
                  <div className="prose prose-invert prose-blue max-w-none text-text-light opacity-80 text-sm line-clamp-3">
                    <CustomPortableText value={post.content} isListMode />
                  </div>
                </>
              )}
              {post.tags && post.tags.length > 0 && (
                <div className="flex gap-3 mt-4">
                  {post.tags.map((tag: any) => {
                    if (typeof tag !== 'string') return null;
                    return (
                      <Link href={`/tag/${encodeURIComponent(tag)}`} key={tag} className="text-sm text-text-light opacity-60 hover:opacity-100 hover:text-accent-red transition-colors">
                        #{tag}
                      </Link>
                    );
                  })}
                </div>
              )}
          </div>
        ))}
      </div>
    </main>
  );
}