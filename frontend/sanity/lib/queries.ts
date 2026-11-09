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

/** Every case study slug, for generateStaticParams. */
export const caseStudySlugsQuery = defineQuery(`
  *[_type == "caseStudy" && defined(slug.current)]{"slug": slug.current}
`)

/** One case study with its position in the list and the next one in order. */
export const caseStudyQuery = defineQuery(`
  *[_type == "caseStudy" && slug.current == $slug][0]{
    _id,
    title,
    "slug": slug.current,
    summary,
    status,
    launchDate,
    role,
    stack,
    timeline,
    outcome,
    liveUrl,
    repoUrl,
    heroImage,
    proof,
    metrics,
    problem,
    constraints,
    decisions,
    outcomeStory,
    nextSteps,
    gallery,
    seo,
    "position": count(*[_type == "caseStudy" && defined(slug.current) && order < ^.order]) + 1,
    "total": count(*[_type == "caseStudy" && defined(slug.current)]),
    "next": *[_type == "caseStudy" && defined(slug.current) && order > ^.order]
      | order(order asc)[0]{title, "slug": slug.current}
  }
`)

/** Everything the home page shows: hero, case study cards, stats and the About teaser. */
export const homeQuery = defineQuery(`
  {
    "settings": *[_id == "siteSettings"][0]{
      jobTitle,
      location,
      workMode,
      headline,
      positioning,
      stats
    },
    "caseStudies": *[_type == "caseStudy" && defined(slug.current)] | order(order asc){
      _id,
      title,
      "slug": slug.current,
      summary,
      status,
      launchDate,
      tag,
      outcome,
      heroImage
    },
    "about": *[_id == "about"][0]{
      teaserTitle,
      teaserText,
      portrait
    }
  }
`)
