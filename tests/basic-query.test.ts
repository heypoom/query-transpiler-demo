import {test, expect} from 'vitest'
import {generateSql} from '../src/generate'

const FIELDS = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

test('generate a basic select query by default', () => {
  const expected = `SELECT * FROM 'data'`

  expect(generateSql('postgres', FIELDS, {})).toBe(expected)
  expect(generateSql('mysql', FIELDS, {})).toBe(expected)
})

test('generate limit clauses when present', () => {
  const fields = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

  expect(generateSql('postgres', fields, {limit: 10})).toBe(
    `SELECT * FROM 'data' LIMIT 10`
  )
})
