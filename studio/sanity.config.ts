/**
 * This config is used to configure your Sanity Studio.
 * Learn more: https://www.sanity.io/docs/configuration
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes, SINGLETON_TYPES} from './src/schemaTypes'
import {structure} from './src/structure'
import {
  presentationTool,
  defineDocuments,
  defineLocations,
  type DocumentLocation,
} from 'sanity/presentation'

// Environment variables for project configuration
const projectId = process.env.SANITY_STUDIO_PROJECT_ID || 'your-projectID'
const dataset = process.env.SANITY_STUDIO_DATASET || 'production'

// URL for preview functionality, defaults to localhost:3000 if not set
const SANITY_STUDIO_PREVIEW_URL = process.env.SANITY_STUDIO_PREVIEW_URL || 'http://localhost:3000'

const singletonTypes = new Set<string>(SINGLETON_TYPES)
// Singletons can be edited, published and reverted, but never duplicated or deleted.
const singletonActions = new Set(['publish', 'discardChanges', 'restore'])

const home = {title: 'Home', href: '/'} satisfies DocumentLocation

// Main Sanity configuration
export default defineConfig({
  name: 'default',
  title: 'Kyle Johnson Portfolio',

  projectId,
  dataset,

  plugins: [
    // Presentation tool configuration for Visual Editing
    presentationTool({
      previewUrl: {
        origin: SANITY_STUDIO_PREVIEW_URL,
        previewMode: {
          enable: '/api/draft-mode/enable',
        },
      },
      resolve: {
        // Which document a route shows. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#57720a5678d9
        mainDocuments: defineDocuments([
          {route: '/', filter: `_id == "siteSettings"`},
          {route: '/work/:slug', filter: `_type == "caseStudy" && slug.current == $slug`},
          {route: '/about', filter: `_id == "about"`},
          {route: '/resume', filter: `_id == "resume"`},
          {route: '/contact', filter: `_id == "siteSettings"`},
        ]),
        // Where a document appears on the site. https://www.sanity.io/docs/visual-editing/presentation-resolver-api#8d8bca7bfcd7
        locations: {
          siteSettings: defineLocations({
            message: 'Used in the header and footer on every page',
            tone: 'positive',
            locations: [home, {title: 'Contact', href: '/contact'}],
          }),
          caseStudy: defineLocations({
            select: {title: 'title', slug: 'slug.current'},
            resolve: (doc) => ({
              locations: [
                ...(doc?.slug ? [{title: doc.title || 'Untitled', href: `/work/${doc.slug}`}] : []),
                home,
              ],
            }),
          }),
          about: defineLocations({locations: [{title: 'About', href: '/about'}, home]}),
          resume: defineLocations({locations: [{title: 'Resume', href: '/resume'}]}),
        },
      },
    }),
    structureTool({
      structure, // Custom studio structure configuration, imported from ./src/structure
    }),
    visionTool(),
  ],

  // Schema configuration, imported from ./src/schemaTypes/index.ts
  schema: {
    types: schemaTypes,
    // Hide singletons from "Create new document" so a second copy can't be made.
    templates: (templates) => templates.filter(({schemaType}) => !singletonTypes.has(schemaType)),
  },

  document: {
    actions: (actions, {schemaType}) =>
      singletonTypes.has(schemaType)
        ? actions.filter(({action}) => action && singletonActions.has(action))
        : actions,
  },
})
