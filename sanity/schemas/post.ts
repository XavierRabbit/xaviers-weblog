export default {
  name: 'post',
  title: 'Post',
  type: 'document',
  fields: [
    {
      name: 'postType',
      title: 'Post Type',
      type: 'string',
      options: {
        list: [
          { title: 'Entry (Long-form)', value: 'entry' },
          { title: 'Link (Web Bookmark)', value: 'link' },
          { title: 'Today I Learned', value: 'til' },
          { title: 'Note (Short-form)', value: 'note' },
          { title: 'Quote', value: 'quote' },
          { title: 'Elsewhere (Travel/Physical)', value: 'elsewhere' },
        ],
        layout: 'radio',
      },
    },
    {
      name: 'title',
      title: 'Title',
      type: 'string',
      hidden: ({ document }: any) => document?.postType === 'quote',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      hidden: ({ document }: any) => document?.postType === 'quote',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
      description: 'Manually set the publication date. If left blank, the system uses the creation time.',
    },
    {
      name: 'isEdited',
      title: 'Mark as Edited',
      type: 'boolean',
    },
    {
      name: 'externalUrl',
      title: 'External URL',
      type: 'url',
      hidden: ({ document }: any) => !['elsewhere', 'link'].includes(document?.postType),
    },
    {
      name: 'content',
      title: 'Content',
      type: 'array',
      of: [
        { type: 'block' },
        {
          type: 'image',
          title: 'Image',
          options: {
            hotspot: true, // Allows you to crop the image inside the Studio
          },
          fields: [
            {
              name: 'alt',
              title: 'Alternative Text',
              type: 'string',
              description: 'Important for SEO and accessibility.',
            },
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }
          ]
        },
        // Add Video Embed Support (e.g., YouTube or Vimeo)
        {
          type: 'object',
          name: 'videoEmbed',
          title: 'Video URL',
          fields: [
            {
              name: 'url',
              title: 'Video URL',
              type: 'url',
            }
          ]
        },
        {
          type: 'file',
          name: 'localVideo',
          title: 'Upload Local Video',
          options: {
            accept: 'video/*', // This restricts the file picker to only show video files
          },
          fields: [
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            }
          ]
        }
      ],
    },
    {
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tag' }] }],
      description: 'Search for an existing tag, or type a new one and click "Create new Tag".',
    },
  ],
  preview: {
    select: {
      title: 'title',
      postType: 'postType',
      content: 'content',
    },
    prepare(selection: any) {
      const { title, postType, content } = selection;
      let displayTitle = title;
      if (postType === 'quote') {
        const block = (content || []).find((b: any) => b._type === 'block');
        const snippet = block && block.children ? block.children.map((c: any) => c.text).join('') : '';
        displayTitle = snippet ? `"${snippet.substring(0, 40)}${snippet.length > 40 ? '...' : ''}"` : 'Empty Quote';
      }
      return {
        title: displayTitle || 'Untitled',
        subtitle: postType,
      };
    },
  },
}