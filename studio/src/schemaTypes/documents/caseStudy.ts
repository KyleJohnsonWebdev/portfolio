import {PresentationIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

import {clientPermissionRequired, endNotBeforeStart, liveUrlRequiredWhenLive} from '../validation'

/**
 * A case study. Fields follow the page order: TL;DR → Proof Strip → hero → problem →
 * constraints → decisions → outcome → what's next.
 *
 * Missing facts don't get guessed: required fields stay empty and block publishing,
 * and the draft preview shows a Placeholder where they belong.
 */
type CaseStudyRuleFields = Parameters<typeof clientPermissionRequired>[0]

/*
 * Cross-field rules sit on a field that always has a value when the rule matters
 * (status, client, a score, an end date). Rules on whole objects or documents came back
 * as warnings in validation runs, and warnings don't block publishing. Every custom
 * rule also ends in .error() for the same reason.
 */

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case study',
  type: 'document',
  icon: PresentationIcon,
  groups: [
    {name: 'overview', title: 'Overview', default: true},
    {name: 'proof', title: 'Proof'},
    {name: 'story', title: 'Story'},
    {name: 'client', title: 'Client'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    // Overview
    defineField({
      name: 'title',
      type: 'string',
      group: 'overview',
      description: 'Usually the site name, e.g. "contextlayer.design".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      group: 'overview',
      description: 'The URL: /work/your-slug',
      options: {source: 'title', maxLength: 96},
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'order',
      type: 'number',
      group: 'overview',
      description: 'Position on the home page and in "Case study 1 of 3". 1 comes first.',
      validation: (rule) => rule.required().integer().min(1),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 2,
      group: 'overview',
      description: 'One sentence under the title and on the home page card.',
      validation: (rule) => rule.required().max(200),
    }),
    defineField({
      name: 'status',
      type: 'string',
      group: 'overview',
      options: {
        list: [
          {title: 'Live', value: 'live'},
          {title: 'In progress', value: 'inProgress'},
        ],
        layout: 'radio',
      },
      initialValue: 'inProgress',
      validation: (rule) => [
        rule.required(),
        rule
          .custom((status, context) =>
            liveUrlRequiredWhenLive(context.document?.liveUrl as string | undefined, status),
          )
          .error(),
      ],
    }),
    defineField({
      name: 'launchDate',
      type: 'date',
      group: 'overview',
      options: {dateFormat: 'MMM YYYY'},
      description: 'Planned launch, shown as "Launching Mar 2027". Leave empty if not set.',
      hidden: ({document}) => document?.status !== 'inProgress',
    }),
    defineField({
      name: 'tag',
      type: 'string',
      group: 'overview',
      description:
        'Short label on the card next to the status, e.g. "Sanity CMS" or "Design + build".',
      validation: (rule) => rule.max(24),
    }),
    defineField({
      name: 'role',
      type: 'string',
      group: 'overview',
      description: 'e.g. "Designer and developer".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'stack',
      type: 'array',
      group: 'overview',
      of: [defineArrayMember({type: 'string'})],
      options: {layout: 'tags'},
      validation: (rule) => rule.required().min(1).unique(),
    }),
    defineField({
      name: 'timeline',
      type: 'object',
      group: 'overview',
      options: {columns: 2},
      fields: [
        defineField({
          name: 'start',
          type: 'date',
          options: {dateFormat: 'MMM YYYY'},
          validation: (rule) => rule.required(),
        }),
        defineField({
          name: 'end',
          type: 'date',
          options: {dateFormat: 'MMM YYYY'},
          description: 'Empty means "present".',
          validation: (rule) =>
            rule
              .custom((_end, context) =>
                endNotBeforeStart(context.parent as {start?: string; end?: string}),
              )
              .error(),
        }),
      ],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'outcome',
      title: 'Headline outcome',
      type: 'metric',
      group: 'overview',
      description: 'The one number in the TL;DR and on the card, with its source and date.',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'liveUrl',
      title: 'Live URL',
      type: 'url',
      group: 'overview',
    }),
    defineField({name: 'repoUrl', title: 'Repo URL', type: 'url', group: 'overview'}),
    defineField({
      name: 'heroImage',
      type: 'accessibleImage',
      group: 'overview',
      description:
        'A real screenshot (or architecture sketch). Used in the browser frame and on the card.',
      validation: (rule) => rule.required().assetRequired(),
    }),

    // Proof
    defineField({name: 'proof', type: 'lighthouseProof', group: 'proof'}),
    defineField({
      name: 'metrics',
      type: 'array',
      group: 'proof',
      description: 'Supporting numbers for the Outcome section. Each needs a source and a date.',
      of: [defineArrayMember({type: 'metric'})],
    }),

    // Story
    defineField({
      name: 'problem',
      type: 'richText',
      group: 'story',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'constraints',
      type: 'array',
      group: 'story',
      description: 'Time, budget, audience or tech. One per line.',
      of: [defineArrayMember({type: 'string'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'decisions',
      title: 'Key decisions',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'decision'})],
      validation: (rule) => rule.required().min(2).max(3).error('Add two or three key decisions.'),
    }),
    defineField({
      name: 'outcomeStory',
      title: 'Outcome',
      type: 'richText',
      group: 'story',
      validation: (rule) => rule.required(),
    }),
    defineField({name: 'nextSteps', title: "What's next", type: 'richText', group: 'story'}),
    defineField({
      name: 'gallery',
      type: 'array',
      group: 'story',
      of: [defineArrayMember({type: 'accessibleImage'})],
      validation: (rule) => rule.max(4),
    }),

    // Client
    defineField({
      name: 'client',
      type: 'string',
      group: 'client',
      description:
        'Name the client only with their written permission. Leave empty for personal projects.',
      validation: (rule) =>
        rule
          .custom((_client, context) =>
            clientPermissionRequired(context.document as CaseStudyRuleFields),
          )
          .error(),
    }),
    defineField({
      name: 'clientPermission',
      type: 'object',
      group: 'client',
      hidden: ({document}) => !document?.client,
      fields: [
        defineField({
          name: 'confirmed',
          title: 'Client gave written permission to feature this work',
          type: 'boolean',
          initialValue: false,
        }),
        defineField({name: 'confirmedOn', title: 'Permission date', type: 'date'}),
      ],
    }),

    // SEO
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  orderings: [{title: 'Order', name: 'orderAsc', by: [{field: 'order', direction: 'asc'}]}],
  preview: {
    select: {title: 'title', order: 'order', status: 'status', media: 'heroImage'},
    prepare: ({title, order, status, media}) => ({
      title,
      subtitle: [order && `#${order}`, status === 'live' ? 'Live' : 'In progress']
        .filter(Boolean)
        .join(' · '),
      media,
    }),
  },
})
