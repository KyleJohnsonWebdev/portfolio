import {BookIcon, CaseIcon, OlistIcon, TagIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {endNotBeforeStart, startOrPeriodLabelRequired} from '../validation'

type DatedEntry = {start?: string; end?: string; periodLabel?: string}

/** One job on the web resume. Dates are optional only when a period label stands in for them. */
export const experienceEntry = defineType({
  name: 'experienceEntry',
  title: 'Experience',
  type: 'object',
  icon: CaseIcon,
  fields: [
    defineField({
      name: 'role',
      type: 'string',
      // The dates rule sits on an always-filled field: object-level rules only report warnings.
      validation: (rule) => [
        rule.required(),
        rule
          .custom((_role, context) => startOrPeriodLabelRequired(context.parent as DatedEntry))
          .error(),
      ],
    }),
    defineField({
      name: 'organization',
      type: 'string',
      description: 'Leave empty when the employer should not be named.',
    }),
    defineField({name: 'location', type: 'string', description: 'e.g. "Remote".'}),
    defineField({name: 'start', type: 'date', options: {dateFormat: 'MMM YYYY'}}),
    defineField({
      name: 'end',
      type: 'date',
      options: {dateFormat: 'MMM YYYY'},
      description: 'Leave empty for a current role ("Present").',
      validation: (rule) =>
        rule.custom((_end, context) => endNotBeforeStart(context.parent as DatedEntry)).error(),
    }),
    defineField({
      name: 'periodLabel',
      title: 'Period label',
      type: 'string',
      description: 'Use instead of dates when they are not known, e.g. "7 years".',
    }),
    defineField({
      name: 'bullets',
      type: 'array',
      of: [defineArrayMember({type: 'text', rows: 2})],
    }),
  ],
  preview: {
    select: {title: 'role', subtitle: 'organization'},
  },
})

/** A labelled group of skills, e.g. "Front end: React, TypeScript". */
export const skillGroup = defineType({
  name: 'skillGroup',
  title: 'Skill group',
  type: 'object',
  icon: TagIcon,
  fields: [
    defineField({name: 'group', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'items',
      type: 'array',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1).unique(),
    }),
  ],
  preview: {select: {title: 'group'}},
})

export const educationEntry = defineType({
  name: 'educationEntry',
  title: 'Education',
  type: 'object',
  icon: BookIcon,
  fields: [
    defineField({
      name: 'credential',
      type: 'string',
      description: 'e.g. "BFA, Web Design and Development".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'school', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'year',
      type: 'number',
      validation: (rule) => rule.integer().min(1950).max(2100),
    }),
    defineField({name: 'honors', type: 'string', description: 'e.g. "Valedictorian, 3.82 GPA".'}),
  ],
  preview: {select: {title: 'credential', subtitle: 'school'}},
})

/** One stop on the About page timeline ("The path here"). */
export const pathEntry = defineType({
  name: 'pathEntry',
  title: 'Path entry',
  type: 'object',
  icon: OlistIcon,
  fields: [
    defineField({
      name: 'period',
      type: 'string',
      description: 'Shown as a mono label, e.g. "7 years", "2019", "2022 – now".',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'title', type: 'string', validation: (rule) => rule.required()}),
    defineField({name: 'detail', type: 'text', rows: 2}),
  ],
  preview: {select: {title: 'title', subtitle: 'period'}},
})
