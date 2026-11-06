import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/**
 * Settings singleton. Kept from the template as the one document the layout and home
 * page read. Step 3 replaces it with the full `siteSettings` model from the brief.
 * Learn more: https://www.sanity.io/docs/create-a-link-to-a-single-edit-page-in-your-main-document-type-list
 */

export const settings = defineType({
  name: 'settings',
  title: 'Settings',
  type: 'document',
  icon: CogIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'description',
      description: 'Used on the Homepage',
      title: 'Description',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [],
          lists: [],
          marks: {decorators: [], annotations: []},
        }),
      ],
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image',
      type: 'image',
      description: 'Displayed on social cards and search engine results.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          description: 'Important for accessibility and SEO.',
          title: 'Alternative text',
          type: 'string',
          validation: (rule) =>
            rule.custom((alt, context) => {
              const image = (context.parent ?? {}) as {asset?: {_ref?: string}}
              if (image.asset?._ref && !alt) {
                return 'Required'
              }
              return true
            }),
        }),
        defineField({
          name: 'metadataBase',
          type: 'url',
          description: 'The public site URL, used to resolve relative metadata URLs.',
        }),
      ],
    }),
  ],
  preview: {
    prepare() {
      return {title: 'Settings'}
    },
  },
})
