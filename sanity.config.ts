import { defineConfig } from 'sanity'
import { structureTool } from 'sanity/structure'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './sanity/schemas' 

export default defineConfig({
  name: 'default',
  title: 'Xavier.Business Studio',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,

  basePath: '/studio',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content Hub')
          .items([
            S.listItem()
              .title('All Posts')
              .child(S.documentTypeList('post').title('All Posts')),
            S.divider(),
            
            S.listItem()
              .title('Entries')
              .child(
                S.documentList()
                  .title('Entries')
                  .filter('_type == "post" && postType == "entry"')
                  .initialValueTemplates([
                    S.initialValueTemplateItem('post-type-template', { postType: 'entry' })
                  ])
              ),
              
            S.listItem()
              .title('Links')
              .child(
                S.documentList()
                  .title('Links')
                  .filter('_type == "post" && postType == "link"')
                  .initialValueTemplates([
                    S.initialValueTemplateItem('post-type-template', { postType: 'link' })
                  ])
              ),
              
            S.listItem()
              .title('Quotes')
              .child(
                S.documentList()
                  .title('Quotes')
                  .filter('_type == "post" && postType == "quote"')
                  .initialValueTemplates([
                    S.initialValueTemplateItem('post-type-template', { postType: 'quote' })
                  ])
              ),
              
            S.listItem()
              .title('Notes')
              .child(
                S.documentList()
                  .title('Notes')
                  .filter('_type == "post" && postType == "note"')
                  .initialValueTemplates([
                    S.initialValueTemplateItem('post-type-template', { postType: 'note' })
                  ])
              ),
              
            S.listItem()
              .title('Elsewhere')
              .child(
                S.documentList()
                  .title('Elsewhere')
                  .filter('_type == "post" && postType == "elsewhere"')
                  .initialValueTemplates([
                    S.initialValueTemplateItem('post-type-template', { postType: 'elsewhere' })
                  ])
              ),
              
            S.divider(),
            S.documentTypeListItem('tag').title('Tag Management'),
          ]),
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
    // This is the magic block that powers the automatic pre-filling
    templates: (prev) => [
      ...prev,
      {
        id: 'post-type-template',
        title: 'Post',
        schemaType: 'post',
        parameters: [{ name: 'postType', type: 'string' }],
        value: (params: any) => ({
          postType: params.postType,
        }),
      },
    ],
  },
})