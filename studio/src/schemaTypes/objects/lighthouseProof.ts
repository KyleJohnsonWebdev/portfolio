import {CheckmarkCircleIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {isLighthouseScore, testDateRequiredForScores} from '../validation'

type Proof = Parameters<typeof testDateRequiredForScores>[0]

// Each score checks its range and that the test date is filled in. The date rule sits on the
// score fields because object-level rules only report warnings, which don't block publishing.
const score = (name: string, title: string) =>
  defineField({
    name,
    title,
    type: 'number',
    validation: (rule) => [
      rule.custom((value) => isLighthouseScore(value as number | undefined)).error(),
      rule
        .custom((value, context) =>
          value === undefined ? true : testDateRequiredForScores(context.parent as Proof),
        )
        .error(),
    ],
  })

/** Lighthouse mobile scores for the Proof Strip. Leave empty until there is a real report. */
export const lighthouseProof = defineType({
  name: 'lighthouseProof',
  title: 'Lighthouse proof',
  type: 'object',
  icon: CheckmarkCircleIcon,
  description: 'Mobile scores from a real Lighthouse run. Scores need the date they were tested.',
  fields: [
    score('performance', 'Performance'),
    score('accessibility', 'Accessibility'),
    score('bestPractices', 'Best practices'),
    score('seo', 'SEO'),
    defineField({name: 'testedOn', title: 'Tested on', type: 'date'}),
    defineField({
      name: 'reportUrl',
      title: 'Report URL',
      type: 'url',
      description: 'Link to the full Lighthouse report (JSON or HTML).',
    }),
  ],
})
