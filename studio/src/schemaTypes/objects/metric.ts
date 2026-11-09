import {TrendUpwardIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** A number the site claims. It can't publish without a value, a source and a date. */
export const metric = defineType({
  name: 'metric',
  type: 'object',
  icon: TrendUpwardIcon,
  fields: [
    defineField({
      name: 'value',
      type: 'string',
      description: 'The number with its unit, e.g. "98", "10+", "40%". Never an estimate.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'label',
      type: 'string',
      description: 'What the number measures, e.g. "Lighthouse mobile performance".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'source',
      type: 'string',
      description: 'Where the number comes from, e.g. "Google Search Console".',
      validation: (rule) => rule.required().error('Every number needs a source.'),
    }),
    defineField({
      name: 'sourceUrl',
      title: 'Source URL',
      type: 'url',
      description: 'Optional link to the report or page that backs the number.',
    }),
    defineField({
      name: 'date',
      type: 'date',
      description: 'When the number was measured.',
      validation: (rule) => rule.required().error('Every number needs a date.'),
    }),
  ],
  preview: {
    select: {value: 'value', label: 'label', source: 'source', date: 'date'},
    prepare: ({value, label, source, date}) => ({
      title: [value, label].filter(Boolean).join(' · ') || 'New metric',
      subtitle: [source, date].filter(Boolean).join(' · ') || 'Missing source and date',
    }),
  },
})
