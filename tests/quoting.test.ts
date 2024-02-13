import {test, expect} from 'vitest'

import {FIELDS, where} from './helpers'

import {generateWhereClause} from '../src/where-clause'
import {Dialect} from '../src/types/query'

test.each(['postgres', 'sqlserver'] as Dialect[])(
  'field names are quoted in PostgreSQL and SQL server',
  (dialect) => {
    const clause = generateWhereClause(
      ['is-empty', ['field', 1]],
      {1: 'foo-bar'},
      dialect
    )

    expect(clause).toBe(`"foo-bar" IS NULL`)
  }
)

test('field names are quoted in MySQL', () => {
  const clause = generateWhereClause(
    ['is-empty', ['field', 1]],
    {1: 'foo-bar'},
    'mysql'
  )

  expect(clause).toBe('`foo-bar` IS NULL')
})

test('string literals are quoted', () => {
  expect(where(['=', ['field', 1], 'Book'])).toBe(`id = 'Book'`)
})

test('string literals are escaped properly', () => {
  expect(
    generateWhereClause(['=', ['field', 1], `a'`], FIELDS, 'postgres')
  ).toBe(`id = 'a'''`)

  expect(generateWhereClause(['=', ['field', 1], `a'`], FIELDS, 'mysql')).toBe(
    `id = 'a'''`
  )
})
