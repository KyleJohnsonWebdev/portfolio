import {UserIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** The About page, plus the short teaser shown on the home page. */
export const about = defineType({
  name: 'about',
  title: 'About',
  type: 'document',
  icon: UserIcon,
  groups: [
    {name: 'page', title: 'About page', default: true},
    {name: 'teaser', title: 'Home teaser'},
  ],
  fields: [
    defineField({
      name: 'headline',
      type: 'string',
      group: 'page',
      description: 'The About page h1.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'intro',
      type: 'text',
      rows: 3,
      group: 'page',
      description: 'One paragraph under the headline.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'story',
      type: 'richText',
      group: 'page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'portrait',
      type: 'accessibleImage',
      group: 'page',
      description: 'Also used in the home teaser.',
    }),
    defineField({
      name: 'path',
      title: 'The path here',
      type: 'array',
      group: 'page',
      of: [defineArrayMember({type: 'pathEntry'})],
    }),
    defineField({
      name: 'pathNote',
      title: 'Path note',
      type: 'text',
      rows: 2,
      group: 'page',
      description: 'One line under the timeline, e.g. the client work alongside it.',
    }),
    defineField({
      name: 'teaserTitle',
      title: 'Teaser title',
      type: 'string',
      group: 'teaser',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'teaserText',
      title: 'Teaser text',
      type: 'text',
      rows: 3,
      group: 'teaser',
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {prepare: () => ({title: 'About'})},
})
