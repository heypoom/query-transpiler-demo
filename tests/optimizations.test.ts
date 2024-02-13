import {describe, it, expect} from 'vitest'
import {FIELDS, where} from './helpers'
import {optimizeFilter} from '../src/optimizer'
import {WhereFilter} from '../src/types/query'
import {generateSql} from '../src'

describe('filter optimization', () => {
  it('retains the original filter if it cannot be optimized', () => {
    const input = ['!=', ['field', 4], 20, 30] as WhereFilter
    expect(optimizeFilter(input)).deep.equal(input)
  })

  it('optimizes out the statements that are always true or always false', () => {
    expect(where(['is-empty', null])).toBe('')
    expect(where(['not-empty', null])).toBe('FALSE')
  })

  it('flattens compound filters', () => {
    const actual = ['and', ['and', ['and', 1, 2], 3], 4] as WhereFilter
    const expected = ['and', 1, 2, 3, 4]

    expect(optimizeFilter(actual)).deep.equal(expected)
  })

  it('flattens double negations filters', () => {
    expect(optimizeFilter(['not', ['not', 1]])).deep.equal(1)
    expect(optimizeFilter(['not', ['not', ['not', 1]]])).deep.equal(['not', 1])
    expect(optimizeFilter(['not', ['not', ['not', ['not', 1]]]])).deep.equal(1)

    expect(
      optimizeFilter(['not', ['not', ['not', ['not', ['not', 1]]]]])
    ).deep.equal(['not', 1])
  })

  it('should reflect the optimization in the output SQL', () => {
    expect(generateSql('postgres', FIELDS, {where: ['not', ['not', true]]}))

    expect(
      generateSql('postgres', FIELDS, {
        where: [
          'and',
          ['and', ['>', ['field', 1], 5], ['<', ['field', 2], 10]],
          ['=', ['field', 3], 'joe'],
        ],
      })
    ).toBe(
      `SELECT * FROM data WHERE id > 5 AND name < 10 AND date_joined = 'joe'`
    )
  })
})
