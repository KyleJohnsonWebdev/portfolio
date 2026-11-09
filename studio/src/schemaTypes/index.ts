import {caseStudy} from './documents/caseStudy'
import {accessibleImage} from './objects/accessibleImage'
import {decision} from './objects/decision'
import {lighthouseProof} from './objects/lighthouseProof'
import {metric} from './objects/metric'
import {educationEntry, experienceEntry, pathEntry, skillGroup} from './objects/resumeEntries'
import {richText} from './objects/richText'
import {seo} from './objects/seo'
import {about} from './singletons/about'
import {resume} from './singletons/resume'
import {siteSettings} from './singletons/siteSettings'

/** Singleton types: one document each, at a fixed id equal to the type name. */
export const SINGLETON_TYPES = ['siteSettings', 'about', 'resume'] as const

export const schemaTypes = [
  // Singletons
  siteSettings,
  about,
  resume,
  // Documents
  caseStudy,
  // Objects
  accessibleImage,
  richText,
  metric,
  decision,
  lighthouseProof,
  seo,
  experienceEntry,
  skillGroup,
  educationEntry,
  pathEntry,
]
