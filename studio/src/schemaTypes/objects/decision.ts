import {BulbOutlineIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

/** One key decision and its tradeoff. "Cost" is required: a decision with no cost reads as marketing. */
export const decision = defineType({
  name: 'decision',
  type: 'object',
  icon: BulbOutlineIcon,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'The decision as an action, e.g. "Break every concept down three ways".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'chose', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({
      name: 'insteadOf',
      title: 'Instead of',
      type: 'text',
      rows: 2,
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'because', type: 'text', rows: 2, validation: (rule) => rule.required()}),
    defineField({
      name: 'cost',
      type: 'text',
      rows: 2,
      description: 'What was given up.',
      validation: (rule) => rule.required().error('Name what this decision cost.'),
    }),
  ],
  preview: {select: {title: 'title', subtitle: 'chose'}},
})
