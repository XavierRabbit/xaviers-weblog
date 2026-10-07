import { PortableText } from '@portabletext/react';
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

export default function CustomPortableText({ value, isListMode = false }: { value: any, isListMode?: boolean }) {
  if (!value) return null;

  const myPortableTextComponents = {
    types: {
      image: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        return (
          <figure className="my-8 flex justify-start">
            <img
              src={urlFor(value).url()}
              alt={value.alt || 'Blog Image'}
              // List mode: max 300px tall, width adjusts automatically, no cropping.
              // Single page: full width, height adjusts automatically.
              className={`rounded-lg shadow-lg ${
                isListMode ? 'max-h-[300px] w-auto object-contain' : 'w-full h-auto'
              }`}
            />
            {!isListMode && value.caption && (
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
        const videoId = isYouTube ? (value.url.split('v=')[1]?.split('&')[0] || value.url.split('youtu.be/')[1]) : null;

        if (isYouTube && videoId) {
          // List mode: scales down to a smaller max-width (e.g. 400px wide).
          // Single page: full width. Both keep the perfect 16:9 aspect ratio.
          return (
            <div className={`my-6 aspect-video ${isListMode ? 'max-w-md w-full' : 'w-full'}`}>
              <iframe
                src={`https://www.youtube.com/embed/${videoId}`}
                className="w-full h-full rounded-lg shadow-lg"
                allowFullScreen
              />
            </div>
          );
        }
        return (
          <a href={value.url} target="_blank" rel="noopener noreferrer" className="text-accent-red underline break-all my-4 block">
            {value.url}
          </a>
        );
      },
      localVideo: ({ value }: any) => {
        if (!value?.asset?._ref) return null;
        const videoUrl = getSanityFileUrl(value.asset._ref);

        return (
          <figure className="my-6 flex justify-start">
            <video 
              controls 
              preload="metadata" 
              // List mode: max 300px tall, width adjusts automatically to fit the video shape, no cropping.
              // Single page: full width, height adjusts automatically.
              className={`rounded-lg shadow-lg bg-surface-blue bg-opacity-20 ${
                isListMode ? 'max-h-[300px] w-auto object-contain' : 'w-full h-auto'
              }`}
            >
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            {!isListMode && value.caption && (
              <figcaption className="text-center text-sm text-text-light opacity-60 mt-3 italic w-full">
                {value.caption}
              </figcaption>
            )}
          </figure>
        );
      }
    },
  };

  return <PortableText value={value} components={myPortableTextComponents} />;
}