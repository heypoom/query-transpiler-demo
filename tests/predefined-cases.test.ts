import {test, expect} from 'vitest'

import {generateSql} from '../src'

test('pre-defined test cases', () => {
  const fields = {1: 'id', 2: 'name', 3: 'date_joined', 4: 'age'}

  expect(
    generateSql('postgres', fields, {where: ['=', ['field', 3], null]})
  ).toBe('SELECT * FROM data WHERE date_joined IS NULL')

  expect(
    generateSql('postgres', fields, {where: ['>', ['field', 4], 35]})
  ).toBe('SELECT * FROM data WHERE age > 35')

  expect(
    generateSql('postgres', fields, {
      where: ['and', ['<', ['field', 1], 5], ['=', ['field', 2], 'joe']],
    })
  ).toBe(`SELECT * FROM data WHERE id < 5 AND name = 'joe'`)

  expect(
    generateSql('postgres', fields, {
      where: [
        'or',
        ['!=', ['field', 3], '2015-11-01'],
        ['=', ['field', 1], 456],
      ],
    })
  ).toBe(`SELECT * FROM data WHERE date_joined != '2015-11-01' OR id = 456`)

  expect(
    generateSql('postgres', fields, {
      where: [
        'and',
        ['!=', ['field', 3], null],
        ['or', ['>', ['field', 4], 25], ['=', ['field', 2], 'Jerry']],
      ],
    })
  ).toBe(
    `SELECT * FROM data WHERE date_joined IS NOT NULL AND (age > 25 OR name = 'Jerry')`
  )
})
