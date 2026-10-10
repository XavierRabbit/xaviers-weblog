import { PortableText, PortableTextComponents } from '@portabletext/react';
import imageUrlBuilder from '@sanity/image-url';
import { client } from '../../sanity.client';

const builder = imageUrlBuilder(client);
function urlFor(source: any) {
  return builder.image(source);
}

function getSanityFileUrl(ref: string) {
  const [_file, id, extension] = ref.split('-');
  const { projectId, dataset } = client.config();
  return `https://cdn.sanity.io/files/${projectId}/${dataset}/${id}.${extension}`;
}

interface CustomPortableTextProps {
  value: any;
  isListMode?: boolean;
  maxLength?: number;
}

export default function CustomPortableText({
  value,
  isListMode = false,
  maxLength = 999,
}: CustomPortableTextProps) {
  if (!value || !Array.isArray(value)) return null;

  // 1. In Feed / List Mode: preview text only, truncated with ellipsis
  if (isListMode) {
    const textBlocks = value.filter((block: any) => block._type === 'block');
    if (textBlocks.length === 0) return null;

    const rawText = textBlocks[0]?.children
      ?.map((child: any) => child.text || '')
      .join('')
      .trim() || '';

    const previewText =
      rawText.length > maxLength
        ? `${rawText.substring(0, maxLength).trim()}...`
        : rawText;

    return (
      <div className="text-text-light/80 text-base leading-relaxed">
        <p>{previewText}</p>
      </div>
    );
  }

  // 2. In Full Reading Mode (/entry/[slug]): render full text + media components
  const myPortableTextComponents: PortableTextComponents = {
    block: {
      normal: ({ children }) => <p className="leading-relaxed mb-4">{children}</p>,
      h1: ({ children }) => <h1 className="text-3xl font-bold my-4 text-text-light">{children}</h1>,
      h2: ({ children }) => <h2 className="text-2xl font-bold my-3 text-text-light">{children}</h2>,
      h3: ({ children }) => <h3 className="text-xl font-semibold my-2 text-text-light">{children}</h3>,
      blockquote: ({ children }) => (
        <blockquote className="border-l-2 border-accent-red pl-4 italic my-4 text-text-light/90">
          {children}
        </blockquote>
      ),
    },
    list: {
      bullet: ({ children }) => <ul className="list-disc pl-5 my-3 space-y-1">{children}</ul>,
      number: ({ children }) => <ol className="list-decimal pl-5 my-3 space-y-1">{children}</ol>,
    },
    marks: {
      link: ({ children, value }) => {
        const rel = !value?.href?.startsWith('/') ? 'noreferrer noopener' : undefined;
        const target = !value?.href?.startsWith('/') ? '_blank' : undefined;
        return (
          <a
            href={value?.href}
            target={target}
            rel={rel}
            className="text-accent-red underline hover:opacity-80 transition-opacity"
          >
            {children}
          </a>
        );
      },
      code: ({ children }) => (
        <code className="bg-surface-blue/20 text-accent-red px-1.5 py-0.5 rounded font-mono text-sm">
          {children}
        </code>
      ),
    },
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <figure className="my-8 flex flex-col items-start">
            <img
              src={urlFor(value).url()}
              alt={value.alt || 'Blog Image'}
              className="w-full h-auto rounded-lg shadow-lg"
            />
            {value.caption && (
              <figcaption className="text-center text-sm text-text-light opacity-60 mt-3 italic w-full">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
      videoEmbed: ({ value }: any) => {
        if (!value?.url) return null;
        const isYouTube = value.url.includes('youtube.com') || value.url.includes('youtu.be');
        const videoId = isYouTube
          ? value.url.split('v=')[1]?.split('&')[0] || value.url.split('youtu.be/')[1]
          : null;

        if (isYouTube && videoId) {
          return (
            <div className="my-6 aspect-video w-full">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full rounded-lg shadow-lg"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <a
            href={value.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent-red underline break-all my-4 block"
          >
            {value.url}
          </a>
        );
      },
      localVideo: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        const videoUrl = getSanityFileUrl(value.asset._ref);

        return (
          <figure className="my-6 flex flex-col items-start">
            <video
              controls
              preload="metadata"
              className="w-full h-auto rounded-lg shadow-lg bg-surface-blue bg-opacity-20"
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {value.caption && (
              <figcaption className="text-center text-sm text-text-light opacity-60 mt-3 italic w-full">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      },
    },
  };

  return <PortableText value={value} components={myPortableTextComponents} />;
}