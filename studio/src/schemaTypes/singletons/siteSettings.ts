import {CogIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** Site-wide identity, the home hero, contact links and defaults for search and social. */
export const siteSettings = defineType({
  name: 'siteSettings',
  title: 'Site settings',
  type: 'document',
  icon: CogIcon,
  groups: [
    {name: 'identity', title: 'Identity', default: true},
    {name: 'home', title: 'Home'},
    {name: 'contact', title: 'Contact'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Identity
    defineField({
      name: 'name',
      type: 'string',
      group: 'identity',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'jobTitle',
      title: 'Job title',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Design Engineer". Shown above the home headline.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'location',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Orlando, FL".',
    }),
    defineField({
      name: 'workMode',
      title: 'Work mode',
      type: 'string',
      group: 'identity',
      options: {
        list: [
          {title: 'Remote', value: 'remote'},
          {title: 'Hybrid', value: 'hybrid'},
          {title: 'On-site', value: 'onsite'},
        ],
        layout: 'radio',
      },
    }),
    defineField({
      name: 'timezone',
      type: 'string',
      group: 'identity',
      description: 'e.g. "Eastern Time". Shown on the Contact page.',
    }),

    // Home
    defineField({
      name: 'headline',
      type: 'string',
      group: 'home',
      description: 'The home page h1.',
      validation: (rule) => rule.required().max(90),
    }),
    defineField({
      name: 'positioning',
      type: 'text',
      rows: 2,
      group: 'home',
      description: 'One sentence under the headline.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'stats',
      title: 'At a glance',
      type: 'array',
      group: 'home',
      description: 'Up to four numbers for the home page. Each needs a source and a date.',
      of: [defineArrayMember({type: 'metric'})],
      validation: (rule) => rule.max(4),
    }),

    // Contact
    defineField({
      name: 'email',
      type: 'string',
      group: 'contact',
      validation: (rule) => rule.required().email(),
    }),
    defineField({
      name: 'linkedInUrl',
      title: 'LinkedIn URL',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'githubUrl',
      title: 'GitHub URL',
      type: 'url',
      group: 'contact',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'repoUrl',
      title: "This site's repo URL",
      type: 'url',
      group: 'contact',
      description: 'Linked as "View this site\'s source" in the footer.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'availability',
      type: 'text',
      rows: 2,
      group: 'contact',
      description:
        'e.g. "Open to remote design engineer roles on marketing and content-site teams."',
    }),
    defineField({
      name: 'resumePdf',
      title: 'Resume PDF',
      type: 'file',
      group: 'contact',
      options: {accept: 'application/pdf'},
    }),

    // SEO
    defineField({
      name: 'seoDescription',
      title: 'Default meta description',
      type: 'text',
      rows: 3,
      group: 'seo',
      validation: (rule) => rule.max(160).error('Keep the meta description to 160 characters.'),
    }),
    defineField({
      name: 'ogImage',
      title: 'Default social image',
      type: 'accessibleImage',
      group: 'seo',
      description: 'Used when a page has no social image of its own. 1200 × 630 works best.',
    }),
  ],
  preview: {prepare: () => ({title: 'Site settings'})},
})
