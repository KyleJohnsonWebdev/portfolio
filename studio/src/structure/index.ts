import {CogIcon, DocumentPdfIcon, PresentationIcon, UserIcon} from '@sanity/icons'
import type {ComponentType} from 'react'
import type {StructureBuilder, StructureResolver} from 'sanity/structure'

/**
 * Studio navigation: the three singletons first, then case studies in site order.
 * Learn more: https://www.sanity.io/docs/structure-builder-introduction
 */

// A singleton opens straight into its one document; its id is the type name.
const singleton = (S: StructureBuilder, type: string, title: string, icon: ComponentType) =>
  S.listItem()
    .title(title)
    .id(type)
    .icon(icon)
    .child(S.document().schemaType(type).documentId(type).title(title))

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      singleton(S, 'siteSettings', 'Site settings', CogIcon),
      singleton(S, 'about', 'About', UserIcon),
      singleton(S, 'resume', 'Resume', DocumentPdfIcon),
      S.divider(),
      S.listItem()
        .title('Case studies')
        .id('caseStudy')
        .icon(PresentationIcon)
        .child(
          S.documentTypeList('caseStudy')
            .title('Case studies')
            .defaultOrdering([{field: 'order', direction: 'asc'}]),
        ),
    ])
