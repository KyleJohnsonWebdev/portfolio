import {CogIcon} from '@sanity/icons'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/**
 * Structure builder controls how documents are grouped and listed in the Studio.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

const SINGLETON_TYPES = ['settings']

export const structure: StructureResolver = (S: StructureBuilder) =>
  S.list()
    .title('Website Content')
    .items([
      // Document types that are not singletons (none yet; step 3 adds caseStudy).
      ...S.documentTypeListItems().filter(
        (listItem) => !SINGLETON_TYPES.includes(listItem.getId()!),
      ),
      // Settings singleton: one fixed document id, so editors never create a second one.
      S.listItem()
        .title('Site Settings')
        .child(S.document().schemaType('settings').documentId('siteSettings'))
        .icon(CogIcon),
    ])
