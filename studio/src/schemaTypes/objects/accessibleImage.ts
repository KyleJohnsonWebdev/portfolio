import {ImageIcon} from '@sanity/icons'
import {defineField, defineType} from 'sanity'

import {altTextRequired} from '../validation'

/** Every image on the site uses this type, so alt text can never be skipped. */
export const accessibleImage = defineType({
  name: 'accessibleImage',
  title: 'Image',
  type: 'image',
  icon: ImageIcon,
  options: {hotspot: true},
  fields: [
    defineField({
      name: 'alt',
      title: 'Alternative text',
      type: 'string',
      description:
        'Describe what the image shows or proves, e.g. "Sanity Studio with the hero text field open". Never include student or client names that are not public.',
      validation: (rule) =>
        rule
          .custom((alt, context) =>
            altTextRequired(alt, context.parent as {asset?: {_ref?: string}}),
          )
          .error(),
    }),
    defineField({
      name: 'caption',
      type: 'string',
      description: 'Optional. Shown under the image.',
    }),
  ],
})
