import {DocumentPdfIcon} from '@sanity/icons'
import {defineArrayMember, defineField, defineType} from 'sanity'

/** The web resume. It should mirror the PDF in Site settings exactly. */
export const resume = defineType({
  name: 'resume',
  title: 'Resume',
  type: 'document',
  icon: DocumentPdfIcon,
  fields: [
    defineField({
      name: 'tagline',
      type: 'string',
      description: 'The line under your name, e.g. "Design Engineer · React and Sanity".',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'summary',
      type: 'text',
      rows: 4,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'experience',
      type: 'array',
      of: [defineArrayMember({type: 'experienceEntry'})],
      validation: (rule) => rule.required().min(1),
    }),
    defineField({
      name: 'skills',
      type: 'array',
      of: [defineArrayMember({type: 'skillGroup'})],
    }),
    defineField({
      name: 'education',
      type: 'array',
      of: [defineArrayMember({type: 'educationEntry'})],
    }),
  ],
  preview: {prepare: () => ({title: 'Resume'})},
})
