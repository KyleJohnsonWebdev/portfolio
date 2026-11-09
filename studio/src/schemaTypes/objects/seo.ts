import {SearchIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** Per-document search and social metadata. Empty fields fall back to the page title and summary. */
export const seo = defineType({
  name: 'seo',
  title: 'SEO',
  type: 'object',
  icon: SearchIcon,
  options: {collapsible: true, collapsed: true},
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (rule) =>
        rule.max(60).warning('Search results cut titles off around 60 characters.'),
    }),
    defineField({
      name: 'description',
      type: 'text',
      rows: 3,
      validation: (rule) => rule.max(160).error('Keep the meta description to 160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Social image',
      type: 'accessibleImage',
      description: 'Shown when the page is shared. 1200 × 630 works best.',
    }),
  ],
})
