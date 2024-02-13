import {test, expect} from 'vitest'
import {FIELDS, where} from './helpers'
import {generateWhereClause} from '../src/where-clause'

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
