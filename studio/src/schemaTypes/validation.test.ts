import assert from 'node:assert/strict'
import {describe, it} from 'node:test'

import {
  altTextRequired,
  caseStudyObjectsRequired,
  clientPermissionRequired,
  endNotBeforeStart,
  isLighthouseScore,
  liveUrlRequiredWhenLive,
  startOrPeriodLabelRequired,
  testDateRequiredForScores,
} from './validation.ts'

const image = {asset: {_ref: 'image-abc-1200x800-png'}}

describe('altTextRequired', () => {
  it('blocks an image with no alt text', () => {
    assert.equal(typeof altTextRequired(undefined, image), 'string')
    assert.equal(typeof altTextRequired('   ', image), 'string')
  })
  it('passes an image with alt text', () => {
    assert.equal(altTextRequired('Studio editing view', image), true)
  })
  it('passes when no image has been uploaded', () => {
    assert.equal(altTextRequired(undefined, undefined), true)
    assert.equal(altTextRequired(undefined, {asset: null}), true)
  })
})

describe('clientPermissionRequired', () => {
  it('passes a personal project with no client', () => {
    assert.equal(clientPermissionRequired({}), true)
  })
  it('blocks a client case study without confirmed permission', () => {
    assert.equal(typeof clientPermissionRequired({client: 'A client'}), 'string')
    assert.equal(
      typeof clientPermissionRequired({client: 'A client', clientPermission: {confirmed: false}}),
      'string',
    )
  })
  it('blocks confirmed permission with no date', () => {
    assert.equal(
      typeof clientPermissionRequired({client: 'A client', clientPermission: {confirmed: true}}),
      'string',
    )
  })
  it('passes confirmed, dated permission', () => {
    assert.equal(
      clientPermissionRequired({
        client: 'A client',
        clientPermission: {confirmed: true, confirmedOn: '2026-11-01'},
      }),
      true,
    )
  })
})

describe('testDateRequiredForScores', () => {
  it('passes when no scores are entered', () => {
    assert.equal(testDateRequiredForScores(undefined), true)
    assert.equal(testDateRequiredForScores({}), true)
  })
  it('blocks scores without a test date, including a score of 0', () => {
    assert.equal(typeof testDateRequiredForScores({performance: 98}), 'string')
    assert.equal(typeof testDateRequiredForScores({seo: 0}), 'string')
  })
  it('passes scores with a test date', () => {
    assert.equal(testDateRequiredForScores({performance: 98, testedOn: '2026-11-01'}), true)
  })
})

describe('isLighthouseScore', () => {
  it('accepts whole numbers from 0 to 100', () => {
    for (const n of [0, 57, 100]) assert.equal(isLighthouseScore(n), true)
    assert.equal(isLighthouseScore(undefined), true)
  })
  it('rejects decimals and out-of-range numbers', () => {
    for (const n of [-1, 101, 98.5]) assert.equal(typeof isLighthouseScore(n), 'string')
  })
})

describe('startOrPeriodLabelRequired', () => {
  it('blocks an entry with neither', () => {
    assert.equal(typeof startOrPeriodLabelRequired({}), 'string')
    assert.equal(typeof startOrPeriodLabelRequired({periodLabel: ' '}), 'string')
  })
  it('passes a start date or a period label', () => {
    assert.equal(startOrPeriodLabelRequired({start: '2017-07-01'}), true)
    assert.equal(startOrPeriodLabelRequired({periodLabel: '7 years'}), true)
  })
})

describe('endNotBeforeStart', () => {
  it('blocks an end before the start', () => {
    assert.equal(typeof endNotBeforeStart({start: '2022-09-01', end: '2020-03-01'}), 'string')
  })
  it('passes ordered or open-ended dates', () => {
    assert.equal(endNotBeforeStart({start: '2020-03-01', end: '2022-09-01'}), true)
    assert.equal(endNotBeforeStart({start: '2022-09-01'}), true)
  })
})

describe('liveUrlRequiredWhenLive', () => {
  it('blocks a live case study with no URL', () => {
    assert.equal(typeof liveUrlRequiredWhenLive(undefined, 'live'), 'string')
  })
  it('passes in-progress work without a URL', () => {
    assert.equal(liveUrlRequiredWhenLive(undefined, 'inProgress'), true)
  })
})

describe('caseStudyObjectsRequired', () => {
  it('lists every missing object field', () => {
    const result = caseStudyObjectsRequired({})
    assert.equal(typeof result, 'string')
    assert.match(result as string, /hero screenshot.*headline outcome.*timeline/)
  })
  it('treats an image without an uploaded asset as missing', () => {
    const result = caseStudyObjectsRequired({
      heroImage: {asset: null},
      outcome: {value: '98'},
      timeline: {start: '2026-01-01'},
    })
    assert.equal(result, 'Before publishing, add a hero screenshot.')
  })
  it('passes when all three are present', () => {
    assert.equal(
      caseStudyObjectsRequired({
        heroImage: {asset: {_ref: 'image-abc-1200x750-png'}},
        outcome: {value: '98'},
        timeline: {start: '2026-01-01'},
      }),
      true,
    )
  })
})
