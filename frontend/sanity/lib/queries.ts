import {defineQuery} from 'next-sanity'

/** The siteSettings singleton: identity, home hero and contact links. */
export const siteSettingsQuery = defineQuery(`
  *[_id == "siteSettings"][0]{
    name,
    jobTitle,
    location,
    workMode,
    headline,
    positioning,
    email,
    linkedInUrl,
    githubUrl,
    repoUrl,
    seoDescription,
    ogImage
  }
`)
